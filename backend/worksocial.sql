

CREATE TABLE `individualchat` (
  `Chat_ID` int(11) NOT NULL,
  `Content` text NOT NULL,
  `Created_At` timestamp NOT NULL DEFAULT current_timestamp(),
  `Updated_At` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `User_ID1` int(11) DEFAULT NULL,
  `User_ID2` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `post_comment_likes` (
  `Like_ID` int(11) NOT NULL,
  `Comment_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Liked_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------


CREATE TABLE `survey_comment_likes` (
  `Like_ID` int(11) NOT NULL,
  `Comment_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Liked_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `survey_likes`
--

CREATE TABLE `survey_likes` (
  `Like_ID` int(11) NOT NULL,
  `Survey_ID` int(11) NOT NULL,
  `User_ID` int(11) NOT NULL,
  `Liked_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;



CREATE TABLE `user_followers` (
  `Follower_ID` int(11) NOT NULL,
  `Following_ID` int(11) NOT NULL,
  `Followed_At` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

