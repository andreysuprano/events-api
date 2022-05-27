import { getRepository } from 'typeorm';
import Usuario from '../models/Usuario';
import { Request, Response } from 'express';
import Bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import * as AuthConfig from '../config/auth.json';

export const authUser = async (request: Request, response: Response) => {
    const { email, password } = request.body;
    console.log(password)
    const user = await getRepository(Usuario).findOne({ where: { email: email } });
    
    if (!user)
        return response.status(401).send();

    if(user.status === 'inativo')
        return response.status(401).send();
         
    if (!await Bcrypt.compare(password, user.password))
        return response.status(401).send();

    const token = Jwt.sign(
        { 
            id: user.uuid, 
        }, 
        AuthConfig.secret, 
        { expiresIn: 86400 }
    );

    const responseBody = {
        user:{
            id: user.uuid,
            nome: user.nome,
        },
        token: token,
    }

    response.send(responseBody)
}