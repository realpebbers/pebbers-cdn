export class CdnError extends Error {}

export class UploadError extends CdnError {
	constructor(options: ErrorOptions) {
		super("File failed to upload to S3 Bucket", options);
	}
}

export class GetFilesError extends CdnError {
	constructor(options: ErrorOptions) {
		super("Failed to retrieve files from S3 Bucket", options);
	}
}
