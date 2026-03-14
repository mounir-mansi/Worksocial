<!-- Généré par l'orchestrateur IA — Agent: Mobile React Native — 2026-03-11T10:01:55.372Z -->



# Analyse complète de l'application mobile Worksocial — React Native

---

## ⚠️ Constat préliminaire : Code mobile ABSENT

Après analyse minutieuse du code source fourni, **il n'y a AUCUN code React Native dans le projet**. Le code fourni est exclusivement :

- **Backend** Node.js/Express (API REST + WebSocket)
- La mention "Frontend : React (servi en statique)" dans l'architecture fait référence à une app web React (déployée sur Netlify), **pas une app React Native**

Le projet mobile doit donc être **créé de zéro**. Voici l'analyse complète et la proposition d'architecture mobile.

---

## 1. État actuel : Ce qu'il faudrait que l'app mobile fasse

En se basant sur le backend existant, l'app mobile doit couvrir :

### Écrans nécessaires

| Module | Écrans | Priorité |
|--------|--------|----------|
| **Auth** | Login, Register (multi-step), Forgot Password, Reset Password, Email Verification | P0 |
| **Feed** | Liste posts/events/surveys (flux unifié), Détail post, Détail event, Détail survey | P0 |
| **Création** | Créer post, Créer event, Créer survey | P0 |
| **Interactions** | Commentaires, Likes, Votes | P0 |
| **Profil** | Mon profil, Profil utilisateur, Modifier profil, Modifier mot de passe | P1 |
| **Chat** | Liste conversations, Chat individuel (WebSocket), Groupes | P1 |
| **Entreprise** | Détail entreprise, Membres | P2 |
| **Recherche** | Recherche utilisateurs | P2 |

---

## 2. Problèmes identifiés dans le backend qui impactent le mobile

### 2.1 Problèmes critiques pour l'app mobile

| # | Problème | Impact mobile | Solution proposée |
|---|----------|---------------|-------------------|
| 1 | **Pas de refresh token** — JWT expire en 4h, aucun mécanisme de renouvellement | L'utilisateur sera déconnecté brutalement toutes les 4h | Implémenter un interceptor côté mobile avec détection 401 + redirect login |
| 2 | **Email hardcodé dans reset password** (`nyukeit@outlook.com`) | Reset password ne fonctionne pour personne | Corriger côté backend (cf. `UserControllers.js:getUserByEmail`) |
| 3 | **URL de reset hardcodée** (`http://localhost:5173`) | Deep linking impossible | Utiliser un schéma d'URL dynamique ou un deep link `worksocial://` |
| 4 | **Votes multiples** — Pas de contrainte UNIQUE sur `survey_votes` | Un tap rapide = votes dupliqués | Ajouter un guard côté mobile + correction backend |
| 5 | **Likes multiples** — Pas de UNIQUE sur les tables likes | Double-tap = like dupliqué | Toggle like avec debounce côté mobile |
| 6 | **Images servies en statique** (`/upload/filename`) | URLs relatives ne marchent pas sur mobile | Construire l'URL complète `${API_BASE_URL}/upload/${filename}` |
| 7 | **CORS hardcodé** pour Netlify uniquement | L'app mobile sera bloquée par CORS | Ajouter l'origin mobile ou `*` pour le dev |
| 8 | **Pas de pagination** — `findAll()` retourne TOUT | Performances catastrophiques sur listes longues | FlatList avec pagination côté mobile + ajout pagination backend |

### 2.2 Incohérences API à gérer côté mobile

```
- POST /login retourne {authToken, user, message} → OK
- POST /logout attend le token dans Authorization header → OK
- GET /users/:id ne filtre pas les champs sensibles (hashedPassword exposé!) → Filtrer côté mobile
- POST /posts attend un multipart/form-data (Multer) → Utiliser FormData
- Les routes de likes envoient userId dans le body, pas extrait du token → Incohérence de sécurité
```

---

## 3. Architecture mobile proposée

### Structure du projet

