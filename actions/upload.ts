'use server';

import cloudinary from '../lib/cloudinary';

export async function upload(formData: FormData) {
	const file = formData.get('video') as File;
	const buffer: Buffer = Buffer.from(await file.arrayBuffer());

	// Sanitize the public_id (file name) if needed
	const safePublicId = file.name.replace(/[^a-zA-Z0-9-_]/g, '_');

	const uploadResponse = await new Promise<{
		secure_url: string;
		public_id: string;
	}>((resolve, reject) => {
		cloudinary.uploader
			.upload_stream(
				{
					resource_type: 'video',
					public_id: safePublicId,
				},
				(error, result) => {
					if (error) {
						reject(error);
					} else if (result) {
						resolve(result);
					} else {
						reject(new Error('Upload result is undefined'));
					}
				}
			)
			.end(buffer);
	});

	const optimizedVideoUrl = cloudinary.url(uploadResponse.public_id, {
		resource_type: 'video',
		width: 720,
		height: 1280,
		crop: 'fill',
		quality: 'auto',
		// gravity: 'auto',
		format: 'mp4',
	});

	console.log(optimizedVideoUrl);

	return optimizedVideoUrl;
}
