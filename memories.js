const cloudName = "dnfdn6eu3";
const folder = "vault";

const gallery = document.getElementById("gallery");

async function fetchImages() {
  try {
    const res = await fetch(`https://res.cloudinary.com/${cloudName}/image/list/${folder}.json`);
    if (!res.ok) throw new Error("Image list fetch failed");

    const data = await res.json();

    if (!data.resources || data.resources.length === 0) {
      gallery.innerHTML = `<p class="text-center text-muted">No media uploaded yet.</p>`;
      return;
    }

    data.resources.forEach((img) => {
      const col = document.createElement("div");
      col.className = "col-md-4 col-6";

      const image = document.createElement("img");
      image.src = `https://res.cloudinary.com/${cloudName}/image/upload/${img.public_id}.${img.format}`;
      image.alt = img.public_id;
      image.className = "img-fluid rounded shadow-sm";

      col.appendChild(image);
      gallery.appendChild(col);
    });
  } catch (err) {
    console.error(err);
    gallery.innerHTML = `<p class="text-danger text-center">⚠️ Failed to load media.</p>`;
  }
}

fetchImages();
