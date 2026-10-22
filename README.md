# Gator

Gator is a command-line RSS feed aggregator built with TypeScript and PostgreSQL. It lets users register accounts, add RSS feeds, follow feeds, collect posts, and browse the latest posts from feeds they follow.

## Requirements

Before running Gator, you'll need:

- [Node.js](https://nodejs.org/) and npm
- [PostgreSQL](https://www.postgresql.org/) installed and running
- Git, if you want to clone the repository

## Installation

Clone the repository and enter the project directory:

```bash
git clone <your-public-repository-url>
cd blog-aggregator
```

Install the dependencies:

```bash
npm install
```

Create a PostgreSQL database for Gator and make sure you have a connection URL for it. For example:

```text
postgres://username:password@localhost:5432/gator
```

Replace the username, password, and database name with your own PostgreSQL details.

## Configuration

Gator uses a configuration file named `.gatorconfig.json` in your home directory.

Create `~/.gatorconfig.json` with the following contents, replacing the database URL with your own:

```json
{
  "db_url": "postgres://username:password@localhost:5432/gator",
  "current_user_name": ""
}
```

The `db_url` field specifies the PostgreSQL connection string. The `current_user_name` field tracks the currently logged-in user and is updated by the CLI.

Keep your database credentials private. Do not commit your configuration file or passwords to the public repository.

## Database Setup

Generate and apply any required database migrations:

```bash
npx drizzle-kit migrate
```

## Running Gator

Run commands from the project directory using:

```bash
npm run start <command> [arguments]
```

For example, register a new user:

```bash
npm run start register jason
```

Log in as an existing user:

```bash
npm run start login jason
```

## Available Commands

| Command | Description |
|---|---|
| `register <name>` | Register a new user |
| `login <name>` | Log in as an existing user |
| `users` | List registered users |
| `addfeed <name> <url>` | Add an RSS feed |
| `feeds` | List available feeds |
| `follow <url>` | Follow an RSS feed |
| `following` | List feeds followed by the current user |
| `unfollow <url>` | Unfollow an RSS feed |
| `agg <duration>` | Periodically fetch feeds and save new posts |
| `browse [limit]` | Browse the latest posts from followed feeds |
| `reset` | Reset the users table |

### Examples

Add a feed:

```bash
npm run start addfeed "Hacker News RSS" https://hnrss.org/newest
```

Start collecting feed posts every 10 seconds:

```bash
npm run start agg 10s
```

Stop the aggregator with `Ctrl+C`.

Browse the two latest posts from followed feeds:

```bash
npm run start browse
```

Browse up to five posts:

```bash
npm run start browse 5
```

Supported duration units include milliseconds (`ms`), seconds (`s`), minutes (`m`), and hours (`h`).

## Technologies

- TypeScript
- Node.js
- PostgreSQL
- Drizzle ORM and Drizzle Kit
- RSS parsing with `fast-xml-parser`
