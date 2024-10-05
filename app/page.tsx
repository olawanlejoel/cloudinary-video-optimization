'use client';

import { upload } from '../actions/upload';
import { useState } from 'react';

export default function Home() {
	const [optimizedVideoUrl, setOptimizedVideoUrl] = useState<string>('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setLoading(true);
		const formData = new FormData(event.currentTarget);

		try {
			const videoUrl: string = await upload(formData);
			setOptimizedVideoUrl(videoUrl);
		} catch (error) {
			console.error('Upload failed', error);
		} finally {
			setLoading(false); // Stop loading state
		}
	};

	// Function to handle download of the transformed video
	const handleDownload = async () => {
		if (optimizedVideoUrl) {
			// Fetch the video from the URL
			const response = await fetch(optimizedVideoUrl, {
				method: 'GET',
				mode: 'cors',
			});

			// Create a blob from the response
			const blob = await response.blob();

			// Create a URL for the blob object
			const blobUrl = window.URL.createObjectURL(blob);

			// Create a link element and trigger the download
			const a = document.createElement('a');
			a.href = blobUrl;
			a.download = `optimized_video`;
			document.body.appendChild(a);
			a.click();

			// Clean up the URL object
			window.URL.revokeObjectURL(blobUrl);
			document.body.removeChild(a);
		}
	};

	return (
		<div className="min-h-screen flex-col items-center justify-between p-10 mt-14">
			<h1 className="text-3xl font-semibold text-center pb-5">
				Generate Optimzed TikTok Video with Cloudinary
			</h1>
			<div className="flex justify-center my-10 items-center ">
				<form onSubmit={handleSubmit} className="border p-2 rounded">
					<input type="file" name="video" accept="video/*" required />
					<button
						type="submit"
						className="bg-blue-800 text-white p-2 rounded-md"
						disabled={loading}
					>
						{loading ? 'Uploading...' : 'Upload'}
					</button>
				</form>
			</div>

			{optimizedVideoUrl && (
				<div className="flex justify-center space-x-4 mt-10">
					<div>
						<h2 className="text-lg font-bold text-center mb-4">
							Optimized Video
						</h2>
						<video
							src={optimizedVideoUrl}
							controls
							className="w-full max-w-md border-4 rounded"
						/>
						{/* Add a download button */}
						<div className="text-center mt-4">
							<button
								onClick={handleDownload}
								className="bg-green-600 text-white p-2 rounded-md"
							>
								Download Video
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
