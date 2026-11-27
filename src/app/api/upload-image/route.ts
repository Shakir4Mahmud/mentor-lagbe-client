import { getAuth } from "@/lib/auth";

// Client ke ImgBB key kakhono dewa hoy na. Client shudhu file-i POST kore,
// key shudhu ei server-only route-e use hoy.
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: Request) {
  // Anonymous user key use korte parbe na
  const session = await getAuth().api.getSession({ headers: request.headers });
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ message: "Invalid upload request" }, { status: 400 });
  }

  const file = formData.get("file");

  if (!file || typeof file === "string") {
    return Response.json({ message: "No image file provided" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return Response.json(
      { message: "Only JPG, PNG, WEBP or GIF images are allowed" },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return Response.json(
      { message: "Image must be smaller than 5 MB" },
      { status: 400 },
    );
  }

  // Migration fallback: porono NEXT_PUBLIC_IMGBB_KEY hosting env-e thakle
  // kisu na bANGE. Naya deploy-e IMGBB_KEY set korar por porono ta delete koro.
  const apiKey = process.env.IMGBB_KEY || process.env.NEXT_PUBLIC_IMGBB_KEY;

  if (!apiKey) {
    return Response.json(
      { message: "Image upload is not configured" },
      { status: 500 },
    );
  }

  try {
    const uploadData = new FormData();
    uploadData.append("image", file);

    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
      { method: "POST", body: uploadData },
    );

    const data = (await res.json()) as {
      success?: boolean;
      data?: { url?: string };
      error?: { message?: string };
    };

    if (!res.ok || !data.success || !data.data?.url) {
      return Response.json(
        { message: "Image upload failed. Please try again." },
        { status: 502 },
      );
    }

    return Response.json({ url: data.data.url });
  } catch {
    return Response.json(
      { message: "Image upload failed. Please try again." },
      { status: 502 },
    );
  }
}
