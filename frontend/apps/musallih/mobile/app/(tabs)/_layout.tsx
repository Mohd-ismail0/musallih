import { Redirect, Tabs } from "expo-router";
import { Map, CalendarDays, Compass, ClipboardList, User } from "lucide-react-native";
import { theme } from "../../src/theme/theme";
import { useMobileAuth } from "../../src/auth/AuthProvider";

export default function TabsLayout() {
  const { status } = useMobileAuth();
  if (status !== "authenticated") {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          minHeight: 62,
          paddingTop: theme.spacing.xs,
          paddingBottom: theme.spacing.xs,
        },
        tabBarLabelStyle: {
          fontFamily: theme.fonts.sans,
          fontSize: 12,
          fontWeight: "600",
        },
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.foreground,
        headerTitleStyle: { fontFamily: theme.fonts.sans },
      }}
    >
      <Tabs.Screen
        name="map"
        options={{
          title: "Map",
          tabBarIcon: ({ color, size }) => <Map color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="prayer"
        options={{
          title: "Prayer",
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, size }) => <Compass color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: "Requests",
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
