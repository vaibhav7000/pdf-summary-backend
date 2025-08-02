import nodemailer from "nodemailer";

const nodemailerClient = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.mail,
        pass: process.env.mailPass,
    }
})

interface EmailPayload {
    otp: number,
    mail: string,
}

async function sendMail({otp, mail}: EmailPayload):Promise<void> {
    try {
        const info = await nodemailerClient.sendMail({
            from: `"PDF Summarizer Team" <vaibhavchawla471@gmail.com>`,
            to: mail,
            subject: "Welcome to PDF Summarizer",
            html: otpEmailTemplate(otp)
        })

        console.log("otp is sent successfully");
    } catch(error) {
        console.log("error in sending otp to user");
        throw error;
    }
}

const otpEmailTemplate = (otp: number) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #333;">Your OTP Code</h2>
    <br/>
    <p style="font-size: 16px; color: #555;">
      Use the following OTP to verify your email address. This code will expire in 5 minutes.
    </p>
    <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #1a73e8; margin: 20px 0;">
      ${otp}
    </p>
    <p style="font-size: 14px; color: #999;">
      Please do not share this code with anyone.
    </p>
    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
    <p style="font-size: 14px; color: #777;">
      Thanks for choosing <strong>Pdf-Summarizer</strong>.<br/><br/>Team Pdf-Summarizer
    </p>
  </div>
`;


export default sendMail