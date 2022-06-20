import { Request, Response } from "express";
import { getRepository } from "typeorm";
import Inscricao from "../models/Inscricao";
import Pagamento from "../models/Pagamento";

export type PagamentoPayload = {
    uuid: string;
    payment_id:string;    
    id_inscricao:string;
    status:string;    
    payment_type:string;    
    ordem_compra:string;    
    valor:string;
    descricao:string;
}

export const insereDadosPagamento = async (request: Request, response: Response) => {
    const pagamento:PagamentoPayload = request.body;
    const inscricaoId = request.body.id_inscricao;

    const result = await getRepository(Pagamento).save(pagamento);
    
    const inscricao = await getRepository(Inscricao).createQueryBuilder()
        .update()
        .set({pagamento:result})
        .where({uuid:inscricaoId})
        .execute()
    
    console.log(result)
    console.log(inscricao)

    if(inscricao)
        return response.sendStatus(200);
    response.send({message:'Nenhuma inscrição encontrada!'})
}