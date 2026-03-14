// Hostname.js
import { Platform } from "react-native";

// 10.0.2.2 = localhost de la machine hôte vu depuis l'émulateur Android
// Remplacer par l'IP locale (ex: 192.168.1.X) pour un vrai téléphone
const EMULATOR_HOST = "10.187.106.142";

let settings = {
  devRunMode: 100,
  withConsole: true,
};

const HOST = Platform.OS === "web" ? "localhost" : EMULATOR_HOST;

let hostname = `http://${HOST}:3002`;
let wsHostname = `ws://${HOST}:3002`;

export { settings, hostname, wsHostname };
