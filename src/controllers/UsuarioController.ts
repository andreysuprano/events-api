import { getRepository } from 'typeorm';
import Usuario from '../models/Usuario';
import { Request, Response } from 'express';
import Bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import * as AuthConfig from '../config/auth.json';
import { emailSender } from '../utils/EmailSender';
import Configuracao from '../models/Configuracao';

export const register = async (request: Request, response: Response) => {
    const { username, email, password, nome } = request.body;
    if (username === '' || username === ' '
        || email === '' || email === ' '
        || password === '' || password === ' '
        || nome === '' || nome === ' '
    )
        return response.status(400).send({ message: "Todos os Campos são Obrigatórios!" });

    const exists = await getRepository(Usuario).findOne({ where: { email: email } });
    if (exists)
        return response.status(400).send({ message: "Email já cadastrado!" });

    const user = new Usuario();
    user.nome = nome;
    user.username = username;
    user.email = email;
    user.status = 'ativo';
    user.password = await cryptogaphPassword(password)

    const registered = await getRepository(Usuario).save(user);

    const token = Jwt.sign({ id: user.uuid }, AuthConfig.secret, { expiresIn: 86400 });
    
    emailSender.sendMail(registered.email, 'Seus dados de Acesso ao ADCL Events', 
    `Seus dados de acesso ao sistema Events são \n
        \nNome Referência: ${registered.username}
        \nemail: ${registered.email}
        \nsenha: ${password}
        \n Use o email e a senha para logar no link: https://eventos.adcampolargo.com/login
    `)

    registered.password = "nullable";

    if (registered)
        return response.status(200).send({registered, token});
}

const cryptogaphPassword = async (password:string) => {
    const salt = await Bcrypt.genSalt(10);
    return await Bcrypt.hash(password, salt);
}

export const getProfile = async (request:Request, response:Response) =>{
    const user = await getRepository(Usuario).findOne({where:{uuid:request.params.uuid}})
    const userDTO = {
        nome:user?.nome,
        email:user?.email,
        username:user?.username,
        status:user?.status
    }
    return response.status(200).json(userDTO);
}

export const addConfiguration = async (request:Request, response:Response) =>{
    const { access_token, public_key } = request.body;
    if(access_token && public_key){
        const config = await getRepository<Configuracao>(Configuracao).save(request.body)
        await getRepository(Usuario)
            .createQueryBuilder()
            .update()
            .set({ configuracao:config })
            .where({uuid:request.params.uuid})
            .execute()
        response.status(200).json(config);
    }
    return response.status(400).json({message:"Os Parâmetros são obrigatórios"});
}

export const getConfiguration = async (request:Request, response:Response) =>{
   const user = await getRepository(Usuario)
        .createQueryBuilder("usuario")
        .leftJoinAndSelect("usuario.configuracao", "configuracao")
        .where("usuario.uuid = :uuid", {uuid:request.params.uuid})
        .getOne();
    return response.status(200).json(user);
}
