import {
  CommandsRegistry,
  registerCommand,
  runCommand,
} from "./commands/commands";

import {
  handlerLogin,
  handlerRegister,
} from "./commands/users";

async function main(): Promise<void> {
  const registry: CommandsRegistry = {};

  registerCommand(registry, "login", handlerLogin);
  registerCommand(registry, "register", handlerRegister);

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