import { createStackNavigator } from "@react-navigation/stack";
import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem, DrawerNavigationOptions } from "@react-navigation/drawer";
import api from "./services/api";
import utils from "../utils/utils";
import getTheme from "./theme/components";
import variables from "./theme/variables/commonColor";
import { StyleProvider } from "native-base";
import React, { createContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ToastAndroid } from "react-native";
import { navigationRef } from "./navigation/RootNavigation";
import API from "./services/api";

export const AuthContext = createContext({
  navigation: null
} as any);

function SignInScreen({ navigation }) {
  const { signIn } = React.useContext(AuthContext);
  return (
    <StyleProvider style={getTheme(variables)}>
      <LoginScreen signIn={signIn} />
    </StyleProvider>
  )
}

function NotificationsScreen2({ navigation }) {
  const { signOut } = React.useContext(AuthContext);
  return (
      <NotificationsScreen navigation={navigation} signOut={signOut} />
  );
}

export default function IndexApp({ navigation }) {

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => { //Se ejecuta al inizializar
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await utils.getStoreData('token');
      } catch (e) {
        // Restoring token failed
      }
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        try {
          const response = await new API(null).login(data.phoneNumber, data.password);
          if (response) {
            dispatch({ type: 'SIGN_IN', token: response });
          }
        } catch (error) {
          ToastAndroid.show(`${error.message}`, ToastAndroid.SHORT);
        }
      },
      signOut: async () => {
        await utils.deleteStoreData();
        dispatch({ type: 'SIGN_OUT' })
      }
    }),
    []
  );
  const AuthStackNavigator = createStackNavigator();
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer ref={navigationRef}>
        <AuthStackNavigator.Navigator>
          {state.isLoading ? (
            // We haven't finished checking for the token yet
            <AuthStackNavigator.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          ) : state.userToken == null ? (
            // No token found, user isn't signed in
            <AuthStackNavigator.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'Sign in',
                headerShown: false,
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          ) : (
                <AuthStackNavigator.Screen options={{ headerShown: false }} name="Home" component={Home} />
              )}
        </AuthStackNavigator.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

function Home({ navigation }) {
  const AppDrawerNavigator = createDrawerNavigator();
  const { signOut } = React.useContext(AuthContext);

  return (
    <AppDrawerNavigator.Navigator drawerContent={props => CustomDrawerContent(props, signOut)}>
      <AppDrawerNavigator.Screen name="Home" component={NotificationsScreen2}/>
    </AppDrawerNavigator.Navigator>
  );
}

function CustomDrawerContent(props, signOut) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Logout"
        onPress={() => signOut()}

      />
    </DrawerContentScrollView>
  );
}