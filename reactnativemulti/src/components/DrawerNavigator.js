import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import HomeScreen from '../pages/HomeScreen/HomeScreen';
import MyProfil from '../pages/DrawerPages/ProfileScreen/MyProfileScreen/MyProfilScreen';
import Evenements from '../pages/DrawerPages/EvenementsScreen';
import Membres from '../pages/DrawerPages/MembersScreen/MembresScreen';
import Postes from '../pages/DrawerPages/PostesScreen';
import Calendrier from '../pages/DrawerPages/CalendrierScreen';
import CreerEvenement from '../pages/DrawerPages/CreateEventScreen';
import CreerPost from '../pages/DrawerPages/CreatePostScreen';
import Actualites from '../pages/DrawerPages/ActualitesScreen';
import Sondages from '../pages/DrawerPages/SondagesScreen';
import InviterAmis from '../pages/DrawerPages/InvitFreindsScreen';
import TermsAndConditions from '../pages/DrawerPages/TermsAndConditionsScreen';
import LogoutButton from'./LogoutButton/LogoutButton';


const Drawer = createDrawerNavigator();

const drawerScreenOptions = {
  drawerStyle: {
    backgroundColor: '#FFFFFF',
    width: 270,
  },
  drawerActiveTintColor: '#2563EB',
  drawerInactiveTintColor: '#475569',
  drawerActiveBackgroundColor: '#EFF6FF',
  drawerLabelStyle: {
    fontSize: 15,
    fontWeight: '600',
  },
  drawerItemStyle: {
    borderRadius: 10,
    marginHorizontal: 8,
  },
  headerStyle: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTintColor: '#0F172A',
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 18,
  },
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={drawerScreenOptions}
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 8 }}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="Déconnexion"
              onPress={() => {}}
              style={{ display: 'none' }}
            />
            <LogoutButton {...props} />
          </DrawerContentScrollView>
        );
      }}
    >
      <Drawer.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Accueil' }} />
      <Drawer.Screen name="Profile" component={MyProfil} options={{ title: 'Mon profil' }} />
      <Drawer.Screen name="Actualites" component={Actualites} options={{ title: 'Actualités' }} />
      <Drawer.Screen name="Postes" component={Postes} options={{ title: 'Postes' }} />
      <Drawer.Screen name="Evenements" component={Evenements} options={{ title: 'Événements' }} />
      <Drawer.Screen name="Calendrier" component={Calendrier} options={{ title: 'Calendrier' }} />
      <Drawer.Screen name="Sondages" component={Sondages} options={{ title: 'Sondages' }} />
      <Drawer.Screen name="Membres" component={Membres} options={{ title: 'Membres' }} />
      <Drawer.Screen name="CreerEvenement" component={CreerEvenement} options={{ title: 'Créer un événement', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="CreerPost" component={CreerPost} options={{ title: 'Nouveau post', drawerItemStyle: { display: 'none' } }} />
      <Drawer.Screen name="InviterAmis" component={InviterAmis} options={{ title: 'Inviter des amis' }} />
      <Drawer.Screen name="TermsAndConditions" component={TermsAndConditions} options={{ title: 'CGU', drawerItemStyle: { display: 'none' } }} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
