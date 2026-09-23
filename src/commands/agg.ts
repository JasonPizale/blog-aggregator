import { fetchFeed } from "../rss";
import { CommandHandler } from "./commands";

export const handlerAgg: CommandHandler = async (
  cmdName,
  ...args
): Promise<void> => {
  const feed = await fetchFeed("https://www.wagslane.dev/index.xml");

  console.dir(feed, { depth: null });
};