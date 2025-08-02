import { Request, Response, NextFunction } from "express"

type Req = Request 
type Res = Response
type Next = NextFunction

interface User {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
}



export {
    Req, Res, Next, User
}