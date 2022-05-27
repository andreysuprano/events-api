import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Evento from "../models/Evento";
import Inscricao from "../models/Inscricao";
import Resposta from "../models/Resposta";
import { GerarPagamento } from "../services/mercadopago/GeradorDePagamento";

type RespostaMapType = {
    pergunta:string;
    resposta:string;
}

type RespostaViewModel = {
    inscrito:Inscricao,
    respostas:Resposta[],
    preference:string
}

export const criaInscricao = async (request: Request, response: Response) => {
    const {inscrito, respostas} = request.body;
    const eventUuid = request.params.event;

    const evento = await getRepository(Evento).findOne({ where: { uuid : eventUuid } });
    if(!evento)
        return response.status(400).send({message:'Evento não encontrado!'});

    let inscricao = new Inscricao();
    inscricao.evento = evento;
    inscricao.cpf = inscrito.cpf;
    inscricao.nome = inscrito.nome;
    inscricao.email = inscrito.email;
    inscricao.telefone = inscrito.telefone;
    
    try{
        inscricao = await getRepository<Inscricao>(Inscricao).save(inscricao);
        let respostaView:RespostaViewModel = {
            inscrito:inscricao,
            respostas,
            preference:''
        }
        respostas.map(async (item:RespostaMapType)=>{
            const resposta = new Resposta();
            resposta.inscricao = inscricao;
            resposta.pergunta = item.pergunta;
            resposta.resposta = item.resposta;
            respostaView.respostas.push(await getRepository(Resposta).save(resposta));
        });

        respostaView.preference = await GerarPagamento(inscricao, evento);
        response.status(200).send(respostaView);
    }catch{
        response.status(400).send({message:'Erro de persistencia'})
    }

}

export const buscaInscricao = async (request: Request, response: Response) => {
    const inscritoUuid = request.params.inscrito;
    const inscricao = await getRepository(Inscricao)
        .createQueryBuilder("inscricao")
        .innerJoinAndSelect("inscricao.respostas", "resposta")
        .where("inscricao.uuid = :uuid",{uuid:inscritoUuid})
        .getOne();
    
    if(inscricao)
        return response.status(200).send(inscricao);
    response.send({message:'Nenhuma inscrição encontrada!'})
}

export const buscaInscricoes = async (request: Request, response: Response) => {
    const inscricao = await getRepository(Inscricao)
    .createQueryBuilder("inscricao")
    .leftJoinAndSelect("inscricao.respostas", "resposta")
    .leftJoinAndSelect("inscricao.pagamento", "pagamento")
    .getMany();
    
    if(inscricao)
        return response.status(200).send(inscricao);
    response.send({message:'Nenhuma inscrição encontrada!'})
}