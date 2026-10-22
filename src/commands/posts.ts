
import { getPostsForUser } from "../lib/db/queries/posts";
import { User } from "../lib/db/schema";

export const handlerBrowse = async (
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> => {
  if (args.length > 1) {
    throw new Error("browse accepts at most one limit argument");
  }

  const limit = args.length === 0 ? 2 : Number(args[0]);

  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("limit must be a positive integer");
  }

  const posts = await getPostsForUser(user.id, limit);

  if (posts.length === 0) {
    console.log("No posts found. Try running agg first.");
    return;
  }

  for (const post of posts) {
    console.log(`Title: ${post.title}`);
    console.log(`URL: ${post.url}`);
    console.log(`Feed: ${post.feedName}`);
    console.log(`Published: ${post.publishedAt ?? "Unknown"}`);
    console.log(`Description: ${post.description}`);
    console.log("---");
  }
};
