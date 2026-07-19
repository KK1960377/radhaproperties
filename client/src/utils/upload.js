import api from "../api/axios";

// Uploads one or more files directly from the browser to Cloudinary using a
// short-lived signature issued by our backend. Returns an array of secure_url
// strings in the same order as the input files.
export async function uploadFiles(files) {
  const { data: sig } = await api.get("/upload/signature");

  const uploads = files.map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", sig.apiKey);
    formData.append("timestamp", sig.timestamp);
    formData.append("signature", sig.signature);
    formData.append("folder", sig.folder);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result?.error?.message || "Upload failed");
    return result.secure_url;
  });

  return Promise.all(uploads);
}

// Convenience helper for the common single-file case (owner photo, logo, etc.)
export async function uploadFile(file) {
  const [url] = await uploadFiles([file]);
  return url;
}
