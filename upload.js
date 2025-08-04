const cloudName = "dnfdn6eu3";
const uploadPreset = "arjun6969"; // Replace with yours

document.getElementById("uploadForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById("fileInput");
  const description = document.getElementById("description").value;
  const file = fileInput.files[0];

  if (!file) return alert("Please select a file.");
  if (!file.type.startsWith("image/")) return alert("Only image files allowed.");
  if (file.size > 5 * 1024 * 1024) return alert("Image must be less than 5MB.");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", "vault");
  formData.append("context", `alt=${description || file.name}`);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.secure_url) {
      alert("✅ Upload successful!");
    } else {
      throw new Error(data.error.message || "Upload failed");
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("❌ Upload failed: " + err.message);
  }
});
