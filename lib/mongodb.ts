import "server-only";

import { MongoClient, type Db } from "mongodb";

declare global {
    var __caribbeanNewsMongoClient: MongoClient | undefined;
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

    if (globalThis.__caribbeanNewsMongoClient) {
        return dbName ? globalThis.__caribbeanNewsMongoClient.db(dbName) : globalThis.__caribbeanNewsMongoClient.db();
    }

    if (!globalThis.__caribbeanNewsMongoClientPromise) {
        globalThis.__caribbeanNewsMongoClientPromise = new MongoClient(uri, {
            maxPoolSize: 10,
        })
            .connect()
            .then((client) => {
                globalThis.__caribbeanNewsMongoClient = client;
                return client;
            })
            .catch((error) => {
                globalThis.__caribbeanNewsMongoClientPromise = undefined;
                throw error;
            });
    }

    const client = await globalThis.__caribbeanNewsMongoClientPromise;

    return dbName ? client.db(dbName) : client.db();
}
