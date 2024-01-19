import React, { useEffect, useState } from "react";
import "./MembersScreen.css";
import UserCard from "../../components/UserCard/UserCard";

function HomeScreen() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const tokenJWT = localStorage.getItem("jwtToken");
        const response = await fetch("http://localhost:5000/users", {
          headers: {
            Authorization: `Bearer ${tokenJWT}`,
          },
        });
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des utilisateurs");
        }
        const data = await response.json();
        console.error("data", data);
        setUsers(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="home-screen">
      <div className="home-screen-content">
        <h1>Home Screen</h1>
        <p>Page d'accueil</p>
        <div className="user-list">
          {users.map((user) => (
            <UserCard key={user.User_ID} user={user} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
