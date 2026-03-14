import React from 'react';
import { Platform, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../utils/useConnecte';
import DisplayURL from '../../utils/DisplayURL';

const styles = Platform.OS === 'web'
  ? require('./styles.web').default
  : require('./styles.mobile').default;

const HomeScreen = () => {
  const navigation = useNavigation();
  const { isLoggedIn } = useAuth();

  return (
    <View style={styles.container}>
      <DisplayURL style={styles.urlText} />
      <Text style={styles.hero}>WorkSocial</Text>
      <Text style={styles.text}>Votre réseau professionnel interne</Text>
      {!isLoggedIn && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ConnexionScreen')}>
          <Text style={styles.buttonText}>Commencer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HomeScreen;
