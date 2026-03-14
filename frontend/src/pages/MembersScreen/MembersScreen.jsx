import React, { useState } from "react";
import "./MembersScreen.css";
import UserCard from "../../components/UserCard/UserCard";
import UserBar from "../../components/UserBar/UserBar";
import { useUser } from "../../contexts/UserContext";

function MembersScreen() {
  const [openChats, setOpenChats] = useState([]);

  const { users } = useUser();

  const handleOpenChat = (userId) => {
    setOpenChats((oldChats) => [
      ...oldChats,
      { userId, position: oldChats.length * 300 },
    ]);
  };

  const handleCloseChat = (userId) => {
    setOpenChats((oldChats) =>
      oldChats.filter((chat) => chat.userId !== userId)
    );
  };

  return (
    <div className="container">
      <UserBar />
      <div className="content-area">
        <h2 className="page-title">Membres</h2>
        <div className="userlist">
          {users.map((user) => {
            const chatInfo = openChats.find(
              (chat) => chat.userId === user.User_ID
            );
            const chatPosition = chatInfo ? chatInfo.position : 0; // Fournir une valeur par défaut si non trouvé

            return (
              <UserCard
                key={user.User_ID}
                user={user}
                onOpenChat={() => handleOpenChat(user.User_ID)}
                onCloseChat={() => handleCloseChat(user.User_ID)}
                chatPosition={chatPosition}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default MembersScreen;
