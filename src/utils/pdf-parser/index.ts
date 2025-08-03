import pdf from "pdf-parse";

async function getTextFromBuffer(buffer: Buffer): Promise<string> {
    try {
        const output = await pdf(buffer);
        return output.text;
    } catch (error) {
        throw error;
    }
}

export default getTextFromBuffer;