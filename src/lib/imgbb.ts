// Client-side helper. Key never reaches the browser — the server route
// /api/upload-image owns the ImgBB credential and performs the upload.
export async function uploadToImgbb(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  let res: Response;
  try {
    res = await fetch("/api/upload-image", {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new Error("Image upload failed. Please try again.");
  }

  let data: { url?: string; message?: string } = {};
  try {
    data = (await res.json()) as { url?: string; message?: string };
  } catch {
    // non-JSON error response
  }

  if (!res.ok || !data.url) {
    throw new Error(data.message || "Image upload failed. Please try again.");
  }

  return data.url;
}
