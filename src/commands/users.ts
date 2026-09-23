import { readConfig, setUser } from "../config";
import { createUser, getUser, getUsers, deleteUsers, } from "../lib/db/queries/users";
import { CommandHandler } from "./commands";

export const handlerLogin: CommandHandler = async (
  cmdName,
  ...args
): Promise<void> => {
  if (args.length === 0) {
    throw new Error("username is required");
  }

  const username = args[0];

  const user = await getUser(username);

  if (!user) {
    throw new Error("user does not exist");
  }

  setUser(user.name);

  console.log(`User set to ${user.name}`);
};

export const handlerRegister: CommandHandler = async (
  cmdName,
  ...args
): Promise<void> => {
  if (args.length === 0) {
    throw new Error("username is required");
  }

  const username = args[0];

  const existingUser = await getUser(username);

  if (existingUser) {
    throw new Error("user already exists");
  }

  const user = await createUser(username);

  setUser(user.name);

  console.log(`User created and logged in as ${user.name}`);
};

export const handlerReset: CommandHandler = async (
  cmdName,
  ...args
): Promise<void> => {
  await deleteUsers();
  console.log("Database reset successfully");
};

export const handlerUsers: CommandHandler = async (
  cmdName,
  ...args
): Promise<void> => {
  const allUsers = await getUsers();
  const config = readConfig();

  for (const user of allUsers) {
    if (user.name === config.currentUserName) {
      console.log(`* ${user.name} (current)`);
    } else {
      console.log(`* ${user.name}`);
    }
  }
};