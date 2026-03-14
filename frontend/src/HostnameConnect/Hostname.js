const settings = {
  devRunMode: 100,
  withConsole: false,
};

// En prod : VITE_API_URL est vide → URLs relatives (backend sert le frontend)
// En dev  : VITE_API_URL=http://localhost:3002
const hostname = import.meta.env.VITE_API_URL || "";

// Utilisez export direct au lieu de module.exports
export { settings, hostname };
