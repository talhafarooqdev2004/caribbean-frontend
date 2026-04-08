import "server-only";

import { getDb } from "./mongodb";
import { type StoredEnquiry } from "./enquiry-types";

const COLLECTION_NAME = "enquiries";

declare global {
    var __caribbeanNewsEnquiryIndexesPromise: Promise<void> | undefined;
}

export async function ensureEnquiryIndexes() {
    if (!globalThis.__caribbeanNewsEnquiryIndexesPromise) {
        globalThis.__caribbeanNewsEnquiryIndexesPromise = (async () => {
            const db = await getDb();
            const collection = db.collection<StoredEnquiry>(COLLECTION_NAME);

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
        })().catch((error) => {
            globalThis.__caribbeanNewsEnquiryIndexesPromise = undefined;
            throw error;
        });
    }

    await globalThis.__caribbeanNewsEnquiryIndexesPromise;
}
