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
                widgetBgBlank: { value: "#F3EFEC5F" },
                /*accent: { value: "#7AF0A4" },
                        statusSuccess: { value: "#21E91A" },
                        statusError: { value: "#F6143A" },
                        statusWarning: { value: "#F99807" },
                        statusInfo: { value: "blue" },*/
                moka: {

                    50: { value: '#fafafa' },
                    100: { value: '#f5f5f5' },
                    200: { value: '#e5e5e5' },
                    300: { value: '#d4d4d4' },
                    400: { value: '#a1a1a1' },
                    500: { value: '#737373' },
                    600: { value: '#525252' },
                    700: { value: '#404040' },
                    800: { value: '#262626' },
                    900: { value: '#171717' },
                    950: { value: '#0a0a0a' },

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
                    subtle: { value: "{colors.moka.100}" },
                    emphasized: { value: "{colors.moka.300}" },
                    focusRing: { value: "{colors.moka.500}" },
                },
            },
        },
    },
});

export const system = createSystem(defaultConfig, customConfig);
