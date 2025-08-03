import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(process.env.supabase_project_url!, process.env.supabase_service_key!);


async function storePdf(filename: string, buffer: Buffer): Promise<void> {
    const bucketName: string = "pdf-collection";

    try {
        const response = await supabaseClient.storage.from(bucketName).upload(filename, buffer, {
            contentType: "application/pdf",
            upsert: false
        })

        if(response["error"]) {
            throw new Error(response["error"].message);
        }

        console.log(response["data"]);
    } catch (error) {
        throw error
    }
}

export default storePdf;