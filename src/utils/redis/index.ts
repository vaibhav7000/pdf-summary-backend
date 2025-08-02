import {createClient} from "redis"

const redisClient = createClient({
    username: "default",
    password: "VgM2vPfEFguVHcwdaJCRX37nDbH7AFhd",
    socket: {
        host: 'redis-12685.c240.us-east-1-3.ec2.redns.redis-cloud.com',
        port: 12685
    }
});

interface RedisMailPayload {
    otp: number;
    email: string;
    password: string;
    firstname: string;
    lastname: string;
}

// store otp
async function redisStoreOtp({otp, email, password, firstname, lastname}: RedisMailPayload): Promise<void> {
    try {
        const response = await redisClient.set(email, JSON.stringify({
            email, otp, password, firstname, lastname
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