```
worksocial-mobile/
├── app.json
├── App.tsx
├── babel.config.js
├── tsconfig.json
├── src/
│   ├── api/
│   │   ├── client.ts              # Axios instance + interceptors
│   │   ├── auth.ts                # Login, register, logout, etc.
│   │   ├── posts.ts               # CRUD posts
│   │   ├── events.ts              # CRUD events
│   │   ├── surveys.ts             # CRUD surveys
│   │   ├── comments.ts            # Comments pour post/event/survey
│   │   ├── likes.ts               # Likes
│   │   ├── chat.ts                # Individual chat
│   │   └── users.ts               # User operations
│   ├── components/
│   │   ├── common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   ├── CachedImage.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── feed/
│   │   │   ├── PostCard.tsx
│   │   │   ├── EventCard.tsx
│   │   │   ├── SurveyCard.tsx
│   │   │   ├── CommentItem.tsx
│   │   │   └── LikeButton.tsx
│   │   ├── chat/
│   │   │   ├── ChatBubble.tsx
│   │   │   └── ChatInput.tsx
│   │   └── auth/
│   │       └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── usePosts.ts
│   │   ├── useDebounce.ts
│   │   └── useWebSocket.ts
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   └── types.ts
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   ├── ForgotPasswordScreen.tsx
│   │   │   └── VerifyEmailScreen.tsx
│   │   ├── feed/
│   │   │   ├── FeedScreen.tsx
│   │   │   ├── PostDetailScreen.tsx
│   │   │   ├── EventDetailScreen.tsx
│   │   │   └── SurveyDetailScreen.tsx
│   │   ├── create/
│   │   │   ├── CreatePostScreen.tsx
│   │   │   ├── CreateEventScreen.tsx
│   │   │   └── CreateSurveyScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── EditProfileScreen.tsx
│   │   └── chat/
│   │       ├── ChatListScreen.tsx
│   │       └── ChatScreen.tsx
│   ├── services/
│   │   ├── secureStorage.ts       # Wrapper expo-secure-store
│   │   └── socketService.ts       # WebSocket manager
│   ├── types/
│   │   ├── api.ts
│   │   └── models.ts
│   └── utils/
│       ├── constants.ts
│       ├── imageUtils.ts
│       └── dateUtils.ts
```

---

## 4. Code des composants critiques

### 4.1 Stockage sécurisé des tokens — `secureStorage.ts`

```typescript
// src/services/secureStorage.ts
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'worksocial_auth_token';
const USER_KEY = 'worksocial_user_data';

/**
 * CRITIQUE : On utilise UNIQUEMENT expo-secure-store pour les tokens.
 * - iOS : Keychain
 * - Android : EncryptedSharedPreferences (API 23+) / Keystore
 * 
 * JAMAIS AsyncStorage pour des données sensibles !
 */

export const SecureStorage = {
  async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
      });
    } catch (error) {
      console.error('Failed to save token to secure storage:', error);
      throw error;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get token from secure storage:', error);
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to remove token from secure storage:', error);
    }
  },

  /**
   * Pour les données utilisateur non-sensibles (nom, avatar URL),
   * on peut utiliser SecureStore aussi (limite 2048 bytes par clé).
   * Pour des données plus volumineuses non-sensibles, AsyncStorage est OK.
   */
  async setUser(user: object): Promise<void> {
    try {
      // On filtre les champs sensibles AVANT le stockage
      const safeUser = sanitizeUser(user);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(safeUser));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  },

  async getUser(): Promise<object | null> {
    try {
      const data = await SecureStore.getItemAsync(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  },

  async clearAll(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(TOKEN_KEY),
      SecureStore.deleteItemAsync(USER_KEY),
    ]);
  },
};

/**
 * CRITIQUE : Le backend renvoie hashedPassword dans la réponse user.
 * On doit ABSOLUMENT le filtrer avant stockage.
 */
function sanitizeUser(user: any): object {
  const { hashedPassword, ...safeUser } = user;
  return safeUser;
}
```

### 4.2 Client API avec gestion d'authentification — `client.ts`

```typescript
// src/api/client.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { SecureStorage } from '../services/secureStorage';
import { API_BASE_URL } from '../utils/constants';

// Événement custom pour signaler un logout forcé
type AuthEventCallback = () => void;
let onForceLogout: AuthEventCallback | null = null;

export const setOnForceLogout = (callback: AuthEventCallback) => {
  onForceLogout = callback;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 secondes — important sur mobile (réseau instable)
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Intercepteur de requête : injecte le token automatiquement
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStorage.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Intercepteur de réponse : gère les erreurs d'auth
 * 
 * PROBLÈME IDENTIFIÉ : Le backend n'a PAS de refresh token.
 * Le JWT expire après 4h et la seule option est de re-login.
 * 
 * Stratégie :
 * 1. Sur 401 → clear token + redirect vers login
 * 2. Informer l'utilisateur que sa session a expiré
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Token expiré ou blacklisté
      await SecureStorage.clearAll();

      // Déclencher le logout dans le contexte React
      if (onForceLogout) {
        onForceLogout();
      }

      return Promise.reject(new Error('Session expired. Please log in again.'));
    }

    // Gestion des erreurs réseau (mode hors-ligne)
    if (!error.response) {
      return Promise.reject(
        new Error('Network error. Please check your internet connection.')
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

### 4.3 Constantes — `constants.ts`

```typescript
// src/utils/constants.ts
import { Platform } from 'react-native';

