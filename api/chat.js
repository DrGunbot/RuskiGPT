// api/chat.js
const { Configuration, OpenAIApi } = require("openai");
const { body, validationResult } = require("express-validator");
const { createClient } = require("@supabase/supabase-js");

const openaiConfiguration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_API
);

const openai = new OpenAIApi(openaiConfiguration);

module.exports = async (req, res) => {
  if (req.method === "POST") {
    try {
      await body("messages")
        .isArray()
        .withMessage("messages must be an array")
        .run(req);
      await body("connectedAccountAddress")
        .isString()
        .withMessage("connectedAccountAddress must be a string")
        .run(req);

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { messages, connectedAccountAddress } = req.body;

      const { data: user, error } = await supabase
        .from("user_tokens")
        .select("*")
        .eq("wallet_address", connectedAccountAddress)
        .single();

      if (error || !user) {
        console.error("Error fetching user from the database:", error);
        return res.status(500).json({ message: "Ваш кошелек, кажется, подключен, но вы не приобрели никаких токенов. Чтобы использовать бота, вам необходимо приобрести токены и быть добавленным в базу данных." });
      }

      if (user.tokens_owned <= 0) {
        return res.status(403).json({
          message:
            "You have no tokens left. Please purchase more tokens to continue using the chatbot.",
        });
      }

      const giveBirthToFrank = `You are an AI language model called Frank `;
      const initialSystemMessage = {
        role: "system",
        content: giveBirthToFrank,
      };
      const openAIResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          initialSystemMessage,
          ...messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        ],
      });
      const response = openAIResponse.data.choices[0].message.content;

      const { data: updatedUser, error: updateError } = await supabase
        .from("user_tokens")
        .update({ tokens_owned: user.tokens_owned - 1 })
        .eq("wallet_address", connectedAccountAddress);

      if (updateError) {
        console.error("Error updating user tokens in the database:", updateError);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      res.json(response);
    } catch (error) {
      console.error("Error communicating with OpenAI:", error);
      res.status(500).json({
        message:
          "Internal Server Error. Your request has been logged and will be investigated.",
      });
    }
  } else {
    res.status(405).send("Method not allowed");
  }
};
