-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : dim. 21 jan. 2024 à 10:18
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `worksocial`
--

-- --------------------------------------------------------

--
-- Structure de la table `blacklisted_tokens`
--

CREATE TABLE `blacklisted_tokens` (
  `jwtToken` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `blacklisted_tokens`
--

INSERT INTO `blacklisted_tokens` (`jwtToken`, `createdAt`) VALUES
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTcwNTgyNjY4NCwiZXhwIjoxNzA1ODQxMDg0fQ.ab9TinN0xJFHM22VFW0t9KzXg7-CKESofyrJa7xdWBA', '2024-01-21 08:46:32'),
('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImlhdCI6MTcwNTgyNTcyMSwiZXhwIjoxNzA1ODQwMTIxfQ.zcwnydOARzi2abt3uCwaj5fsjnqOlqPdnY2q5hWgCSY', '2024-01-21 09:07:34');

-- --------------------------------------------------------

--
-- Structure de la table `event`
--

CREATE TABLE `event` (
  `Event_ID` int(11) NOT NULL,
  `Image` text DEFAULT NULL,
  `EventName` varchar(255) NOT NULL,
  `StartDate` date NOT NULL,
  `EndDate` date DEFAULT NULL,
  `StartTime` time DEFAULT NULL,
  `EndTime` time DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Visibility` enum('Public','Private') NOT NULL,
  `ParticipantCount` int(11) DEFAULT 0,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `User_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `event_comments`
--

CREATE TABLE `event_comments` (
  `Comment_ID` int(11) NOT NULL,
  `Event_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Comment` text NOT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `event_comment_likes`
--

CREATE TABLE `event_comment_likes` (
  `Like_ID` int(11) NOT NULL,
  `Comment_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Liked_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `event_likes`
--

CREATE TABLE `event_likes` (
  `Like_ID` int(11) NOT NULL,
  `Event_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Liked_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `groupchat`
--

CREATE TABLE `groupchat` (
  `GroupChat_ID` int(11) NOT NULL,
  `GroupImage` text DEFAULT NULL,
  `GroupName` varchar(255) NOT NULL,
  `Content` text NOT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `User_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `groupparticipants`
--

CREATE TABLE `groupparticipants` (
  `GroupChat_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Joined_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `individualchat`
--

CREATE TABLE `individualchat` (
  `Chat_ID` int(11) NOT NULL,
  `Content` text NOT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `User_ID1` int(11) DEFAULT NULL,
  `User_ID2` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `individualchat`
--

INSERT INTO `individualchat` (`Chat_ID`, `Content`, `Created_At`, `Updated_At`, `User_ID1`, `User_ID2`) VALUES
(1, 'qzdfqzf', '2024-01-21 08:43:24', '2024-01-21 08:43:24', 2, 1),
(2, 'qsfqsf', '2024-01-21 08:43:25', '2024-01-21 08:43:25', 2, 1),
(3, 'qsfqsf', '2024-01-21 08:43:27', '2024-01-21 08:43:27', 2, 1),
(4, 'qsfqsf', '2024-01-21 08:43:29', '2024-01-21 08:43:29', 2, 1),
(5, 'Bonjour', '2024-01-21 08:45:26', '2024-01-21 08:45:26', 2, 1),
(6, 'Bonjour', '2024-01-21 08:45:44', '2024-01-21 08:45:44', 2, 1),
(7, 'Hello', '2024-01-21 08:45:58', '2024-01-21 08:45:58', 2, 1),
(8, 'comment va tu', '2024-01-21 08:46:06', '2024-01-21 08:46:06', 2, 1),
(9, 'comment', '2024-01-21 08:46:14', '2024-01-21 08:46:14', 2, 1),
(10, 'cc', '2024-01-21 08:47:00', '2024-01-21 08:47:00', 1, 2),
(11, 'Bonjour', '2024-01-21 08:47:18', '2024-01-21 08:47:18', 2, 1),
(12, 'comment va tu', '2024-01-21 08:47:27', '2024-01-21 08:47:27', 2, 1),
(13, 'sfdbv', '2024-01-21 08:47:33', '2024-01-21 08:47:33', 2, 1),
(14, 'hello', '2024-01-21 09:00:25', '2024-01-21 09:00:25', 2, 1),
(15, 'qsfqsf', '2024-01-21 09:05:00', '2024-01-21 09:05:00', 2, 1);

-- --------------------------------------------------------

--
-- Structure de la table `post`
--

CREATE TABLE `post` (
  `Post_ID` int(11) NOT NULL,
  `Image` text DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Content` text NOT NULL,
  `Visibility` enum('Public','Private') NOT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `User_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `post_comments`
--

CREATE TABLE `post_comments` (
  `Comment_ID` int(11) NOT NULL,
  `Post_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Comment` text NOT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `post_comment_likes`
--

CREATE TABLE `post_comment_likes` (
  `Like_ID` int(11) NOT NULL,
  `Comment_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Liked_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `post_likes`
--

CREATE TABLE `post_likes` (
  `Like_ID` int(11) NOT NULL,
  `Post_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Liked_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `survey`
--

CREATE TABLE `survey` (
  `Survey_ID` int(11) NOT NULL,
  `Image` text DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Content` text NOT NULL,
  `VoteCount` int(11) DEFAULT 0,
  `Visibility` enum('Public','Private') NOT NULL,
  `EndDate` date DEFAULT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `User_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `survey_comments`
--

CREATE TABLE `survey_comments` (
  `Comment_ID` int(11) NOT NULL,
  `Survey_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Comment` text NOT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `survey_comment_likes`
--

CREATE TABLE `survey_comment_likes` (
  `Like_ID` int(11) NOT NULL,
  `Comment_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Liked_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `survey_likes`
--

CREATE TABLE `survey_likes` (
  `Like_ID` int(11) NOT NULL,
  `Survey_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Liked_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `User_ID` int(11) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `LastName` varchar(255) NOT NULL,
  `FirstName` varchar(255) NOT NULL,
  `BirthDate` date DEFAULT NULL,
  `Age` int(11) DEFAULT NULL,
  `Address` text DEFAULT NULL,
  `Email` varchar(255) NOT NULL,
  `Phone` varchar(255) DEFAULT NULL,
  `Biography` text DEFAULT NULL,
  `hashedPassword` varchar(255) NOT NULL,
  `Role` enum('Admin','User') NOT NULL,
  `Gender` enum('Male','Female','Other') NOT NULL,
  `ProfileImage` text DEFAULT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`User_ID`, `Username`, `LastName`, `FirstName`, `BirthDate`, `Age`, `Address`, `Email`, `Phone`, `Biography`, `hashedPassword`, `Role`, `Gender`, `ProfileImage`, `Created_At`, `Updated_At`) VALUES
(1, 'Bibi', 'zaaraoui', 'bilel', '1981-03-27', 42, '4 place esquiros', 'bilelzara@gmail.com', '0659165303', 'at trim_prefix (F:\\WorkSocial\\backend\\node_modules\\express\\lib\\router\\index.js:328:13)\r\n    at F:\\WorkSocial\\backend\\node_modules\\express\\lib\\router\\index.js:286:9\r\n    at Function.process_params (F:\\WorkSocial\\backend\\node_modules\\express\\lib\\router\\index.js:346:12)\r\n    at next (F:\\WorkSocial\\backend\\node_modules\\express\\lib\\router\\index.js:280:10)\r\n    at Function.handle (F:\\WorkSocial\\backend\\node_modules\\express\\lib\\router\\index.js:175:3)\r\n    at router (F:\\WorkSocial\\backend\\node_modules\\express\\lib\\router\\index.js:47:12) {', '$argon2id$v=19$m=65536,t=5,p=1$obbe2GI9C4ZOVjMJHk26Sw$dDHh+Dig/p9Nby+G2AHCMkgzR9Spg+AinnC8I1unBII', 'User', 'Female', 'assets\\upload\\1705825327454-carbon.png', '2024-01-21 08:22:07', '2024-01-21 08:22:07'),
(2, 'aaaa', 'aaaa', 'aaaa', '1981-01-27', 42, '4 place esquiros', 'aa@aa.aa', '0659165303', 'aaaaaaaaaaaa', '$argon2id$v=19$m=65536,t=5,p=1$qa29MerWu8WQOnCA9TrPuQ$iW+oPDx8sGO8c4Bz9woF/O0zf3/R8/N9QPQxgGX987o', 'User', 'Male', 'assets\\upload\\1705825638034-customer.png', '2024-01-21 08:27:18', '2024-01-21 08:27:18');

-- --------------------------------------------------------

--
-- Structure de la table `user_followers`
--

CREATE TABLE `user_followers` (
  `Follower_ID` int(11) NOT NULL,
  `Following_ID` int(11) NOT NULL,
  `Followed_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`Event_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Index pour la table `event_comments`
--
ALTER TABLE `event_comments`
  ADD PRIMARY KEY (`Comment_ID`),
  ADD KEY `Event_ID` (`Event_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Index pour la table `event_comment_likes`
--
ALTER TABLE `event_comment_likes`
  ADD PRIMARY KEY (`Like_ID`),
  ADD KEY `Comment_ID` (`Comment_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Index pour la table `event_likes`
--
ALTER TABLE `event_likes`
  ADD PRIMARY KEY (`Like_ID`),
  ADD KEY `Event_ID` (`Event_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Index pour la table `groupchat`
--
ALTER TABLE `groupchat`
  ADD PRIMARY KEY (`GroupChat_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Index pour la table `groupparticipants`
--
ALTER TABLE `groupparticipants`
  ADD PRIMARY KEY (`GroupChat_ID`,`User_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Index pour la table `individualchat`
--
ALTER TABLE `individualchat`
  ADD PRIMARY KEY (`Chat_ID`),
  ADD KEY `User_ID1` (`User_ID1`),
  ADD KEY `User_ID2` (`User_ID2`);

--
-- Index pour la table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`Post_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Index pour la table `post_comments`
--
ALTER TABLE `post_comments`
  ADD PRIMARY KEY (`Comment_ID`),
  ADD KEY `Post_ID` (`Post_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Index pour la table `post_comment_likes`
--
ALTER TABLE `post_comment_likes`
  ADD PRIMARY KEY (`Like_ID`),
  ADD KEY `Comment_ID` (`Comment_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Index pour la table `post_likes`
--
ALTER TABLE `post_likes`
  ADD PRIMARY KEY (`Like_ID`),
  ADD KEY `Post_ID` (`Post_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Index pour la table `survey`
--
ALTER TABLE `survey`
  ADD PRIMARY KEY (`Survey_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Index pour la table `survey_comments`
--
ALTER TABLE `survey_comments`
  ADD PRIMARY KEY (`Comment_ID`),
  ADD KEY `Survey_ID` (`Survey_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Index pour la table `survey_comment_likes`
--
ALTER TABLE `survey_comment_likes`
  ADD PRIMARY KEY (`Like_ID`),
  ADD KEY `Comment_ID` (`Comment_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Index pour la table `survey_likes`
--
ALTER TABLE `survey_likes`
  ADD PRIMARY KEY (`Like_ID`),
  ADD KEY `Survey_ID` (`Survey_ID`),
  ADD KEY `User_ID` (`User_ID`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`User_ID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Index pour la table `user_followers`
--
ALTER TABLE `user_followers`
  ADD PRIMARY KEY (`Follower_ID`,`Following_ID`),
  ADD KEY `Following_ID` (`Following_ID`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `event`
--
ALTER TABLE `event`
  MODIFY `Event_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `event_comments`
--
ALTER TABLE `event_comments`
  MODIFY `Comment_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `event_comment_likes`
--
ALTER TABLE `event_comment_likes`
  MODIFY `Like_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `event_likes`
--
ALTER TABLE `event_likes`
  MODIFY `Like_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `groupchat`
--
ALTER TABLE `groupchat`
  MODIFY `GroupChat_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `individualchat`
--
ALTER TABLE `individualchat`
  MODIFY `Chat_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `post`
--
ALTER TABLE `post`
  MODIFY `Post_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `post_comments`
--
ALTER TABLE `post_comments`
  MODIFY `Comment_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `post_comment_likes`
--
ALTER TABLE `post_comment_likes`
  MODIFY `Like_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `post_likes`
--
ALTER TABLE `post_likes`
  MODIFY `Like_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `survey`
--
ALTER TABLE `survey`
  MODIFY `Survey_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `survey_comments`
--
ALTER TABLE `survey_comments`
  MODIFY `Comment_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `survey_comment_likes`
--
ALTER TABLE `survey_comment_likes`
  MODIFY `Like_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `survey_likes`
--
ALTER TABLE `survey_likes`
  MODIFY `Like_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `User_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `event_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `event_comments`
--
ALTER TABLE `event_comments`
  ADD CONSTRAINT `event_comments_ibfk_1` FOREIGN KEY (`Event_ID`) REFERENCES `event` (`Event_ID`),
  ADD CONSTRAINT `event_comments_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `event_comment_likes`
--
ALTER TABLE `event_comment_likes`
  ADD CONSTRAINT `event_comment_likes_ibfk_1` FOREIGN KEY (`Comment_ID`) REFERENCES `event_comments` (`Comment_ID`),
  ADD CONSTRAINT `event_comment_likes_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `event_likes`
--
ALTER TABLE `event_likes`
  ADD CONSTRAINT `event_likes_ibfk_1` FOREIGN KEY (`Event_ID`) REFERENCES `event` (`Event_ID`),
  ADD CONSTRAINT `event_likes_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `groupchat`
--
ALTER TABLE `groupchat`
  ADD CONSTRAINT `groupchat_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `groupparticipants`
--
ALTER TABLE `groupparticipants`
  ADD CONSTRAINT `groupparticipants_ibfk_1` FOREIGN KEY (`GroupChat_ID`) REFERENCES `groupchat` (`GroupChat_ID`),
  ADD CONSTRAINT `groupparticipants_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `individualchat`
--
ALTER TABLE `individualchat`
  ADD CONSTRAINT `individualchat_ibfk_1` FOREIGN KEY (`User_ID1`) REFERENCES `user` (`User_ID`),
  ADD CONSTRAINT `individualchat_ibfk_2` FOREIGN KEY (`User_ID2`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `post_comments`
--
ALTER TABLE `post_comments`
  ADD CONSTRAINT `post_comments_ibfk_1` FOREIGN KEY (`Post_ID`) REFERENCES `post` (`Post_ID`),
  ADD CONSTRAINT `post_comments_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `post_comment_likes`
--
ALTER TABLE `post_comment_likes`
  ADD CONSTRAINT `post_comment_likes_ibfk_1` FOREIGN KEY (`Comment_ID`) REFERENCES `post_comments` (`Comment_ID`),
  ADD CONSTRAINT `post_comment_likes_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `post_likes`
--
ALTER TABLE `post_likes`
  ADD CONSTRAINT `post_likes_ibfk_1` FOREIGN KEY (`Post_ID`) REFERENCES `post` (`Post_ID`),
  ADD CONSTRAINT `post_likes_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `survey`
--
ALTER TABLE `survey`
  ADD CONSTRAINT `survey_ibfk_1` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `survey_comments`
--
ALTER TABLE `survey_comments`
  ADD CONSTRAINT `survey_comments_ibfk_1` FOREIGN KEY (`Survey_ID`) REFERENCES `survey` (`Survey_ID`),
  ADD CONSTRAINT `survey_comments_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `survey_comment_likes`
--
ALTER TABLE `survey_comment_likes`
  ADD CONSTRAINT `survey_comment_likes_ibfk_1` FOREIGN KEY (`Comment_ID`) REFERENCES `survey_comments` (`Comment_ID`),
  ADD CONSTRAINT `survey_comment_likes_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `survey_likes`
--
ALTER TABLE `survey_likes`
  ADD CONSTRAINT `survey_likes_ibfk_1` FOREIGN KEY (`Survey_ID`) REFERENCES `survey` (`Survey_ID`),
  ADD CONSTRAINT `survey_likes_ibfk_2` FOREIGN KEY (`User_ID`) REFERENCES `user` (`User_ID`);

--
-- Contraintes pour la table `user_followers`
--
ALTER TABLE `user_followers`
  ADD CONSTRAINT `user_followers_ibfk_1` FOREIGN KEY (`Follower_ID`) REFERENCES `user` (`User_ID`),
  ADD CONSTRAINT `user_followers_ibfk_2` FOREIGN KEY (`Following_ID`) REFERENCES `user` (`User_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
