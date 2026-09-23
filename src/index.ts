import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";

import {
  handlerLogin,
  handlerRegister,
  handlerReset,
  handlerUsers,
} from "./commands/users";

import { handlerAgg } from "./commands/agg";

import { 
  handlerAddFeed, 
  handlerFeeds,
} from "./commands/feeds";

async function main(): Promise<void> {
  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);
  registerCommand(registry, "reset", handlerReset);
  registerCommand(registry, "users", handlerUsers);
  registerCommand(registry, "agg", handlerAgg);
  registerCommand(registry, "addfeed", handlerAddFeed);
  registerCommand(registry, "feeds", handlerFeeds);

  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.error("not enough arguments");
    process.exit(1);
  }

  const [cmdName, ...cmdArgs] = args;

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
    process.exit(0);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
}

main();