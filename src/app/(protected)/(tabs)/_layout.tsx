import { router, Tabs } from "expo-router"
import { CustomTabBar } from '@/components';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ tabBarShowLabel: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="(home)" options={{ headerShown: false }} />
      <Tabs.Screen name="search" options={{ title: '搜尋' }} />
      <Tabs.Screen
        name="plus"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/newPost');
          },
        }}
      />
      <Tabs.Screen name="notifications" options={{ title: '動態' }} />
      <Tabs.Screen name="(profile)" options={{ headerShown: false }} />
    </Tabs>
  )
}