-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('Admin', 'User');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('Public', 'Private');

-- CreateTable
CREATE TABLE "user" (
    "User_ID" SERIAL NOT NULL,
    "Username" VARCHAR(255) NOT NULL,
    "LastName" VARCHAR(255) NOT NULL,
    "FirstName" VARCHAR(255) NOT NULL,
    "BirthDate" DATE,
    "Age" INTEGER,
    "Address" TEXT,
    "Email" VARCHAR(255) NOT NULL,
    "Phone" VARCHAR(255),
    "Biography" TEXT,
    "hashedPassword" VARCHAR(255) NOT NULL,
    "Role" "UserRole" NOT NULL DEFAULT 'User',
    "Gender" "Gender" NOT NULL,
    "ProfileImage" TEXT,
    "Created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMP(3) NOT NULL,
    "Company_ID" INTEGER,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("User_ID")
);

-- CreateTable
CREATE TABLE "company" (
    "Company_ID" SERIAL NOT NULL,
    "Name" VARCHAR(255) NOT NULL,
    "URL" VARCHAR(255),
    "Logo" TEXT,
    "Phone" VARCHAR(255),
    "Email" VARCHAR(255),
    "Activity" TEXT,
    "Address" TEXT,
    "Created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("Company_ID")
);

-- CreateTable
CREATE TABLE "company_user" (
    "Company_ID" INTEGER NOT NULL,
    "User_ID" INTEGER NOT NULL,
    "Role" VARCHAR(255),

    CONSTRAINT "company_user_pkey" PRIMARY KEY ("Company_ID","User_ID")
);

-- CreateTable
CREATE TABLE "post" (
    "Post_ID" SERIAL NOT NULL,
    "Image" TEXT,
    "Title" VARCHAR(255) NOT NULL,
    "Content" TEXT NOT NULL,
    "Visibility" "Visibility" NOT NULL,
    "Created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMP(3) NOT NULL,
    "User_ID" INTEGER,

    CONSTRAINT "post_pkey" PRIMARY KEY ("Post_ID")
);

-- CreateTable
CREATE TABLE "post_comments" (
    "Comment_ID" SERIAL NOT NULL,
    "Post_ID" INTEGER NOT NULL,
    "User_ID" INTEGER NOT NULL,
    "Comment" TEXT NOT NULL,
    "Created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_comments_pkey" PRIMARY KEY ("Comment_ID")
);

-- CreateTable
CREATE TABLE "post_likes" (
    "Post_ID" INTEGER NOT NULL,
    "User_ID" INTEGER NOT NULL,
    "Liked_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_likes_pkey" PRIMARY KEY ("Post_ID","User_ID")
);

-- CreateTable
CREATE TABLE "post_comment_likes" (
    "Like_ID" SERIAL NOT NULL,
    "Comment_ID" INTEGER NOT NULL,
    "User_ID" INTEGER NOT NULL,
    "Liked_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_comment_likes_pkey" PRIMARY KEY ("Like_ID")
);

-- CreateTable
CREATE TABLE "event" (
    "Event_ID" SERIAL NOT NULL,
    "Image" TEXT,
    "EventName" VARCHAR(255) NOT NULL,
    "StartDate" DATE NOT NULL,
    "EndDate" DATE,
    "StartTime" TIME(6),
    "EndTime" TIME(6),
    "Description" TEXT,
    "Visibility" "Visibility" NOT NULL,
    "ParticipantCount" INTEGER DEFAULT 0,
    "Created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMP(3) NOT NULL,
    "User_ID" INTEGER,

    CONSTRAINT "event_pkey" PRIMARY KEY ("Event_ID")
);

-- CreateTable
CREATE TABLE "event_comments" (
    "Comment_ID" SERIAL NOT NULL,
    "Event_ID" INTEGER NOT NULL,
    "User_ID" INTEGER NOT NULL,
    "Comment" TEXT NOT NULL,
    "Created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_comments_pkey" PRIMARY KEY ("Comment_ID")
);

-- CreateTable
CREATE TABLE "event_likes" (
    "Event_ID" INTEGER NOT NULL,
    "User_ID" INTEGER NOT NULL,
    "Liked_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_likes_pkey" PRIMARY KEY ("Event_ID","User_ID")
);

-- CreateTable
CREATE TABLE "event_comment_likes" (
    "Like_ID" SERIAL NOT NULL,
    "Comment_ID" INTEGER NOT NULL,
    "User_ID" INTEGER NOT NULL,
    "Liked_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_comment_likes_pkey" PRIMARY KEY ("Like_ID")
);