/**
 * DIFFÉRENCE iOS/Android : 
 * - iOS Simulator : localhost fonctionne
 * - Android Emulator : localhost = l'émulateur lui-même, 
 *   il faut utiliser 10.0.2.2 pour accéder au host machine
 * - Device physique : utiliser l'IP du réseau local ou l'URL du serveur déployé
 */
const DEV_API_URL = Platform.select({
  ios: 'http://localhost:5000',
  android: 'http://10.0.2.2:5000',
  default: 'http://localhost:5000',
});

// En production, utiliser l'URL du backend déployé
const PROD_API_URL = 'https://api.worksocial.example.com';

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

export const IMAGE_BASE_URL = `${API_BASE_URL}/upload`;

export const WS_URL = __DEV__
  ? Platform.select({
      ios: 'ws://localhost:5000',
      android: 'ws://10.0.2.2:5000',
      default: 'ws://localhost:5000',
    })
  : 'wss://api.worksocial.example.com';
```

### 4.4 Contexte d'authentification — `AuthContext.tsx`

```tsx
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { SecureStorage } from '../services/secureStorage';
import { setOnForceLogout } from '../api/client';
import apiClient from '../api/client';
import { Alert } from 'react-native';

interface User {
  User_ID: number;
  Username: string;
  FirstName: string;
  LastName: string;
  Email: string;
  ProfileImage: string | null;
  Role: 'Admin' | 'User';
  Gender: 'Male' | 'Female' | 'Other';
  Biography: string | null;
  Company_ID: number | null;
  emailVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: true, // true au démarrage pour vérifier le token stocké
    isAuthenticated: false,
  });

  /**
   * Au démarrage : vérifier si un token existe dans SecureStore
   * et tenter de le valider
   */
  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const storedToken = await SecureStorage.getToken();
        const storedUser = await SecureStorage.getUser();

        if (storedToken && storedUser) {
          // Vérifier que le token est encore valide en appelant une route protégée
          try {
            const response = await apiClient.get(`/users/${(storedUser as User).User_ID}`);
            
            // Token valide, restaurer la session
            setState({
              user: sanitizeUser(response.data),
              token: storedToken,
              isLoading: false,
              isAuthenticated: true,
            });
          } catch {
            // Token invalide/expiré → cleanup
            await SecureStorage.clearAll();
            setState({
              user: null,
              token: null,
              isLoading: false,
              isAuthenticated: false,
            });
          }
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Auth bootstrap error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    bootstrapAuth();
  }, []);

  /**
   * Enregistrer le callback de logout forcé (appelé par l'intercepteur Axios)
   */
  useEffect(() => {
    setOnForceLogout(() => {
      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
      Alert.alert(
        'Session expirée',
        'Votre session a expiré. Veuillez vous reconnecter.',
        [{ text: 'OK' }]
      );
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/login', {
        Email: email,
        Password: password,
      });

      const { authToken, user } = response.data;
      const safeUser = sanitizeUser(user);

      // Stocker de manière sécurisée
      await SecureStorage.setToken(authToken);
      await SecureStorage.setUser(safeUser);

      setState({
        user: safeUser as User,
        token: authToken,
        isLoading: false,
        isAuthenticated: true,
      });
    } catch (error: any) {
      if (error.response?.status === 401) {
        if (error.response?.data?.emailNotFound) {
          throw new Error('Aucun compte trouvé avec cet email.');
        }
        throw new Error('Mot de passe incorrect.');
      }
      throw new Error('Erreur de connexion. Vérifiez votre réseau.');
    }
  }, []);

  const register = useCallback(async (userData: any) => {
    try {
      // Le backend attend un multipart/form-data si image
      const formData = new FormData();
      Object.entries(userData).forEach(([key, value]) => {
        if (key === 'ProfileImage' && value) {
          formData.append('ProfileImage', {
            uri: (value as any).uri,
            name: (value as any).fileName || 'profile.jpg',
            type: (value as any).type || 'image/jpeg',
          } as any);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value as string);
        }
      });

      await apiClient.post('/users', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (error: any) {
      throw new Error(error.response?.data || 'Erreur lors de l\'inscription.');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Appeler le backend pour blacklister le token
      await apiClient.post('/logout');
    } catch {
      // Même si l'appel échoue, on nettoie localement
      console.warn('Logout API call failed, cleaning up locally');
    } finally {
      await SecureStorage.clearAll();
      setState({
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setState(prev => ({
      ...prev,
      user: prev.user ? { ...prev.user, ...userData } : null,
    }));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function sanitizeUser(user: any): User {
  const { hashedPassword, ...safe } = user;
  return safe as User;
}
```

### 4.5 Navigation — `AppNavigator.tsx`

```tsx
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';

const AppNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default AppNavigator;
```

```tsx
// src/navigation/AuthNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  VerifyEmail: { userId: number; email: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
  </Stack.Navigator>
);

export default AuthNavigator;
```

```tsx
// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import FeedScreen from '../screens/feed/FeedScreen';
import PostDetailScreen from '../screens/feed/PostDetailScreen';
import EventDetailScreen from '../screens/feed/EventDetailScreen';
import SurveyDetailScreen from '../screens/feed/SurveyDetailScreen';
import CreatePostScreen from '../screens/create/CreatePostScreen';
import CreateEventScreen from '../screens/create/CreateEventScreen';
import CreateSurveyScreen from '../screens/create/CreateSurveyScreen';
import ChatListScreen from '../screens/chat/ChatListScreen';
import ChatScreen from '../screens/chat/ChatScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

// Feed Stack
const FeedStack = createNativeStackNavigator();
const FeedStackNavigator = () => (
  <FeedStack.Navigator>
    <FeedStack.Screen name="FeedHome" component={FeedScreen} options={{ title: 'Fil d\'actualité' }} />
    <FeedStack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Publication' }} />
    <FeedStack.Screen name="EventDetail" component={EventDetailScreen} options={{ title: 'Événement' }} />
    <FeedStack.Screen name="SurveyDetail" component={SurveyDetailScreen} options={{ title: 'Sondage' }} />
  </FeedStack.Navigator>
);

// Create Stack
const CreateStack = createNativeStackNavigator();
const CreateStackNavigator = () => (
  <CreateStack.Navigator>
    <CreateStack.Screen name="CreateChoice" component={CreatePostScreen} options={{ title: 'Créer' }} />
    <CreateStack.Screen name="CreatePost" component={CreatePostScreen} options={{ title: 'Nouvelle publication' }} />
    <CreateStack.Screen name="CreateEvent" component={CreateEventScreen} options={{ title: 'Nouvel événement' }} />
    <CreateStack.Screen name="CreateSurvey" component={CreateSurveyScreen} options={{ title: 'Nouveau sondage' }} />
  </CreateStack.Navigator>
);

// Chat Stack
const ChatStack = createNativeStackNavigator();
const ChatStackNavigator = () => (
  <ChatStack.Navigator>
    <ChatStack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Messages' }} />
    <ChatStack.Screen name="Chat" component={ChatScreen} options={({ route }: any) => ({ title: route.params?.userName || 'Chat' })} />
  </ChatStack.Navigator>
);

// Profile Stack
const ProfileStack = createNativeStackNavigator();
const ProfileStackNavigator = () => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="MyProfile" component={ProfileScreen} options={{ title: 'Mon profil' }} />
    <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Modifier le profil' }} />
  </ProfileStack.Navigator>
);

const Tab = createBottomTabNavigator();

const MainTabNavigator: React.FC = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home';
        switch (route.name) {
          case 'Feed': iconName = focused ? 'home' : 'home-outline'; break;
          case 'Create': iconName = focused ? 'add-circle' : 'add-circle-outline'; break;
          case 'Messages': iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'; break;
          case 'Profile': iconName = focused ? 'person' : 'person-outline'; break;
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#4A90D9',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Feed" component={FeedStackNavigator} options={{ title: 'Accueil' }} />
    <Tab.Screen name="Create" component={CreateStackNavigator} options={{ title: 'Créer' }} />
    <Tab.Screen name="Messages" component={ChatStackNavigator} />
    <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ title: 'Profil' }} />
  </Tab.Navigator>
);

export default MainTabNavigator;
```

### 4.6 Écran Feed — Avec FlatList et optimisations de performance

```tsx
// src/screens/feed/FeedScreen.tsx
import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  FlatList,
  View,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
  Text,
  Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import apiClient from '../../api/client';
import PostCard from '../../components/feed/PostCard';
import EventCard from '../../components/feed/EventCard';
import SurveyCard from '../../components/feed/SurveyCard';

type FeedItem = {
  id: string;
  type: 'post' | 'event' | 'survey';
  data: any;
  createdAt: string;
};

const FeedScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const fetchFeed = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);

      // Charger en parallèle — PAS de pagination côté backend malheureusement
      const [postsRes, eventsRes, surveysRes] = await Promise.all([
        apiClient.get('/posts'),
        apiClient.get('/events'),
        apiClient.get('/surveys'),
      ]);

      const items: FeedItem[] = [
        ...postsRes.data.map((p: any) => ({
          id: `post-${p.Post_ID}`,
          type: 'post' as const,
          data: p,
          createdAt: p.Created_At,
        })),
        ...eventsRes.data.map((e: any) => ({
          id: `event-${e.Event_ID}`,
          type: 'event' as const,
          data: e,
          createdAt: e.Created_At,
        })),
        ...surveysRes.data.map((s: any) => ({
          id: `survey-