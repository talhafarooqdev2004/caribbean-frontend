import "server-only";

import { ObjectId, type WithId } from "mongodb";

import { getDb } from "./mongodb";
import { validateEnquiryInput, type EnquiryErrors } from "./enquiry-validation";
import { type EnquiryFormValues, type EnquirySubmissionValues } from "./enquiry-options";
import {
    type EnquiryRecord,
    type EnquiryStatus,
    type StoredEnquiry,
    type StoredEnquiryStatus,
} from "./enquiry-types";

type StoredEnquiryDocument = StoredEnquiry & {
    _id: ObjectId;
};

const COLLECTION_NAME = "enquiries";

function normalizeEnquiryStatus(status: StoredEnquiryStatus | undefined | null): EnquiryStatus {
    if (status === "approved" || status === "rejected") {
        return status;
    }

    return "pending";
}

function serializeEnquiry(enquiry: WithId<StoredEnquiry>): EnquiryRecord {
    const { _id, createdAt, updatedAt, ...rest } = enquiry;

    return {
        ...rest,
        status: normalizeEnquiryStatus(rest.status),
        id: _id.toHexString(),
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
    };
}

export async function insertEnquiry(input: EnquirySubmissionValues) {
    const db = await getDb();
    const collection = db.collection<StoredEnquiry>(COLLECTION_NAME);
    const now = new Date();

    const document: StoredEnquiryDocument = {
        ...input,
        _id: new ObjectId(),
        requestId: input.requestId,
        source: "media-signup",
        status: "pending",
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
    const result = await collection.deleteOne({ _id: new ObjectId(id), source: "media-signup" });

    return {
        deleted: result.deletedCount === 1,
        invalidId: false,
    } as const;
}

export async function setEnquiryStatusById(id: string, status: EnquiryStatus) {
    if (!ObjectId.isValid(id)) {
        return {
            updated: false,
            invalidId: true,
            notFound: false,
            enquiry: null,
        } as const;
    }

    const db = await getDb();
    const collection = db.collection<StoredEnquiry>(COLLECTION_NAME);

    const updatedEnquiry = await collection.findOneAndUpdate(
        {
            _id: new ObjectId(id),
            source: "media-signup",
        },
        {
            $set: {
                status,
                updatedAt: new Date(),
            },
        },
        {
            returnDocument: "after",
        }
    );

    if (!updatedEnquiry) {
        return {
            updated: false,
            invalidId: false,
            notFound: true,
            enquiry: null,
        } as const;
    }

    return {
        updated: true,
        invalidId: false,
        notFound: false,
        enquiry: serializeEnquiry(updatedEnquiry),
    } as const;
}

export async function approveEnquiryById(id: string) {
    return setEnquiryStatusById(id, "approved");
}

export async function rejectEnquiryById(id: string) {
    return setEnquiryStatusById(id, "rejected");
}

export async function revertEnquiryById(id: string) {
    return setEnquiryStatusById(id, "pending");
}

export function validateAndInsertableEnquiry(input: Partial<EnquiryFormValues>) {
    return validateEnquiryInput(input);
}

export type { EnquiryErrors };
export type { EnquirySubmissionValues };
