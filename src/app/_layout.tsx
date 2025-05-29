import '../../global.css'
import { Slot } from "expo-router"
import { ThemeProvider, DarkTheme } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { AuthProvider } from '@/providers/AuthProvider'
import { BottomSheetProvider } from '@/providers/BottomSheetProvider'

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
        <AuthProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <BottomSheetProvider>
              <Slot />
            </BottomSheetProvider>
          </GestureHandlerRootView>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}