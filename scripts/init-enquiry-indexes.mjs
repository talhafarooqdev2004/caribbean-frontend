import { MongoClient } from "mongodb";

async function run() {
    const uri = process.env.MONGODB_URI?.trim();

    if (!uri) {
        console.warn("Skipping enquiry index init: MONGODB_URI is not set.");
        return;
    }

    const dbName = process.env.MONGODB_DB_NAME || process.env.MONGODB_DB;
    const client = new MongoClient(uri, { maxPoolSize: 10 });

    try {
        await client.connect();
        const db = dbName ? client.db(dbName) : client.db();
        const collection = db.collection("enquiries");

        await Promise.all([
            collection.createIndex({ source: 1, createdAt: -1 }),
            collection.createIndex({ source: 1, status: 1, createdAt: -1 }),
            collection.createIndex(
                { source: 1, requestId: 1 },
                {
                    unique: true,
                    partialFilterExpression: {
                        source: "media-signup",
                        requestId: { $type: "string" },
                    },
                }
            ),
        ]);

        console.log("Enquiry indexes initialized.");
    } finally {
        await client.close();
    }
}

run().catch((error) => {
    console.error("Failed to initialize enquiry indexes:", error);
    process.exit(1);
});
