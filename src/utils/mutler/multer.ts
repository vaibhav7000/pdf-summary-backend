import multer, { FileFilterCallback } from "multer";
import { Req } from "../types";
import { pdfSchema } from "../zod";

const storage = multer.memoryStorage(); // stores the pdf in the RAM not on the disk, we are storing it on disk because soon after storing it on the Supabase it will be deleted from the RAM

const filterPdf = (req: Req, file: Express.Multer.File, cb: FileFilterCallback) => {
    // multer represents all the file sent through file
    const result = pdfSchema.safeParse({
        originalname: file?.originalname,
        mimetype: file?.mimetype
    })

    if(!result.success) {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
        return
    }

    cb(null, true);
}


const upload = multer({
    fileFilter: filterPdf, // multer will intercept the file using upload and then call the fileFilter, if all good will be called storage and pdf will be save temporaray
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
    }
})

export default upload;