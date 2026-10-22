import { fetchFeed } from "../rss";
import { CommandHandler } from "./commands";
import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";
import { createPost } from "../lib/db/queries/posts";

export async function scrapeFeeds(): Promise<void> {
  const feed = await getNextFeedToFetch();

  if (!feed) {
    throw new Error("no feeds found");
  }

  console.log(`Fetching feed: ${feed.name}`);

  const rssFeed = await fetchFeed(feed.url);

  await markFeedFetched(feed.id);

  for (const item of rssFeed.channel.item) {
    const parsedDate = new Date(item.pubDate);

    const publishedAt = Number.isNaN(parsedDate.getTime())
      ? null
      : parsedDate;

    const post = await createPost(
      item.title,
      item.link,
      item.description,
      publishedAt,
      feed.id,
    );

    if (post) {
      console.log(`Saved post: ${post.title}`);
    }
  }
}

export function parseDuration(durationStr: string): number {
  const regex = /^(\d+)(ms|s|m|h)$/;
  const match = durationStr.match(regex);

  if (!match) {
    throw new Error(`invalid duration: ${durationStr}`);
  }

  const amount = Number(match[1]);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60_000,
    h: 3_600_000,
  };

  return amount * multipliers[unit];
}

export const handlerAgg: CommandHandler = async (
  cmdName,
  ...args
): Promise<void> => {
  if (args.length !== 1) {
    throw new Error("exactly one duration argument is required");
  }

  const timeBetweenRequests = parseDuration(args[0]);

  console.log(`Collecting feeds every ${args[0]}`);

  scrapeFeeds().catch((err) => {
    console.error(err);
  });

  const interval = setInterval(() => {
    scrapeFeeds().catch((err) => {
      console.error(err);
    });
  }, timeBetweenRequests);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregator...");
      clearInterval(interval);
      resolve();
    });
  });
};