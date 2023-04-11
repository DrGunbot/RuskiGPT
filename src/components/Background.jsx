// Import necessary dependencies
import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
// import "../assets/styles/BackgroundAnimation.css";

// Log a message to the console
console.log("Hello, nosy! We don't make mistakes.")

// Define the Background component
const Background = () => {
    // Define a callback function to initialize particles engine
    const particlesInit = useCallback(async engine => {
        // Load the full TSParticles library
        await loadFull(engine);
    }, []);

    // Define a callback function to handle loaded particles container
    const particlesLoaded = useCallback(async container => {
        // This function can be used to perform any necessary actions after particles are loaded
    }, []);

    // Return the Particles component with specified options and callbacks
    return (
        <Particles
        id="tsparticles"
        className="particles-bg"
        init={particlesInit}
        loaded={particlesLoaded}
            options={{
                // Specify background color
                background: {
                    color: {
                        value: "#222",
                    },
                },
                // Limit the frame rate to 60 FPS
                fpsLimit: 60,
                // Define interactivity events and modes
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "repulse",
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 1,
                        },
                        repulse: {
                            distance: 100,
                            duration: 0.4,
                        },
                    },
                },
                // Specify particle settings
                particles: {
                    color: {
                        value: "#228C22",
                    },
                    links: {
                        color: "#333333",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 2,
                    },
                    collisions: {
                        enable: true,
                    },
                    move: {
                        directions: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 2,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "polygon",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                // Detect retina displays
                detectRetina: true,
            }}
            />
            );
          };
          
          // Export the Background component
          export default Background;