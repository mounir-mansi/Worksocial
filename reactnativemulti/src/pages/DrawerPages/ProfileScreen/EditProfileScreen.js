import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { hostname } from '../../../components/HostnameConnect/Hostname';
import CustomImagePicker from '../../../components/CustomImagePicker';

const EditProfileScreen = ({ route, navigation }) => {
  const { user } = route.params;
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadAuth = async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      const storedToken = await AsyncStorage.getItem('userToken');
      setUserId(storedUserId);
      setToken(storedToken);
    };
    loadAuth();
  }, []);

  const [editedUser, setEditedUser] = useState({ ...user });
  const [isSaving, setIsSaving] = useState(false);

const saveChanges = () => {
  setIsSaving(true);

  fetch(`${hostname}/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      FirstName: editedUser.FirstName,
      LastName: editedUser.LastName,
      BirthDate: editedUser.BirthDate,
      Address: editedUser.Address,
      Email: editedUser.Email,
      // Assurez-vous que la gestion de ProfileImage est correctement implémentée côté serveur
      ProfileImage: editedUser.ProfileImage,
    }),
  })
  .then((response) => {
    console.log("Raw response: ", response);
    if (!response.ok) {
      return response.text().then(text => {
        throw new Error('Erreur de requête : ' + text);
      });
    }
    return response.json();
  })
  .then((data) => {
    setIsSaving(false);
    if (data.success) {
      navigation.goBack();
    } else {
      console.error('Erreur de sauvegarde :', data.error);
    }
  })
  .catch((error) => {
    setIsSaving(false);
    console.error('Erreur de sauvegarde :', error);
  });
};


 const onImageSelected = (imageUri) => {
    setEditedUser({...editedUser, ProfileImage: imageUri});
  };

  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const toggleImagePicker = () => {
    setIsPickerVisible(!isPickerVisible);
  };
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageSection}>
        <TouchableOpacity onPress={toggleImagePicker}>
          <Image
            style={styles.image}
            source={{ uri: editedUser.ProfileImage || undefined }}
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.imageOverlayText}>📷</Text>
          </View>
        </TouchableOpacity>
      </View>

      {isPickerVisible && (
        <CustomImagePicker onImageSelected={onImageSelected} />
      )}

      <Text style={styles.label}>Prénom</Text>
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        placeholderTextColor="#94A3B8"
        onChangeText={(text) => setEditedUser({ ...editedUser, FirstName: text })}
        value={editedUser.FirstName}
      />
      <Text style={styles.label}>Nom</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        placeholderTextColor="#94A3B8"
        onChangeText={(text) => setEditedUser({ ...editedUser, LastName: text })}
        value={editedUser.LastName}
      />
      <Text style={styles.label}>Nom d'utilisateur</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        placeholderTextColor="#94A3B8"
        onChangeText={(text) => setEditedUser({ ...editedUser, Username: text })}
        value={editedUser.Username}
      />
      <Text style={styles.label}>Date de naissance</Text>
      <TextInput
        style={styles.input}
        placeholder="JJ/MM/AAAA"
        placeholderTextColor="#94A3B8"
        onChangeText={(text) => setEditedUser({ ...editedUser, BirthDate: text })}
        value={editedUser.BirthDate}
      />
      <Text style={styles.label}>Adresse</Text>
      <TextInput
        style={styles.input}
        placeholder="Adresse"
        placeholderTextColor="#94A3B8"
        onChangeText={(text) => setEditedUser({ ...editedUser, Address: text })}
        value={editedUser.Address}
      />
      <Text style={styles.label}>Téléphone</Text>
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        placeholderTextColor="#94A3B8"
        onChangeText={(text) => setEditedUser({ ...editedUser, Phone: text })}
        value={editedUser.Phone}
      />
      <Text style={styles.label}>Biographie</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Parlez de vous..."
        placeholderTextColor="#94A3B8"
        multiline
        numberOfLines={3}
        onChangeText={(text) => setEditedUser({ ...editedUser, Biography: text })}
        value={editedUser.Biography}
      />

      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={saveChanges}
        disabled={isSaving}
      >
        <Text style={styles.saveButtonText}>
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  content: { padding: 16, paddingBottom: 40 },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E2E8F0',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2563EB',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlayText: { fontSize: 14 },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    fontSize: 14,
    color: '#0F172A',
  },
  textarea: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  saveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: { backgroundColor: '#93C5FD', shadowOpacity: 0 },
  saveButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});

export default EditProfileScreen;
