import {createClient} from "redis";
import { RedisMailPayload } from "../types";

const redisClient = createClient({
    username: "default",
    password: process.env.redisPassword || "",
    socket: {
        host: process.env.redisHost,
        port: 12685
    }
});


// store otp
async function redisStoreOtp({otp, email, password, firstname, lastname, id}: RedisMailPayload): Promise<void> {
    const payload: RedisMailPayload = {
        otp, email
    }

    if(id) {
        payload["id"] = id
    }

    if(firstname) {
        payload["firstname"] = firstname;
    }

    if(lastname) {
        payload["lastname"] = lastname;
    }

    if(password) {
        payload["password"] = password;
    }
    try {
        const response = await redisClient.set(email, JSON.stringify({
            ...payload
        }))

        console.log("otp stored in redis successfully");
    } catch (error) {
        console.log("error occured when storing otp in redis");
        throw error
    }
}

// read otp
async function redisGetOtp<T>(key:  string): Promise<string | null> {
    try {
        let response = await redisClient.get(key);

        return response;
    } catch (error) {
        throw error;
    }
}

// delete otp
async function redisDeleteOtp(key: string): Promise<void> {
    try {
        const response = await redisClient.del(key);
        console.log(response);

        console.log("otp is deleted from the server")
    } catch (error) {
        throw error;
    }
}

export default redisClient;

export {
    redisStoreOtp, redisGetOtp, redisDeleteOtp
}