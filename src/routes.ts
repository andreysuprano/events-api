import { Router , Request, Response, NextFunction} from 'express';
import {addConfiguration, getConfiguration, getProfile, register} from './controllers/UsuarioController';
import { authUser } from './controllers/AuthController';
import { authMiddleware } from './middlewares/auth';
import { novoEvento, pegarEventoParaInscricao, pegarEventoPorId, pegarEventos } from './controllers/EventoController';
import { novaQuestao } from './controllers/QuestaoController';
import { buscaInscricao, buscaInscricoes, criaInscricao } from './controllers/InscricaoController';

const routes = Router();

routes.use((request:Request,response:Response, next:NextFunction) => {    
    response.setHeader('Access-Control-Allow-Origin','*');
    response.setHeader('Access-Control-Allow-Header','*');    
    if(request.method === 'OPTIONS'){
        response.header('Access-Control-Allow-Methods','GET, POST, PUT, DELETE');
        return response.status(200).json({});
    }
    next();
});

routes.get('/', (request:Request,response:Response)=>{
    response.status(200).send({API:'Events API 1.0.40 - Latest'})
});


/**
 * Auth Routes, JWT generate and Validate.
 */
routes.post('/login', authUser);

/**
 * User Routes
 */
routes.post('/user/profile', authMiddleware, getProfile);
routes.post('/user/configuration', authMiddleware, addConfiguration);
routes.get('/user/configuration', authMiddleware, getConfiguration);
routes.post('/user', register);

/**
 * Event Routes
 */
routes.post('/event', authMiddleware, novoEvento);
routes.get('/event/events', authMiddleware, pegarEventos);
routes.get('/event/:event', authMiddleware, pegarEventoPorId);
routes.get('/event/inscricao/:slug', pegarEventoParaInscricao);

/**
 * Quest Routes
 */
routes.post('/quest/:event', authMiddleware, novaQuestao);

/**
 * Inscricao Routes
 */
routes.post('/inscricao/:event', criaInscricao);
routes.get('/inscricao/:event', buscaInscricoes);
routes.get('/inscricao/:inscrito', buscaInscricao);


export default routes;