import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChatWebSocket from "../ChatPrivate/ChatWebSocket/ChatWebSocket";
import { hostname } from '../../components/HostnameConnect/Hostname';
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = Platform.OS === 'web'
  ? require('./styles.web').default
  : require('./styles.mobile').default;

function UserCard({ user, onOpenChat, onCloseChat, chatPosition, showChatButton }) {
  const [isChatWebSocketOpen, setIsChatWebSocketOpen] = useState(false);
  const navigation = useNavigation();
  const [isModalMinimized, setIsModalMinimized] = useState(false);
  const [userIdLoggedIn, setUserIdLoggedIn] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      const userId = await AsyncStorage.getItem("userId");
      setUserIdLoggedIn(userId);
    };

    fetchUserId();
  }, []);

const handleCardClick = () => {
  navigation.navigate('MyProfileScreen', { userId: user.User_ID });
};

  const handleKeyPress = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      navigation.navigate(`/MyProfileScreen/${user.User_ID}`);
    }
  };
  const translateGender = (gender) => {
    const genderTranslations = {
      male: "Homme",
      female: "Femme",
      other: "Autre",
    };

    return genderTranslations[gender.toLowerCase()] || gender;
  };

 const handleChatClick = (e) => {
    e.stopPropagation();
    onOpenChat();
    setIsChatWebSocketOpen(true);
  };

  const imageName = user.ProfileImage ? user.ProfileImage.split("\\").pop() : 'defaultImage.png';
  const imageUrl = `${hostname}/upload/${imageName}`;

  return (
    <View>
      <TouchableOpacity onPress={handleCardClick} onKeyPress={handleKeyPress} style={styles.userCard}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user.FirstName} {user.LastName}
          </Text>
          <Text style={styles.userDetail}>{user.Age} ans · {translateGender(user.Gender)}</Text>
          {showChatButton && userIdLoggedIn && userIdLoggedIn !== String(user.User_ID) && (
            <TouchableOpacity onPress={handleChatClick} style={styles.chatButton}>
              <Text style={styles.chatButtonText}>💬 Chat</Text>
            </TouchableOpacity>
          )}
        </View>
       </TouchableOpacity>
      {isChatWebSocketOpen && (
        <ChatWebSocket
          onClose={() => {
            onCloseChat();
            setIsChatWebSocketOpen(false);
          }}
          onMinimize={() => setIsModalMinimized(!isModalMinimized)}
          isMinimized={isModalMinimized}
          user={user}
          userId={user.User_ID}
          position={chatPosition}
        />
      )}
    </View>
  );
}

export default UserCard;
