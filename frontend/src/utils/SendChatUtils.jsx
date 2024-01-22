// export const sendMessage = async (
//   content,
//   userIdSend,
//   userIdReceive,
//   token
// ) => {
//   try {
//     const response = await fetch("http://localhost:5000/individualchats", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         Content: content,
//         User_ID1: userIdSend,
//         User_ID2: userIdReceive,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Échec de l'envoi du message");
//     }

//     const data = await response.json();
//     return data; // Retourner les données reçues (ou true si pas de données attendues)
//   } catch (error) {
//     console.error("Erreur lors de l'envoi du message:", error);
//     throw error;
//   }
// };
