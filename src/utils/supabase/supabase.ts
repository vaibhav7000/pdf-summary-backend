import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(process.env.supabase_project_url!, process.env.supabase_service_key!);
const bucketName: string = "pdf-collection";

async function storePdf(filename: string, buffer: Buffer){

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

async function getSignedURL(filename: string) {
    try {
        const final = await supabaseClient.storage.from(bucketName).createSignedUrl(filename, 60 * 60, {
            download: true // so that it can be get from the fetch request
        })

        if(final["error"]) {
            return final["error"]
        }

        return final["data"];
    } catch (error) {
        throw error
    }
}

export default storePdf;

export {
    getSignedURL
}