import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!
})

async function aiSummarizer(text: string, buffer: Buffer): Promise<string | undefined> {
    try {
        const contents = [
            { text },
            {
                inlineData: {
                    mimeType: "application/pdf",
                    data: buffer.toString("base64")
                }
            }
        ]

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents
        })

        return response.text;
    } catch (error) {
        throw error;
    }
}

export default aiSummarizer