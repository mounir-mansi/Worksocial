// Import des Modules
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BarNav from "./components/BarNav/BarNav";

// Import des Pages
import LandingScreen from "./pages/LandingScreen/LandingScreen";
import Feed from "./pages/Feed/Feed";
import PostScreen from "./pages/PostScreen/PostScreen";
import ConnexionScreen from "./pages/ConnexionScreen/ConnexionScreen";
import InscriptionScreen from "./pages/InscriptionScreen/InscriptionScreen";
import EventsScreen from "./pages/EventsScreen/EventsScreen";
import SurveyScreen from "./pages/SurveyScreen/SurveyScreen";
import MembersScreen from "./pages/MembersScreen/MembersScreen";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import EditUserProfilScreen from "./pages/EditUserProfilScreen/EditUserProfilScreen";
import MyUserProfilScreen from "./pages/MyUserProfilScreen/MyUserProfilScreen";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import VerifyUser from "./pages/VerifyUser/VerifyUser";

// Import des Contexts
import { AuthProvider } from "./utils/useConnecte";
import { PostProvider } from "./contexts/PostContext";
import { UserProvider } from "./contexts/UserContext";
import { SurveyProvider } from "./contexts/SurveyContext";
import { EventProvider } from "./contexts/EventContext";

// Import des CSS
import "./App.css";

function App() {
  return (
    <React.StrictMode>
      <AuthProvider>
        <Router>
          <BarNav />
          <UserProvider>
            <Routes>
              <Route path="/" element={<LandingScreen />} />
              <Route path="/feed" element={<Feed />} />
              <Route
                path="/posts"
                element={
                  <PostProvider>
                    <PostScreen />
                  </PostProvider>
                }
              />
              <Route path="/connexion" element={<ConnexionScreen />} />
              <Route path="/inscription" element={<InscriptionScreen />} />
              <Route
                path="/events"
                element={
                  <EventProvider>
                    <EventsScreen />
                  </EventProvider>
                }
              />
              <Route
                path="/surveys"
                element={
                  <SurveyProvider>
                    <SurveyScreen />
                  </SurveyProvider>
                }
              />
              <Route path="/members" element={<MembersScreen />} />
              <Route path="/profile/:userId" element={<MyUserProfilScreen />} />
              <Route path="/myprofil" element={<MyUserProfilScreen />} />
              <Route path="/editprofil" element={<EditUserProfilScreen />} />
              <Route path="/changepassword" element={<ChangePassword />} />
              <Route path="/verify-user" element={<VerifyUser />} />
              <Route path="/resetpassword/:key" element={<ResetPassword />} />
              <Route path="/resetpassword" element={<ResetPassword />} />
            </Routes>
          </UserProvider>
        </Router>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