-- CreateTable
CREATE TABLE "survey" (
    "Survey_ID" SERIAL NOT NULL,
    "Image" TEXT,
    "Title" VARCHAR(255) NOT NULL,
    "Content" TEXT NOT NULL,
    "Visibility" "Visibility" NOT NULL,
    "EndDate" DATE,
    "Created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMP(3) NOT NULL,
    "User_ID" INTEGER,
    "Option1" VARCHAR(255) NOT NULL,
    "Option2" VARCHAR(255) NOT NULL,
    "Option3" VARCHAR(255),
    "Option4" VARCHAR(255),

    CONSTRAINT "survey_pkey" PRIMARY KEY ("Survey_ID")
);

-- CreateTable
CREATE TABLE "survey_comments" (
    "Comment_ID" SERIAL NOT NULL,
    "Survey_ID" INTEGER NOT NULL,
    "User_ID" INTEGER NOT NULL,
    "Comment" TEXT NOT NULL,
    "Created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_comments_pkey" PRIMARY KEY ("Comment_ID")
);

-- CreateTable
CREATE TABLE "survey_likes" (
    "Survey_ID" INTEGER NOT NULL,
    "User_ID" INTEGER NOT NULL,
    "Liked_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_likes_pkey" PRIMARY KEY ("Survey_ID","User_ID")
);

-- CreateTable
CREATE TABLE "survey_comment_likes" (
    "Like_ID" SERIAL NOT NULL,
    "Comment_ID" INTEGER NOT NULL,
    "User_ID" INTEGER NOT NULL,
    "Liked_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_comment_likes_pkey" PRIMARY KEY ("Like_ID")
);

-- CreateTable
CREATE TABLE "survey_votes" (
    "Survey_ID" INTEGER NOT NULL,
    "User_ID" INTEGER NOT NULL,
    "Voted_For" VARCHAR(10) NOT NULL,
    "create_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "survey_votes_pkey" PRIMARY KEY ("Survey_ID","User_ID")
);

-- CreateTable
CREATE TABLE "individualchat" (
    "Chat_ID" SERIAL NOT NULL,
    "Content" TEXT NOT NULL,
    "Created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMP(3) NOT NULL,
    "User_ID1" INTEGER,
    "User_ID2" INTEGER,

    CONSTRAINT "individualchat_pkey" PRIMARY KEY ("Chat_ID")
);

-- CreateTable
CREATE TABLE "groupchat" (
    "GroupChat_ID" SERIAL NOT NULL,
    "GroupImage" TEXT,
    "GroupName" VARCHAR(255) NOT NULL,
    "Content" TEXT NOT NULL,
    "Created_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Updated_At" TIMESTAMP(3) NOT NULL,
    "User_ID" INTEGER,

    CONSTRAINT "groupchat_pkey" PRIMARY KEY ("GroupChat_ID")
);

-- CreateTable
CREATE TABLE "groupparticipants" (
    "GroupChat_ID" INTEGER NOT NULL,
    "User_ID" INTEGER NOT NULL,
    "Joined_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "groupparticipants_pkey" PRIMARY KEY ("GroupChat_ID","User_ID")
);

-- CreateTable
CREATE TABLE "blacklisted_tokens" (
    "id" SERIAL NOT NULL,
    "jwtToken" VARCHAR(500) NOT NULL,
    "User_ID" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blacklisted_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verification" (
    "verification_id" SERIAL NOT NULL,
    "User_ID" INTEGER NOT NULL,
    "verification_code" VARCHAR(255) NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "email_verification_pkey" PRIMARY KEY ("verification_id")
);

-- CreateTable
CREATE TABLE "reset_password_keys" (
    "unique_key" VARCHAR(80) NOT NULL,
    "Email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL DEFAULT now() + interval '15 minutes',

    CONSTRAINT "reset_password_keys_pkey" PRIMARY KEY ("unique_key")
);

-- CreateTable
CREATE TABLE "user_followers" (
    "Follower_ID" INTEGER NOT NULL,
    "Following_ID" INTEGER NOT NULL,
    "Followed_At" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_followers_pkey" PRIMARY KEY ("Follower_ID","Following_ID")
);

