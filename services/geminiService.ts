
// Helper function to convert a File object to a base64 string
async function convertFileToBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes a data URL prefix (e.g., "data:image/jpeg;base64,"),
        // so we split it off to get just the base64-encoded data.
        const base64 = reader.result.split(',')[1];
        resolve({ base64, mimeType: file.type });
      } else {
        reject(new Error("Failed to read file as a base64 string."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

const API_ENDPOINT = '/.netlify/functions/gemini';

export const getAdviceForText = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'An unknown error occurred while fetching advice.');
    }
    
    return data.advice;
  } catch (error) {
    console.error("Error getting text advice:", error);
    return `Sorry, I couldn't get advice for that. Please try again. (${error instanceof Error ? error.message : 'Unknown reason'})`;
  }
};

export const getAdviceForImage = async (prompt: string, image: File): Promise<string> => {
  try {
    const { base64, mimeType } = await convertFileToBase64(image);
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        image: base64,
        mimeType,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred while analyzing the image.');
    }

    return data.advice;
  } catch (error) {
    console.error("Error getting image advice:", error);
    return `Sorry, I had trouble analyzing the image. Please try again. (${error instanceof Error ? error.message : 'Unknown reason'})`;
  }
};
