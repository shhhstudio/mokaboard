module.exports = {
  presets: [
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
        development: process.env.NODE_ENV === "development",
        importSource:
          process.env.NODE_ENV === "development"
            ? "@welldone-software/why-did-you-render"
            : "react",
      },
    ],
  ],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          "@": "./src",
        },
      },
    ],
  ],
};
