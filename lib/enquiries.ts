import "server-only";

import { ObjectId, type WithId } from "mongodb";

import { getDb } from "./mongodb";
import { validateEnquiryInput, type EnquiryErrors } from "./enquiry-validation";
import { type EnquiryFormValues, type EnquirySubmissionValues } from "./enquiry-options";

export type StoredEnquiry = EnquirySubmissionValues & {
    _id: ObjectId;
    source: "media-signup";
    status: "new";
    createdAt: Date;
    updatedAt: Date;
};

export type EnquiryRecord = Omit<StoredEnquiry, "_id" | "createdAt" | "updatedAt"> & {
    id: string;
    createdAt: string;
    updatedAt: string;
};

const COLLECTION_NAME = "enquiries";
let enquiryIndexesPromise: Promise<void> | null = null;

async function ensureEnquiryIndexes() {
    if (!enquiryIndexesPromise) {
        enquiryIndexesPromise = (async () => {
            const db = await getDb();
            const collection = db.collection<StoredEnquiry>(COLLECTION_NAME);

            await Promise.all([
                collection.createIndex({ source: 1, createdAt: -1 }),
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
            enquiryIndexesPromise = null;
            throw error;
        });
    }

    await enquiryIndexesPromise;
}

function serializeEnquiry(enquiry: WithId<StoredEnquiry>): EnquiryRecord {
    const { _id, createdAt, updatedAt, ...rest } = enquiry;

    return {
        ...rest,
        id: _id.toHexString(),
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
    };
}

export async function insertEnquiry(input: EnquirySubmissionValues) {
    const db = await getDb();
    const collection = db.collection<StoredEnquiry>(COLLECTION_NAME);
    await ensureEnquiryIndexes();
    const now = new Date();

    const document: StoredEnquiry = {
        ...input,
        _id: new ObjectId(),
        requestId: input.requestId,
        source: "media-signup",
        status: "new",
        createdAt: now,
        updatedAt: now,
    };

    const result = await collection.updateOne(
        {
            source: "media-signup",
            requestId: input.requestId,
        },
        {
            $setOnInsert: document,
        },
        {
            upsert: true,
        }
    );

    if (result.upsertedId) {
        return serializeEnquiry(document);
    }

    const existingEnquiry = await collection.findOne({
        source: "media-signup",
        requestId: input.requestId,
    });

    if (!existingEnquiry) {
        throw new Error("Unable to persist enquiry.");
    }

    return serializeEnquiry(existingEnquiry);
}

export async function listEnquiries() {
    const db = await getDb();
    const collection = db.collection<StoredEnquiry>(COLLECTION_NAME);
    await ensureEnquiryIndexes();
    const enquiries = await collection.find({ source: "media-signup" }).sort({ createdAt: -1 }).toArray();

    return enquiries.map(serializeEnquiry);
}

export async function deleteEnquiryById(id: string) {
    if (!ObjectId.isValid(id)) {
        return {
            deleted: false,
            invalidId: true,
        } as const;
    }

    const db = await getDb();
    const collection = db.collection<StoredEnquiry>(COLLECTION_NAME);
    await ensureEnquiryIndexes();
    const result = await collection.deleteOne({ _id: new ObjectId(id), source: "media-signup" });

    return {
        deleted: result.deletedCount === 1,
        invalidId: false,
    } as const;
}

export function validateAndInsertableEnquiry(input: Partial<EnquiryFormValues>) {
    return validateEnquiryInput(input);
}

export type { EnquiryErrors };
export type { EnquirySubmissionValues };
