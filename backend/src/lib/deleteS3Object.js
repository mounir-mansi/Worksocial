const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

/**
 * Supprime un objet R2 à partir de son URL publique.
 * Si l'URL ne correspond pas au bucket configuré, ne fait rien.
 */
async function deleteS3Object(imageUrl) {
  if (!imageUrl || !imageUrl.startsWith("http")) return;
  const key = imageUrl.split("/").pop();
  if (!key) return;
  try {
    await s3.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
  } catch (err) {
    console.error("deleteS3Object error:", err.message);
  }
}

module.exports = { deleteS3Object };
