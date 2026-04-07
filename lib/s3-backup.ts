import "server-only";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { type EnquiryRecord } from "./enquiries";

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

function buildBackupKey(enquiry: EnquiryRecord) {
    const createdAt = new Date(enquiry.createdAt);
    const year = createdAt.getUTCFullYear();
    const month = String(createdAt.getUTCMonth() + 1).padStart(2, "0");
    const day = String(createdAt.getUTCDate()).padStart(2, "0");

    return `${getS3Prefix()}${year}/${month}/${day}/${enquiry.requestId}.json`;
}

export async function storeEnquiryBackup(enquiry: EnquiryRecord) {
    const bucket = getS3BucketName();
    const client = getS3Client();
    const key = buildBackupKey(enquiry);

    await client.send(
        new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: JSON.stringify(
                {
                    enquiry,
                    backupCreatedAt: new Date().toISOString(),
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
