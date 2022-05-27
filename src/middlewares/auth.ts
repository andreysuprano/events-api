import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';
import authConfig from '../config/auth.json';

export const authMiddleware = (request:Request, response:Response, next:NextFunction ) => {
    const authHeader = request.headers.authorization;
    if(!authHeader)
    return response.status(401).send({error:"No Token Provided"});
    
    const parts = authHeader.split(' ');
    
    if(parts.length !== 2)
        return response.status(401).send({error:"Malformatted Token"});

    const [scheme, token] = parts;

    if(scheme !== 'Bearer')
        return response.status(401).send({error:"Malformatted Token"});

    Jwt.verify(token, authConfig.secret, (err, decoded)=>{
        if(err) return response.status(401).send({error:"Invalid Token"});
        request.params.uuid = decoded?.id;
        next();
    })
}