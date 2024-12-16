import { NavigationContainer } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons';

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import PubDetail from './assets/screens/PubDetail';
import HomeScreen from './assets/screens/HomeScreen';
import ProfileScreen from './assets/screens/ProfileScreen';
import Login from './assets/screens/Login';
import { AuthContextProvider } from "./AuthContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <AuthContextProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home"
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName = 'home';
              if (route.name === "Home") {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === "Profile") {
                iconName = focused ? 'person-circle' : 'person-circle-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            headerShown: false  // Ensure headers are not shown on any tab screens
          })}
        >
          <Tab.Screen name="Profile" component={ProfileTab} />
          <Tab.Screen name="Home" component={HomeTab} />
        </Tab.Navigator>
      </NavigationContainer>
    </AuthContextProvider>
  );
}

function HomeTab() {
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerTitle: "",
        headerTransparent: true}}>
          <Stack.Group>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="PubScreen" component={PubDetail} />
          </Stack.Group>
    </Stack.Navigator>
  );
}

function ProfileTab() {
  return (
    <Stack.Navigator initialRouteName="ProfileScreen" 
    screenOptions={{ headerShown: false }}>
      <Stack.Group>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="LoginScreen" component={Login} />
      </Stack.Group>
    </Stack.Navigator>
  );
}