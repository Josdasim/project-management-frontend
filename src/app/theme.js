import { Card, createTheme } from "@mantine/core";

export const theme = createTheme({
    primaryColor: 'indigo',
    defaultRadius: 'md',
    cursorType: 'pointer',
    headings: {fontWeight: '700'},
    components: {
        Card: { defaultProps: { shadow: 'xs'}},
        Paper: { defaultProps: { shadow: 'xs'}}
    }
})