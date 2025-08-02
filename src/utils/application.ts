import jwt from "jsonwebtoken";


function generateOTP(): number {
    return Math.floor(1000 + Math.random() * 9000);
}
interface TokenPayload {
    id: number;
    email: string;
}

function generateToken(payload: TokenPayload): string {
    try {

        if(!process.env.jwtPassword) {
            throw new Error("Issue with the Jwt password");
        }

        const token: string = jwt.sign({
            ...payload
        }, process.env.jwtPassword);

        return token;
    } catch (error) {
        throw error
    }    
}

export {
    generateOTP, generateToken
}