import fs from 'fs';
import os from 'os';
import path from 'path';

export type Config = {
    dbUrl: string;
    currentUserName: string;
};

function getConfigFilePath(): string {
    return path.join(os.homedir(), ".gatorconfig.json");
}

function validateConfig(rawConfig: any): Config {
    if (typeof rawConfig !== "object" || rawConfig === null) {
        throw new Error("Invalid config file");
    }
    
    if (typeof rawConfig.db_url !== "string") {
        throw new Error("dbUrl is required");
    }

    if (
        rawConfig.current_user_name !== undefined &&
        typeof rawConfig.current_user_name !== "string"
    ) {
        throw new Error("currentUserName must be a string");
    }

    return {
        dbUrl: rawConfig.db_url,
        currentUserName: rawConfig.current_user_name,
    };
}

function writeConfig(cfg: Config): void {
    const rawConfig = {
        db_url: cfg.dbUrl,
        current_user_name: cfg.currentUserName,
    };
    
    fs.writeFileSync(
        getConfigFilePath(),
        JSON.stringify(rawConfig, null, 2)
    );
}

export function readConfig(): Config {
    const data = fs.readFileSync(getConfigFilePath(), "utf-8");
    const parsed = JSON.parse(data);
    return validateConfig(parsed);
}

export function setUser(userName: string): void {
    const cfg = readConfig();
    cfg.currentUserName = userName;
    writeConfig(cfg);
}
