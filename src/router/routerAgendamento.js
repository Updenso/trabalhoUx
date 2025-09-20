import express from 'express';
import AgendamentoController from '../controller/agendamentoController.js';

const routerAgendamento = express.Router();

routerAgendamento.post('/agendamentos', AgendamentoController.adicionarAgendamento);
routerAgendamento.get('/agendamentos', AgendamentoController.visualizarAgendamentos);
routerAgendamento.get('/agendamentos/:id', AgendamentoController.visualizarPorId);
routerAgendamento.put('/agendamentos/:id', AgendamentoController.editarAgendamento);
routerAgendamento.delete('/agendamentos/:id', AgendamentoController.deletarAgendamento);





export default routerAgendamento;
