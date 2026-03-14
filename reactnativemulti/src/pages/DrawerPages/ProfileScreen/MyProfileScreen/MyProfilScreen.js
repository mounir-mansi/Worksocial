// MyProfileScreen.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hostname } from '../../../../components/HostnameConnect/Hostname';
const styles = Platform.OS === 'web'
  ? require('./styles.web').default
  : require('./styles.mobile').default;


// Ajoutez route comme paramètre ici
const MyProfileScreen = ({ route }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const navigation = useNavigation();
  const [isImageFullScreen, setIsImageFullScreen] = useState(false);


  const handleEditProfile = () => {
    navigation.navigate('EditProfileScreen', { user });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUserId = await AsyncStorage.getItem("userId");
      setLoggedInUserId(loggedInUserId);

      // Utilisez l'userId passé ou l'userId de l'utilisateur connecté par défaut
      const userIdToShow = route.params?.userId || loggedInUserId;
      console.info("Profile userId:", userIdToShow);

      const token = await AsyncStorage.getItem("userToken");

      if (userIdToShow && token) {
        fetch(`${hostname}/users/${userIdToShow}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [route.params?.userId]); // Ajoutez cette dépendance

  if (isLoading) {
    return <View><Text>Loading...</Text></View>;
  }

  if (!user) {
    return <View><Text>Utilisateur non trouvé.</Text></View>;
  }
  const imageName = user.ProfileImage ? user.ProfileImage.split("\\").pop() : 'defaultImage.png';
  const imageUrl = `${hostname}/upload/${imageName}`;
  const handleImageClick = () => {
    setIsImageFullScreen(true);
  };

  const handleCloseFullScreenImage = () => {
    setIsImageFullScreen(false);
  };
  return (
    <View style={styles.container}>
      {user && String(loggedInUserId) === String(user.User_ID) && (
        <View style={styles.editSection}>
          <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
            <Text style={styles.editButtonText}>Édite</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.profileSection}>

         <TouchableOpacity onPress={handleImageClick}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
        </TouchableOpacity>
        <Modal
        visible={isImageFullScreen}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseFullScreenImage}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          <Image source={{ uri: imageUrl }} style={styles.fullScreenImage} />
        </View>
      </Modal>
      <Text style={styles.username}>{user.Username}</Text>
      <Text style={styles.name}>{user.FirstName}</Text>
      <Text style={styles.name}>{user.LastName}</Text>
      <Text style={styles.email}>{user.Email}</Text>
      <Text style={styles.phone}>{user.Phone}</Text>
      <Text style={styles.biography}>{user.Biography}</Text>
      <Text style={styles.age}>{user.Age}</Text>
      <Text style={styles.birthDate}>{user.BirthDate}</Text>
      <Text style={styles.address}>{user.Address}</Text>
      <Text style={styles.gender}>{user.Gender}</Text>
    </View>
    </View>
  );
};

export default MyProfileScreen;