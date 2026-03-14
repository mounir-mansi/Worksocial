import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/pages/HomeScreen/HomeScreen';
import ConnexionScreen from './src/pages/connexionScreen/ConnexionScreen';
import BarNav from './src/pages/BarNav/BarNav';
import InscriptionMobileScreen from './src/pages/InscriptionWebMobil/InscriptionMobileScreen/InscriptionMobileScreen';
import InscriptionWebScreen from './src/pages/InscriptionWebMobil/InscriptionWebScreen/InscriptionWebScreen';
import MembersScreen from './src/pages/DrawerPages/MembersScreen/MembresScreen';
import MyProfileScreen from './src/pages/DrawerPages/ProfileScreen/MyProfileScreen/MyProfilScreen';
import EditProfileScreen from './src/pages/DrawerPages/ProfileScreen/EditProfileScreen';
import CreatePostScreen from './src/pages/DrawerPages/CreatePostScreen';
import { AuthProvider, useAuth } from "./src/utils/useConnecte";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import de InscriptionStep5 uniquement pour la version mobile
import InscriptionStep5 from './src/pages/InscriptionWebMobil/InscriptionMobileScreen/InscriptionStep5';

const Stack = createStackNavigator();

// Configuration de linking pour le web
const linking = {
  config: {
    screens: {
      Home: 'HomeScreen',
      Connexion: 'connexion',
    },
  },
};

let DrawerNavigator;
if (Platform.OS !== 'web') {
  DrawerNavigator = require('./src/components/DrawerNavigator').default;
}

const AppContent = () => {
  const { isLoggedIn, logout } = useAuth();
  useEffect(() => {
    const checkTokenExpiration = async () => {
      const tokenExpiryTime = await AsyncStorage.getItem("tokenExpiryTime");
      const currentTime = new Date().getTime();
      console.log("tokenExpiryTime", tokenExpiryTime);
      if (currentTime > tokenExpiryTime) {
        console.log("Token expiré. Déconnexion automatique...");
        logout();
      }
    };

    // Vérifier l'expiration du token toutes les minutes
    const interval = setInterval(checkTokenExpiration, 4 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [logout]);

  return (
    <NavigationContainer linking={Platform.OS === 'web' ? linking : undefined}>
      {Platform.OS === 'web' && <BarNav />}

      <Stack.Navigator>
        {Platform.OS === 'web' ? (
          <>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ConnexionScreen" component={ConnexionScreen} />
            <Stack.Screen name="InscriptionScreen" component={InscriptionWebScreen} />
            <Stack.Screen name="MembersScreen" component={MembersScreen} />
            {isLoggedIn && <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />}
          </>
        ) : isLoggedIn ? (
          <>
            <Stack.Screen name="Drawer" component={DrawerNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="MyProfileScreen" component={MyProfileScreen} />
            <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
            <Stack.Screen name="CreerPost" component={CreatePostScreen} />
            {/* Inclure InscriptionStep5 uniquement pour la plateforme mobile */}
            <Stack.Screen name="InscriptionStep5" component={InscriptionStep5} />
          </>
        ) : (
          <>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="ConnexionScreen" component={ConnexionScreen} />
            <Stack.Screen name="InscriptionScreen" component={InscriptionMobileScreen} />
            <Stack.Screen name="MembersScreen" component={MembersScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
