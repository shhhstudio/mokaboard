import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
    globalCss: {
        body: {
            colorPalette: "moka",
        },
    },
    theme: {
        tokens: {
            fonts: {
                body: { value: "var(--font-inter)" },
            },

            colors: {
                widgetBg: { value: "#F3EFEC" },
                /*accent: { value: "#7AF0A4" },
                        statusSuccess: { value: "#21E91A" },
                        statusError: { value: "#F6143A" },
                        statusWarning: { value: "#F99807" },
                        statusInfo: { value: "blue" },*/
                moka: {
                    50: { value: "#f0fdf4" },
                    100: { value: "#dcfce7" },
                    200: { value: "#bbf7d0" },
                    300: { value: "#86efac" },
                    400: { value: "#4ade80" },
                    500: { value: "#22c55e" },
                    600: { value: "#16a34a" },
                    700: { value: "#116932" },
                    800: { value: "#124a28" },
                    900: { value: "#042713" },
                    950: { value: "#03190c" },
                    success: { value: "{colors.green.400}" },
                    error: { value: "{colors.red.500}" },
                    warning: { value: "{colors.orange.500}" },
                    info: { value: "{colors.blue.400}" },
                },
            },
        },
        semanticTokens: {
            colors: {
                moka: {
                    solid: { value: "{colors.moka.500}" },
                    contrast: { value: "{colors.moka.100}" },
                    fg: { value: "{colors.moka.700}" },
                    muted: { value: "{colors.moka.100}" },
                    subtle: { value: "{colors.moka.200}" },
                    emphasized: { value: "{colors.moka.300}" },
                    focusRing: { value: "{colors.moka.500}" },

                },
            },
        },
    },
});

export const system = createSystem(defaultConfig, customConfig);
