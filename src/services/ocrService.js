// src/services/ocrService.js

export const extractTextFromImage = async (imageFile) => {
  try {
    // Image ko base64 mein convert karein (Puter.js file object bhi accept karta hai)
    const base64Image = await convertToBase64(imageFile);

    // Puter.js ke through Mistral OCR call karein
    const text = await window.puter.ai.img2txt({
      source: base64Image,
      provider: 'mistral'
    });

    return text || "";
  } catch (error) {
    console.error("Puter OCR Error:", error);
    throw new Error("Image padhne mein problem aayi. Dobara try karein.");
  }
};

const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};