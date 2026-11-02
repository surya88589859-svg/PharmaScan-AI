// src/services/ocrService.js

export const extractTextFromImage = async (imageFile) => {
  try {
    const text = await puter.ai.img2txt(imageFile, {
      provider: 'mistral' 
    });

    // AGAR TEXT NAHI MILA YA KHALI HAI
    if (!text || text.trim().length < 5) {
      throw new Error("Is image mein koi valid text nahi mila. Kripya sahi prescription upload karein.");
    }

    return text;
  } catch (error) {
    console.error("Puter OCR Error:", error);
    // Error ko aage bhej dein taaki App.jsx use pakad sake
    throw error; 
  }
};