-- CreateTable
CREATE TABLE "inviteFriends" (
    "invite_id" SERIAL NOT NULL,
    "inviter_id" INTEGER NOT NULL,
    "invitee_id" INTEGER NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inviteFriends_pkey" PRIMARY KEY ("invite_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_Username_key" ON "user"("Username");

-- CreateIndex
CREATE UNIQUE INDEX "user_Email_key" ON "user"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "post_comment_likes_Comment_ID_User_ID_key" ON "post_comment_likes"("Comment_ID", "User_ID");

-- CreateIndex
CREATE UNIQUE INDEX "event_comment_likes_Comment_ID_User_ID_key" ON "event_comment_likes"("Comment_ID", "User_ID");

-- CreateIndex
CREATE UNIQUE INDEX "survey_comment_likes_Comment_ID_User_ID_key" ON "survey_comment_likes"("Comment_ID", "User_ID");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_Company_ID_fkey" FOREIGN KEY ("Company_ID") REFERENCES "company"("Company_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_user" ADD CONSTRAINT "company_user_Company_ID_fkey" FOREIGN KEY ("Company_ID") REFERENCES "company"("Company_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_user" ADD CONSTRAINT "company_user_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_Post_ID_fkey" FOREIGN KEY ("Post_ID") REFERENCES "post"("Post_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_Post_ID_fkey" FOREIGN KEY ("Post_ID") REFERENCES "post"("Post_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comment_likes" ADD CONSTRAINT "post_comment_likes_Comment_ID_fkey" FOREIGN KEY ("Comment_ID") REFERENCES "post_comments"("Comment_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "post_comment_likes" ADD CONSTRAINT "post_comment_likes_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_comments" ADD CONSTRAINT "event_comments_Event_ID_fkey" FOREIGN KEY ("Event_ID") REFERENCES "event"("Event_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_comments" ADD CONSTRAINT "event_comments_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_likes" ADD CONSTRAINT "event_likes_Event_ID_fkey" FOREIGN KEY ("Event_ID") REFERENCES "event"("Event_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_likes" ADD CONSTRAINT "event_likes_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_comment_likes" ADD CONSTRAINT "event_comment_likes_Comment_ID_fkey" FOREIGN KEY ("Comment_ID") REFERENCES "event_comments"("Comment_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_comment_likes" ADD CONSTRAINT "event_comment_likes_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey" ADD CONSTRAINT "survey_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_comments" ADD CONSTRAINT "survey_comments_Survey_ID_fkey" FOREIGN KEY ("Survey_ID") REFERENCES "survey"("Survey_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_comments" ADD CONSTRAINT "survey_comments_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_likes" ADD CONSTRAINT "survey_likes_Survey_ID_fkey" FOREIGN KEY ("Survey_ID") REFERENCES "survey"("Survey_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_likes" ADD CONSTRAINT "survey_likes_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_comment_likes" ADD CONSTRAINT "survey_comment_likes_Comment_ID_fkey" FOREIGN KEY ("Comment_ID") REFERENCES "survey_comments"("Comment_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_comment_likes" ADD CONSTRAINT "survey_comment_likes_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_votes" ADD CONSTRAINT "survey_votes_Survey_ID_fkey" FOREIGN KEY ("Survey_ID") REFERENCES "survey"("Survey_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "survey_votes" ADD CONSTRAINT "survey_votes_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "individualchat" ADD CONSTRAINT "individualchat_User_ID1_fkey" FOREIGN KEY ("User_ID1") REFERENCES "user"("User_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "individualchat" ADD CONSTRAINT "individualchat_User_ID2_fkey" FOREIGN KEY ("User_ID2") REFERENCES "user"("User_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupchat" ADD CONSTRAINT "groupchat_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupparticipants" ADD CONSTRAINT "groupparticipants_GroupChat_ID_fkey" FOREIGN KEY ("GroupChat_ID") REFERENCES "groupchat"("GroupChat_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupparticipants" ADD CONSTRAINT "groupparticipants_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blacklisted_tokens" ADD CONSTRAINT "blacklisted_tokens_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verification" ADD CONSTRAINT "email_verification_User_ID_fkey" FOREIGN KEY ("User_ID") REFERENCES "user"("User_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reset_password_keys" ADD CONSTRAINT "reset_password_keys_Email_fkey" FOREIGN KEY ("Email") REFERENCES "user"("Email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_followers" ADD CONSTRAINT "user_followers_Follower_ID_fkey" FOREIGN KEY ("Follower_ID") REFERENCES "user"("User_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_followers" ADD CONSTRAINT "user_followers_Following_ID_fkey" FOREIGN KEY ("Following_ID") REFERENCES "user"("User_ID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inviteFriends" ADD CONSTRAINT "inviteFriends_inviter_id_fkey" FOREIGN KEY ("inviter_id") REFERENCES "user"("User_ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inviteFriends" ADD CONSTRAINT "inviteFriends_invitee_id_fkey" FOREIGN KEY ("invitee_id") REFERENCES "user"("User_ID") ON DELETE CASCADE ON UPDATE CASCADE;
