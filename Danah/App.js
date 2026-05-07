import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

import { AuthProvider } from './context/AuthContext';

import HomeDashboardScreen from './screens/HomeDashboardScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import ServicesHubScreen from './screens/ServicesHubScreen';
import CommunityFeedScreen from './screens/CommunityFeedScreen';
import CreatePostScreen from './screens/CreatePostScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function PlaceholderScreen({ route }) {
  return (
    <View style={styles.placeholder}>
      <Text style={styles.placeholderEmoji}>🚧</Text>

      <Text style={styles.placeholderTitle}>
        {route.name}
      </Text>

      <Text style={styles.placeholderSub}>
        قيد الإنشاء
      </Text>
    </View>
  );
}

/* ---------------- HOME STACK ---------------- */

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="HomeMain"
        component={HomeDashboardScreen}
      />

      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
    </Stack.Navigator>
  );
}

/* ---------------- COMMUNITY STACK ---------------- */

function CommunityStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="CommunityFeed"
        component={CommunityFeedScreen}
      />

      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
      />
    </Stack.Navigator>
  );
}

/* ---------------- SERVICES STACK ---------------- */

function ServicesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="ServicesHub"
        component={ServicesHubScreen}
      />

      <Stack.Screen
        name="PetCareGuide"
        component={PlaceholderScreen}
      />

      <Stack.Screen
        name="Map"
        component={PlaceholderScreen}
      />

      <Stack.Screen
        name="AdoptionBrowse"
        component={PlaceholderScreen}
      />

      <Stack.Screen
        name="HostingBrowse"
        component={PlaceholderScreen}
      />

      <Stack.Screen
        name="Reminders"
        component={PlaceholderScreen}
      />
    </Stack.Navigator>
  );
}

/* ---------------- MAIN TABS ---------------- */

function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#5C8D6E',
        tabBarInactiveTintColor: '#9AA8B8',

        tabBarStyle: {
          backgroundColor: '#FFFFFF',

          borderTopColor: '#E8EDF2',
          borderTopWidth: 1,

          height: 64,

          paddingTop: 6,
          paddingBottom: 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: 'home-outline',
            Community: 'people-outline',
            Services: 'grid-outline',
            Profile: 'person-outline',
          };

          return (
            <Ionicons
              name={icons[route.name] || 'ellipse-outline'}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: 'الرئيسية' }}
      />

      <Tab.Screen
        name="Community"
        component={CommunityStack}
        options={{ title: 'المجتمع' }}
      />

      <Tab.Screen
        name="Services"
        component={ServicesStack}
        options={{ title: 'الخدمات' }}
      />

      <Tab.Screen
        name="Profile"
        component={PlaceholderScreen}
        options={{ title: 'حسابي' }}
      />
    </Tab.Navigator>
  );
}

/* ---------------- APP ---------------- */

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <MainTabs />
      </NavigationContainer>
    </AuthProvider>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F0E8',
  },

  placeholderEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },

  placeholderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2933',
    marginBottom: 8,
  },

  placeholderSub: {
    fontSize: 14,
    color: '#888',
  },
});
