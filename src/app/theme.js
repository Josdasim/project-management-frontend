import { Card, createTheme } from "@mantine/core";

export const theme = createTheme({
    primaryColor: 'sky',
    primaryShade: { light: 6, dark: 5},
    colors: {
        sky: [
            '#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8',
            '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e',
        ],
    },
    defaultRadius: 'md',
    cursorType: 'pointer',
    headings: {fontWeight: '700'},
    components: {
        Card: { defaultProps: { shadow: 'xs'}},
        Paper: { defaultProps: { shadow: 'xs'}}
    }
})