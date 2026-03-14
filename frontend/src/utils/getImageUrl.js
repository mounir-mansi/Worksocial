import { hostname } from "../HostnameConnect/Hostname";

// Si l'image est déjà une URL complète (R2), on la retourne directement.
// Sinon (ancienne image locale), on reconstruit l'URL du serveur.
export default function getImageUrl(image) {
  if (!image) return "";
  if (image.startsWith("http")) return image;
  return `${hostname}/upload/${image}`;
}
