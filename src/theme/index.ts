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
                    50: { value: '#f2faeb' },
                    100: { value: '#e3f4d3' },
                    200: { value: '#c9e9ad' },
                    300: { value: '#b1de8c' },
                    400: { value: '#87c853' },
                    500: { value: '#67ad35' },
                    600: { value: '#4f8927' },
                    700: { value: '#3d6922' },
                    800: { value: '#345420' },
                    900: { value: '#2e481f' },
                    950: { value: '#15270c' },
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
