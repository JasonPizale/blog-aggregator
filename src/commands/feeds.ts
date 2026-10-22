import { createFeed, getFeeds, getFeedByUrl, createFeedFollow, getFeedFollowsForUser, deleteFeedFollow, } from "../lib/db/queries/feeds";
import { Feed, User } from "../lib/db/schema";
import { CommandHandler } from "./commands";


export function printFeed(feed: Feed, user: User): void {
  console.log(`ID: ${feed.id}`);
  console.log(`Created At: ${feed.createdAt}`);
  console.log(`Updated At: ${feed.updatedAt}`);
  console.log(`Name: ${feed.name}`);
  console.log(`URL: ${feed.url}`);
  console.log(`User: ${user.name}`);
}

export const handlerAddFeed = async (
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> => {
  if (args.length < 2) {
    throw new Error("name and url are required");
  }

  const [name, url] = args;

  const feed = await createFeed(name, url, user.id);

  const result = await createFeedFollow(user.id, feed.id);

  console.log(`${result.userName} is now following ${result.feedName}`);

  printFeed(feed, user);
};

export const handlerFeeds = async (
  cmdName,
  ...args
): Promise<void> => {
  const results = await getFeeds();

  for (const result of results) {
    console.log(`Name: ${result.feeds.name}`);
    console.log(`URL: ${result.feeds.url}`);
    console.log(`User: ${result.users.name}`);
  }
};

export const handlerFollow = async (
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> => {
  if (args.length !== 1) {
    throw new Error("exactly one feed URL is required");
  }

  const feed = await getFeedByUrl(args[0]);

  if (!feed) {
    throw new Error("feed does not exist");
  }

  const result = await createFeedFollow(user.id, feed.id);

  console.log(`${result.userName} is now following ${result.feedName}`);
};

export const handlerFollowing = async (
  cmdName: string,
  user: User,
  ...args: string[]
): Promise<void> => {
  const follows = await getFeedFollowsForUser(user.id);

  console.log(`Feeds followed by ${user.name}:`);

  for (const follow of follows) {
    console.log(`- ${follow.feedName}`);
  }
};

export const handlerUnfollow = async (
  cmdName: string, 
  user: User,
  ...args: string[]
): Promise<void> => {
  if (args.length !== 1) {
    throw new Error("exactly one feed URL is required");
  }

  await deleteFeedFollow(user.id, args[0]);
};
