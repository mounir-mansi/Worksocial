import React, { useState, useEffect } from "react";
import "./MembersScreen.css";
import UserCard from "../../components/UserCard/UserCard";
import { hostname } from "../../HostnameConnect/Hostname";

function MembersScreen() {
  const [users, setUsers] = useState([]);
  const [openChats, setOpenChats] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("userToken");
      console.info(token);
      const response = await fetch(`${hostname}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erreur de réseau");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    }
  };

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

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Liste des Membres</h1>
      <div className="users-list">
        {users.map((user) => (
          <UserCard
            key={user.User_ID}
            user={user}
            onOpenChat={() => handleOpenChat(user.User_ID)}
            onCloseChat={() => handleCloseChat(user.User_ID)}
            chatPosition={
              openChats.find((chat) => chat.userId === user.User_ID)?.position
            }
          />
        ))}
      </div>
    </div>
  );
}

export default MembersScreen;
