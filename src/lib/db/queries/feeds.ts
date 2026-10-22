import { and, eq, sql } from "drizzle-orm";
import { db } from "..";
import { feeds, users, feedFollows, Feed } from "../schema";

export async function createFeed(
    name: string,
    url: string,
    userId: string
) {
    const [result] = await db
        .insert(feeds)
        .values({
            name,
            url,
            userId,
        })
        .returning();

    return result;
}

export async function getFeeds() {
    return await db
        .select()
        .from(feeds)
        .innerJoin(users, eq(feeds.userId, users.id));
}

export async function getFeedByUrl(url: string) {
    const [feed] = await db
        .select()
        .from(feeds)
        .where(eq(feeds.url, url));
        
    return feed;
}

export async function createFeedFollow(
    userId: string,
    feedId: string,
) {
    const [newFeedFollow] = await db
        .insert(feedFollows)
        .values({ userId, feedId})
        .returning();

    const [result] = await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            userName: users.name,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.id, newFeedFollow.id));
        
    return result;
}

export async function getFeedFollowsForUser(UserId: string) {
    return await db
        .select({
            id: feedFollows.id,
            createdAt: feedFollows.createdAt,
            updatedAt: feedFollows.updatedAt,
            userId: feedFollows.userId,
            feedId: feedFollows.feedId,
            userName: users.name,
            feedName: feeds.name,
        })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.userId, UserId));
}

export async function deleteFeedFollow(
    userId: string,
    feedUrl: string,
): Promise<void> {
    await db
        .delete(feedFollows)
        .where(
            and(
                eq(feedFollows.userId, userId),
                eq(
                    feedFollows.feedId,
                    db
                        .select({ id: feeds.id })
                        .from(feeds)
                        .where(eq(feeds.url, feedUrl)),
                ),
            ),
        );
}

export async function markFeedFetched(feedId: string): Promise<void> {
    const now = new Date();

    await db
        .update(feeds)
        .set({
            lastFetchedAt: now,
            updatedAt: now,
        })
        .where(eq(feeds.id, feedId));
}

export async function getNextFeedToFetch(): Promise<Feed | undefined> {
    const [feed] = await db
        .select()
        .from(feeds)
        .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
        .limit(1);
        
    return feed;
}