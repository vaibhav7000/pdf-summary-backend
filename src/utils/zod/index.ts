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


export {
    UserSchema, emailOTPSchema
}