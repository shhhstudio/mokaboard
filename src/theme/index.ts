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

                    on_track: { value: "{colors.green.400}" },
                    at_risk: { value: "{colors.yellow.500}" },
                    fail: { value: "{colors.red.500}" },
                    none: { value: "{colors.gray.300}" },

                    background: {
                        on_track: { value: "{colors.green.100}" },
                        at_risk: { value: "{colors.orange.100}" },
                        fail: { value: "{colors.red.100}" },
                        none: { value: "{colors.gray.100}" },
                        solid: { value: "#F3EFEC" },
                        subtle: { value: "#F3EFEC5F" },
                    }
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
