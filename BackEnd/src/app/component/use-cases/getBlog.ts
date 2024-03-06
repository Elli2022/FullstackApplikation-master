//BackEnd/src/app/component/use-cases/getBlog.ts
import { getBlogPosts } from "../data-access";

export default function createGetBlog({ logger }) {
  return Object.freeze({ getBlog });

  async function getBlog({ dbConfig }) {
    logger.info("[GETBLOG][USE-CASE] Fetching blog posts - START!");

    // Validera databaskonfigurationen
    if (!dbConfig || typeof dbConfig !== "object") {
      logger.error("[GETBLOG][USE-CASE] Invalid database configuration.");
      throw new Error("Ogiltig databaskonfiguration");
    }

    // Försök att hämta blogginlägg från databasen
    try {
      const posts = await getBlogPosts({ dbConfig });
      if (!posts || posts.length === 0) {
        logger.info("[GETBLOG][USE-CASE] No blog posts found.");
        return [];
      }
      logger.info(`[GETBLOG][USE-CASE] Fetched ${posts.length} blog posts.`);
      return posts;
    } catch (error) {
      logger.error(
        `[GETBLOG][USE-CASE] Could not fetch blog posts: ${error.message}`
      );
      throw error; // Kasta vidare felet så att det kan hanteras uppströms
    }
  }
}
