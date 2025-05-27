import '../../global.css'
import { Slot } from "expo-router"
import { ThemeProvider, DarkTheme } from '@react-navigation/native'
import { AuthProvider } from '@/providers/AuthProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ActionSheetProvider } from '@expo/react-native-action-sheet'

const queryClient = new QueryClient()

const myTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: 'white',
    card: '#101010',
    background: '#101010',
  }
}

export default function RootLayout() {
  return (
    <ThemeProvider value={myTheme}>
      <QueryClientProvider client={queryClient}>
        <ActionSheetProvider>
          <AuthProvider>
            <Slot />
          </AuthProvider>
        </ActionSheetProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}