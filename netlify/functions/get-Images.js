// netlify/functions/getImages.js
const axios = require("axios");

exports.handler = async () => {
  const cloudName = "dnfdn6eu3";
  const folder = "vault";

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?prefix=${folder}/&max_results=100`;

  try {
    const response = await axios.get(url, {
      auth: {
        username: cloudName,
        password: process.env.CLOUDINARY_API_SECRET, // Set this in Netlify dashboard
      },
    });

    const resources = response.data.resources.map((file) => ({
      url: file.secure_url,
      public_id: file.public_id,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(resources),
    };
  } catch (err) {
    console.error("Error fetching Cloudinary images:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to load images" }),
    };
  }
};
