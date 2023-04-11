export const menuVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 1, ease: "easeInOut" } },
    closed: { opacity: 0, x: "100%", transition: { duration: 1, ease: "easeInOut" } },
  };
  
  export const navItemVariants = {
    open: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeInOut" } },
    closed: { opacity: 0, y: -50, transition: { duration: 1, ease: "easeInOut" } },
    hover: { scale: 1.1, color: "#50ae55", transition: { duration: 0.5, ease: "easeInOut" } },
  };
  
  export const navTitleVariants = {
    hover: { scale: 1.2, transition: { duration: 0.5, ease: "easeInOut" } },
  };
  
  export const hamburgerLineVariants = {
    closed: { rotate: 0, y: 0, transition: { duration: 1, ease: "easeInOut" } },
    open: (index) => ({
      rotate: index === 1 ? 45 : -45,
      y: [15, -15][index],
      transition: { duration: 1, ease: "easeInOut" }
    }),
  };
  