import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(process.env.supabase_project_url!, process.env.supabase_service_key!);


async function storePdf(filename: string, buffer: Buffer){
    const bucketName: string = "pdf-collection";

    try {
        const {data, error} = await supabaseClient.storage.from(bucketName).upload(filename, buffer, {
            contentType: "application/pdf",
            upsert: false
        })

        if(error) {
            return error;
        }

        const final = await supabaseClient.storage.from(bucketName).createSignedUrl(filename, 60 * 60, {
            download: true
        })

        if(final.error) {
            return final.error;
        }

        return final.data;
    } catch (error) {
        throw error
    }
}

export default storePdf;