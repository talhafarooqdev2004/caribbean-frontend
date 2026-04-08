import { MongoClient } from "mongodb";

function requiredEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing ${name} environment variable.`);
    }
    return value;
}

async function run() {
    const uri = requiredEnv("MONGODB_URI");
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
