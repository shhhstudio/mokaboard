import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
    globalCss: {
        body: {
            colorPalette: "yellow",
        },
    },
    theme: {
        tokens: {
            fonts: {
                body: { value: "var(--font-outfit)" },
            },
            colors: {
                widgetBg: { value: "#F3EFEC" },
                accent: { value: "#7AF0A4" },
                statusSuccess: { value: "#21E91A" },
                statusError: { value: "#F6143A" },
                statusWarning: { value: "#F99807" },
                statusInfo: { value: "blue" },
            },
        },
        semanticTokens: {
            radii: {
                l1: { value: "0.5rem" },
                l2: { value: "0.75rem" },
                l3: { value: "1rem" },
            },
        },
    },
});

