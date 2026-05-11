import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { env } from "./env";
import { UploadError } from "./errors";

// TODO: different code for Lambda that uses IAM roles?
export const s3Client = new S3Client({
  region: env.AWS_REGION,
  ...(env.ACCESS_KEY_ID &&
    env.SECRET_ACCESS_KEY && {
      credentials: {
        accessKeyId: env.ACCESS_KEY_ID,
        secretAccessKey: env.SECRET_ACCESS_KEY,
      },
    }),
});

export async function uploadFile(key: string, body: ReadableStream) {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET,
      Key: key,
      Body: body,
    },
  });

  try {
    return await upload.done();
  } catch (err) {
    console.error(err);

    throw new UploadError({ cause: err });
  }
}

export const BUCKET = env.S3_BUCKET;
