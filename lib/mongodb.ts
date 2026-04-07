import "server-only";

import { MongoClient, type Db } from "mongodb";

declare global {
    var __caribbeanNewsMongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoUri() {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error("Missing MONGODB_URI environment variable.");
    }

    return uri;
}

export async function getDb(): Promise<Db> {
    const uri = getMongoUri();
    const dbName = process.env.MONGODB_DB_NAME || process.env.MONGODB_DB;

    if (!globalThis.__caribbeanNewsMongoClientPromise) {
        const client = new MongoClient(uri, {
            maxPoolSize: 10,
        });

        globalThis.__caribbeanNewsMongoClientPromise = client.connect();
    }

    const client = await globalThis.__caribbeanNewsMongoClientPromise;

    return dbName ? client.db(dbName) : client.db();
}
