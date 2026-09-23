import { readConfig } from "../config";
import { createFeed, getFeeds, } from "../lib/db/queries/feeds";
import { getUser } from "../lib/db/queries/users";
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

export const handlerAddFeed: CommandHandler = async (
  cmdName,
  ...args
): Promise<void> => {
  if (args.length < 2) {
    throw new Error("name and url are required");
  }

  const [name, url] = args;

  const config = readConfig();

  if (!config.currentUserName) {
    throw new Error("no user is currently logged in");
  }

  const user = await getUser(config.currentUserName);

  if (!user) {
    throw new Error("current user does not exist");
  }

  const feed = await createFeed(name, url, user.id);

  printFeed(feed, user);
};

export const handlerFeeds: CommandHandler = async (
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