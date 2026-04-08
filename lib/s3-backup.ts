import "server-only";

import {
    DeleteObjectsCommand,
    GetObjectCommand,
    ListObjectsV2Command,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";

import { listEnquiries } from "./enquiries";
import { type EnquiryRecord } from "./enquiry-types";

let s3Client: S3Client | null = null;

function getS3BucketName() {
    const bucketName = process.env.S3_BUCKET_NAME;

    if (!bucketName) {
        throw new Error("Missing S3_BUCKET_NAME environment variable.");
    }

    return bucketName;
}

function getS3Region() {
    const region = process.env.S3_REGION;

    if (!region) {
        throw new Error("Missing S3_REGION environment variable.");
    }

    return region;
}

function getS3Credentials() {
    const accessKeyId = process.env.S3_ACCESS_KEY_ID;
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    const sessionToken = process.env.S3_SESSION_TOKEN;

    if (!accessKeyId || !secretAccessKey) {
        return undefined;
    }

    return {
        accessKeyId,
        secretAccessKey,
        ...(sessionToken ? { sessionToken } : {}),
    };
}

function getS3Prefix() {
    const prefix = process.env.S3_BACKUP_PREFIX || "enquiries/";

    return prefix.endsWith("/") ? prefix : `${prefix}/`;
}

function getS3Client() {
    if (!s3Client) {
        const config = {
            region: getS3Region(),
            ...(getS3Credentials() ? { credentials: getS3Credentials() } : {}),
        };

        s3Client = new S3Client(config);
    }

    return s3Client;
}

function getS3ObjectKey() {
    return `${getS3Prefix()}all-enquiries.json`;
}

function getS3EntriesPrefix() {
    return `${getS3Prefix()}entries/`;
}

function toMergeKey(enquiry: EnquiryRecord) {
    if (typeof enquiry.requestId === "string" && enquiry.requestId.trim().length > 0) {
        return `requestId:${enquiry.requestId}`;
    }

    return `id:${enquiry.id}`;
}

function mergeEnquiries(existing: EnquiryRecord[], incoming: EnquiryRecord[]) {
    const merged = new Map<string, EnquiryRecord>();

    for (const enquiry of existing) {
        merged.set(toMergeKey(enquiry), enquiry);
    }

    // Keep records permanently, but apply fresh values when a record already exists.
    for (const enquiry of incoming) {
        merged.set(toMergeKey(enquiry), enquiry);
    }

    return Array.from(merged.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function getExistingBackupEnquiries() {
    const bucket = getS3BucketName();
    const client = getS3Client();
    const key = getS3ObjectKey();

    try {
        const response = await client.send(
            new GetObjectCommand({
                Bucket: bucket,
                Key: key,
            })
        );

        const bodyText = await response.Body?.transformToString();

        if (!bodyText) {
            return [];
        }

        const parsed = JSON.parse(bodyText) as { enquiries?: unknown };

        if (!Array.isArray(parsed.enquiries)) {
            return [];
        }

        return parsed.enquiries as EnquiryRecord[];
    } catch (error) {
        const statusCode = typeof error === "object" && error !== null && "$metadata" in error
            ? (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode
            : undefined;
        const errorName = typeof error === "object" && error !== null && "name" in error
            ? String((error as { name?: unknown }).name)
            : "";

        if (statusCode === 404 || errorName === "NoSuchKey") {
            return [];
        }

        throw error;
    }
}

async function removeLegacyEntriesBackups() {
    const bucket = getS3BucketName();
    const client = getS3Client();
    const prefix = getS3EntriesPrefix();

    let continuationToken: string | undefined;

    do {
        const listed = await client.send(
            new ListObjectsV2Command({
                Bucket: bucket,
                Prefix: prefix,
                ContinuationToken: continuationToken,
            })
        );

        const objects = (listed.Contents || [])
            .map((item) => item.Key)
            .filter((key): key is string => Boolean(key))
            .map((key) => ({ Key: key }));

        if (objects.length > 0) {
            await client.send(
                new DeleteObjectsCommand({
                    Bucket: bucket,
                    Delete: { Objects: objects },
                })
            );
        }

        continuationToken = listed.IsTruncated ? listed.NextContinuationToken : undefined;
    } while (continuationToken);
}

export async function storeEnquiriesBackup(enquiries: EnquiryRecord[]) {
    const bucket = getS3BucketName();
    const client = getS3Client();
    const key = getS3ObjectKey();
    const existingEnquiries = await getExistingBackupEnquiries();
    const mergedEnquiries = mergeEnquiries(existingEnquiries, enquiries);

    await client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: JSON.stringify(
                {
                    backupCreatedAt: new Date().toISOString(),
                    enquiryCount: mergedEnquiries.length,
                    enquiries: mergedEnquiries,
                },
                null,
                2
            ),
            ContentType: "application/json; charset=utf-8",
        })
    );

    return {
        bucket,
        key,
    };
}

/** Refreshes only the aggregate JSON backup file. */
export async function syncEnquiriesToS3() {
    const enquiries = await listEnquiries();
    await storeEnquiriesBackup(enquiries);
    await removeLegacyEntriesBackups();
}

/** After a delete: refresh the aggregate file. */
export async function syncEnquiriesToS3AfterDelete() {
    await syncEnquiriesToS3();
}
