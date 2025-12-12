import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generatePixelArtImage = async (prompt: string): Promise<string> => {
  try {
    const ai = getClient();
    
    // Using gemini-2.5-flash-image for generation as requested
    const model = "gemini-2.5-flash-image";

    const enhancedPrompt = `
      Create a pixel art design of: ${prompt}.
      Style: Flat 2D pixel art, 8-bit or 16-bit aesthetic. 
      Background: Plain white or transparent.
      Colors: Limited palette suitable for bead art (vibrant, clear colors).
      Composition: Centered, clear edges.
      Perspective: Front view.
      Do not include text or complex shading.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: enhancedPrompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: "1:1"
        }
      }
    });

    // Extract image
    // Note: The response structure for images in generateContent often has the image in inlineData
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};
