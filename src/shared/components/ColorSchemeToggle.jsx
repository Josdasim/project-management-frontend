import { Switch, useComputedColorScheme, useMantineColorScheme } from "@mantine/core";

function ColorSchemeToggle({ lableColor }) {
    const { setColorScheme } = useMantineColorScheme()
    const scheme = useComputedColorScheme('light')
    const isDark = scheme === 'dark'

    return (
        <Switch
            checked={isDark}
            onChange={() => setColorScheme(isDark ? 'light' : 'dark')}
            label={isDark ? 'Oscuro' : 'Claro'}
            arial-label="Cambiar entre modo claro y modo oscuro"
            styles={{ label: { color: lableColor, minWidth: 48 }}}
        />
    )
}

export default ColorSchemeToggle