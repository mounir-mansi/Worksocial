require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const argon2 = require("argon2");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

async function main() {
  console.log("Nettoyage de la base...");
  // Supprime dans l'ordre pour respecter les FK
  await prisma.blacklistedToken.deleteMany();
  await prisma.resetPasswordKey.deleteMany();
  await prisma.emailVerification.deleteMany();
  await prisma.inviteFriend.deleteMany();
  await prisma.userFollower.deleteMany();
  await prisma.groupParticipant.deleteMany();
  await prisma.groupChat.deleteMany();
  await prisma.individualChat.deleteMany();
  await prisma.surveyVote.deleteMany();
  await prisma.surveyCommentLike.deleteMany();
  await prisma.surveyComment.deleteMany();
  await prisma.surveyLike.deleteMany();
  await prisma.survey.deleteMany();
  await prisma.eventCommentLike.deleteMany();
  await prisma.eventComment.deleteMany();
  await prisma.eventLike.deleteMany();
  await prisma.event.deleteMany();
  await prisma.postCommentLike.deleteMany();
  await prisma.postComment.deleteMany();
  await prisma.postLike.deleteMany();
  await prisma.post.deleteMany();
  await prisma.companyUser.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  console.log("Création des entreprises...");
  const techCorp = await prisma.company.create({
    data: {
      Name: "TechCorp",
      URL: "https://techcorp.example.com",
      Email: "contact@techcorp.example.com",
      Phone: "0123456789",
      Activity: "Développement logiciel",
      Address: "12 rue de la Paix, Paris",
    },
  });

  const designStudio = await prisma.company.create({
    data: {
      Name: "Design Studio",
      URL: "https://designstudio.example.com",
      Email: "hello@designstudio.example.com",
      Activity: "Design et UX",
      Address: "5 avenue Montaigne, Paris",
    },
  });

  console.log("Hashage des mots de passe...");
  // Mot de passe de tous les utilisateurs : Test1234!
  const hashedPassword = await argon2.hash("Test1234!", hashingOptions);

  console.log("Création des utilisateurs...");
  const alice = await prisma.user.create({
    data: {
      Username: "alice.dupont",
      LastName: "Dupont",
      FirstName: "Alice",
      Email: "alice@example.com",
      hashedPassword,
      Gender: "Female",
      Role: "Admin",
      Biography: "Développeuse fullstack passionnée.",
      BirthDate: new Date("1992-03-15"),
      Age: 33,
      emailVerified: true,
      Company_ID: techCorp.Company_ID,
    },
  });

  const bob = await prisma.user.create({
    data: {
      Username: "bob.martin",
      LastName: "Martin",
      FirstName: "Bob",
      Email: "bob@example.com",
      hashedPassword,
      Gender: "Male",
      Biography: "Designer UI/UX chez Design Studio.",
      BirthDate: new Date("1989-07-22"),
      Age: 36,
      emailVerified: true,
      Company_ID: designStudio.Company_ID,
    },
  });

  const carla = await prisma.user.create({
    data: {
      Username: "carla.santos",
      LastName: "Santos",
      FirstName: "Carla",
      Email: "carla@example.com",
      hashedPassword,
      Gender: "Female",
      Biography: "Chef de projet digital.",
      BirthDate: new Date("1995-11-08"),
      Age: 30,
      emailVerified: true,
      Company_ID: techCorp.Company_ID,
    },
  });

  const david = await prisma.user.create({
    data: {
      Username: "david.leroy",
      LastName: "Leroy",
      FirstName: "David",
      Email: "david@example.com",
      hashedPassword,
      Gender: "Male",
      BirthDate: new Date("1998-02-14"),
      Age: 27,
      emailVerified: true,
    },
  });

  const emma = await prisma.user.create({
    data: {
      Username: "emma.klein",
      LastName: "Klein",
      FirstName: "Emma",
      Email: "emma@example.com",
      hashedPassword,
      Gender: "Female",
      Biography: "Ingénieure DevOps.",
      BirthDate: new Date("1993-09-30"),
      Age: 32,
      emailVerified: false,
      Company_ID: techCorp.Company_ID,
    },
  });

  console.log("Création des posts...");
  const post1 = await prisma.post.create({
    data: {
      Title: "Bienvenue sur WorkSocial !",
      Content:
        "WorkSocial est le réseau social professionnel de notre entreprise. Partagez vos actualités, créez des événements et échangez avec vos collègues.",
      Visibility: "Public",
      User_ID: alice.User_ID,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      Title: "Nouveau projet lancé",
      Content:
        "Notre équipe vient de démarrer un nouveau projet React Native. Hâte de vous partager les avancées !",
      Visibility: "Public",
      User_ID: bob.User_ID,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      Title: "Réunion d'équipe vendredi",
      Content:
        "Rappel : réunion d'équipe vendredi à 14h en salle de conf B. Ordre du jour : bilan Q1 et roadmap Q2.",
      Visibility: "Private",
      User_ID: carla.User_ID,
    },
  });

  console.log("Création des commentaires et likes posts...");
  await prisma.postComment.create({
    data: {
      Post_ID: post1.Post_ID,
      User_ID: bob.User_ID,
      Comment: "Super initiative ! Content d'être sur cette plateforme.",
    },
  });

  await prisma.postComment.create({
    data: {
      Post_ID: post1.Post_ID,
      User_ID: carla.User_ID,
      Comment: "Hâte de voir les fonctionnalités arriver !",
    },
  });

  await prisma.postLike.create({
    data: { Post_ID: post1.Post_ID, User_ID: bob.User_ID },
  });
  await prisma.postLike.create({
    data: { Post_ID: post1.Post_ID, User_ID: carla.User_ID },
  });
  await prisma.postLike.create({
    data: { Post_ID: post1.Post_ID, User_ID: david.User_ID },
  });
  await prisma.postLike.create({
    data: { Post_ID: post2.Post_ID, User_ID: alice.User_ID },
  });

  console.log("Création des événements...");
  const event1 = await prisma.event.create({
    data: {
      EventName: "Team Building 2025",
      StartDate: new Date("2025-06-15"),
      EndDate: new Date("2025-06-15"),
      StartTime: new Date("1970-01-01T09:00:00"),
      EndTime: new Date("1970-01-01T18:00:00"),
      Description:
        "Une journée de team building pour renforcer la cohésion d'équipe. Au programme : ateliers créatifs, déjeuner commun et activités sportives.",
      Visibility: "Public",
      ParticipantCount: 25,
      User_ID: alice.User_ID,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      EventName: "Conférence Tech Paris",
      StartDate: new Date("2025-09-20"),
      EndDate: new Date("2025-09-21"),
      Description:
        "Deux jours de conférences sur les dernières tendances tech : IA, cloud, cybersécurité.",
      Visibility: "Public",
      User_ID: emma.User_ID,
    },
  });

  await prisma.eventLike.create({
    data: { Event_ID: event1.Event_ID, User_ID: bob.User_ID },
  });
  await prisma.eventLike.create({
    data: { Event_ID: event1.Event_ID, User_ID: carla.User_ID },
  });
  await prisma.eventComment.create({
    data: {
      Event_ID: event1.Event_ID,
      User_ID: david.User_ID,
      Comment: "J'ai hâte ! On s'inscrit comment ?",
    },
  });

  console.log("Création des sondages...");
  const survey1 = await prisma.survey.create({
    data: {
      Title: "Quel jour pour la réunion mensuelle ?",
      Content: "Votez pour le jour qui vous convient le mieux.",
      Visibility: "Public",
      Option1: "Lundi",
      Option2: "Mercredi",
      Option3: "Vendredi",
      EndDate: new Date("2025-05-31"),
      User_ID: carla.User_ID,
    },
  });

  const survey2 = await prisma.survey.create({
    data: {
      Title: "Télétravail ou présentiel ?",
      Content: "Quelle organisation préférez-vous pour le prochain trimestre ?",
      Visibility: "Public",
      Option1: "Full remote",
      Option2: "Hybride (2j/semaine)",
      Option3: "Full présentiel",
      Option4: "Flexible",
      User_ID: alice.User_ID,
    },
  });

  await prisma.surveyVote.create({
    data: { Survey_ID: survey1.Survey_ID, User_ID: alice.User_ID, Voted_For: "Option1" },
  });
  await prisma.surveyVote.create({
    data: { Survey_ID: survey1.Survey_ID, User_ID: bob.User_ID, Voted_For: "Option3" },
  });
  await prisma.surveyVote.create({
    data: { Survey_ID: survey1.Survey_ID, User_ID: david.User_ID, Voted_For: "Option2" },
  });
  await prisma.surveyVote.create({
    data: { Survey_ID: survey2.Survey_ID, User_ID: carla.User_ID, Voted_For: "Option2" },
  });
  await prisma.surveyVote.create({
    data: { Survey_ID: survey2.Survey_ID, User_ID: emma.User_ID, Voted_For: "Option2" },
  });

  await prisma.surveyLike.create({
    data: { Survey_ID: survey1.Survey_ID, User_ID: alice.User_ID },
  });
  await prisma.surveyLike.create({
    data: { Survey_ID: survey2.Survey_ID, User_ID: bob.User_ID },
  });

  console.log("Création des follows...");
  await prisma.userFollower.create({
    data: { Follower_ID: bob.User_ID, Following_ID: alice.User_ID },
  });
  await prisma.userFollower.create({
    data: { Follower_ID: carla.User_ID, Following_ID: alice.User_ID },
  });
  await prisma.userFollower.create({
    data: { Follower_ID: alice.User_ID, Following_ID: bob.User_ID },
  });
  await prisma.userFollower.create({
    data: { Follower_ID: david.User_ID, Following_ID: emma.User_ID },
  });

  console.log("Création des company_users...");
  await prisma.companyUser.create({
    data: { Company_ID: techCorp.Company_ID, User_ID: alice.User_ID, Role: "Admin" },
  });
  await prisma.companyUser.create({
    data: { Company_ID: techCorp.Company_ID, User_ID: carla.User_ID, Role: "Member" },
  });
  await prisma.companyUser.create({
    data: { Company_ID: techCorp.Company_ID, User_ID: emma.User_ID, Role: "Member" },
  });
  await prisma.companyUser.create({
    data: { Company_ID: designStudio.Company_ID, User_ID: bob.User_ID, Role: "Admin" },
  });

  console.log("Création d'un chat privé...");
  await prisma.individualChat.create({
    data: {
      Content: "Salut Alice, tu as vu le nouveau projet ?",
      User_ID1: bob.User_ID,
      User_ID2: alice.User_ID,
    },
  });
  await prisma.individualChat.create({
    data: {
      Content: "Oui ! C'est super excitant. On en parle demain ?",
      User_ID1: alice.User_ID,
      User_ID2: bob.User_ID,
    },
  });

  console.log("✅ Seed terminé !");
  console.log("─────────────────────────────────────────");
  console.log("Comptes de test (mot de passe : Test1234!)");
  console.log("  alice@example.com  — Admin");
  console.log("  bob@example.com    — User");
  console.log("  carla@example.com  — User");
  console.log("  david@example.com  — User");
  console.log("  emma@example.com   — User (email non vérifié)");
  console.log("─────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
