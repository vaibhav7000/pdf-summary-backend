import * as z from "zod";

const UserSchema = z.object({
    email: z.email({
        error: "Not a valid email",
    }),
    firstname: z.string().min(3, {
        error: "firstname must be atleat 3 characters long"
    }).max(30, {
        error: "firstname can be of atmost 30 characters"
    }),
    lastname: z.string().min(3, {
        error: "lastname must be atleat 3 characters long"
    }).max(30, {
        error: "lastname can be atmost 30 characters"
    }),
    password: z.string().min(8, {
        error: "Password must be atleat 8 characters long"
    })
})

const emailOTPSchema = z.object({
    email: z.email({
        error: "Send valid Email"
    }),
    otp: z.number().min(1000).max(9999)
})

const loginPasswordSchema = z.object({
    email: z.email({
        error: "Send a valid email",
    }),
    password: z.string().min(8, {
        error: "Wrong Password, Atleat 8 characters required"
    })
})

const loginOTPSchema = z.object({
    email: z.email({
        error: "Send valid Email"
    })
})

const tokenSchema = z.object({
    token: z.string().startsWith("Bearer ", {
        error: "Invalid token"
    })
})

const jwtPayload = z.object({
    id: z.number(),
    email: z.email(),
})

const pdfSchema = z.object({
    originalname: z.string().endsWith(".pdf", {
        error: "Insert a file that end with .pdf extension"
    }),
    mimetype: z.literal("application/pdf", {
        error: "Only PDF's are allowed"
    })
})

export {
    UserSchema, emailOTPSchema, loginOTPSchema, loginPasswordSchema, tokenSchema, jwtPayload, pdfSchema
}

//https://one.google.com/ai-student?utm_source=gemini&utm_medium=web&utm_campaign=gemini_students_editors_promo&g1_landing_page=75