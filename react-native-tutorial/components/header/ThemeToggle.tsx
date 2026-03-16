import { MoonStarIcon, SunIcon } from 'lucide-react-native'
import { Uniwind, useUniwind } from 'uniwind'
import { Icon } from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import { Mode } from '@/lib/theme'

const THEME_ICONS = {
    light: SunIcon,
    dark: MoonStarIcon,
}

export function ThemeToggle() {
    const { theme } = useUniwind()

    function toggleTheme() {
        const newTheme = theme === 'dark' ? 'light' : 'dark'
        Uniwind.setTheme(newTheme)
    }

    return (
        <Button onPressIn={toggleTheme} size="icon" variant="ghost" className="ios:size-9 web:mx-4 rounded-full">
            <Icon as={THEME_ICONS[theme as Mode]} className="size-5" />
        </Button>
    )
}