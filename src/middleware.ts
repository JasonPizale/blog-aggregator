import { getUser } from "./lib/db/queries/users";
import { User } from "./lib/db/schema";
import { CommandHandler } from "./commands/commands";
import { readConfig } from "./config";

type UserCommandHandler = (
    cmdName: string,
    user: User,
    ...args: string[]
) => Promise<void>;

export function middlewareLoggedIn(
    handler: UserCommandHandler,
): CommandHandler {
    return async (cmdName, ...args) => {
        const config = readConfig();

        if (!config.currentUserName) {
            throw new Error("no user is currently logged in");
        }

        const user = await getUser(config.currentUserName);
        
        if (!user) {
            throw new Error(`User ${config.currentUserName} not found`);
        }

        await handler(cmdName, user, ...args);
    };
}