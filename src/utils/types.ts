import { Request, Response, NextFunction } from "express"

type Req = Request & {
    token?: string;
    decode?: {
        id: number;
        email: string;
    }
}
type Res = Response
type Next = NextFunction

interface User {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
}

interface RedisMailPayload {
    otp: number;
    email: string;
    password?: string;
    firstname?: string;
    lastname?: string;
    id?: number
}


export {
    Req, Res, Next, User, RedisMailPayload
}