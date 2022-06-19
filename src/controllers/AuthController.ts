import { getRepository } from 'typeorm';
import Usuario from '../models/Usuario';
import { Request, Response } from 'express';
import Bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import * as AuthConfig from '../config/auth.json';

export const authUser = async (request: Request, response: Response) => {
    const { email, password } = request.body;
    const user = await getRepository(Usuario)
        .createQueryBuilder("usuario")
        .leftJoinAndSelect("usuario.configuracao", "configuracao")
        .addSelect("usuario.password")
        .where("usuario.email = :email", {email:email})
        .getOne();
    if (!user)
        return response.status(401).send();

    if(user.status === 'inativo')
        return response.status(401).send();
         
    if (!await Bcrypt.compare(password, user.password))
        return response.status(401).send();
        
    const token = Jwt.sign(
        { 
            id: user.uuid, 
            public: user?.configuracao?.public_key
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