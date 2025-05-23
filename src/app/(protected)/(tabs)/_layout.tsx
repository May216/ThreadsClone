import { router, Tabs } from "expo-router"
import { CustomTabBar } from '@/components';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ tabBarShowLabel: false }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="(home)" options={{ headerShown: false }} />
      <Tabs.Screen name="search" />
      <Tabs.Screen
        name="plus"
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/new');
          },
        }}
      />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="profile" />
    </Tabs>
  )
}