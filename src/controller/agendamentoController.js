import Agendamento from '../model/agendamento.js';


class AgendamentoController {
  static adicionarAgendamento(req, res) {
    const { pacienteId, profissionalId, dataAgendamento, horaAgendamento, tipoAgendamento, observacoes, status } = req.body;

    if (!pacienteId || !profissionalId || !dataAgendamento || !horaAgendamento || !tipoAgendamento) {
      return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
    }

    Agendamento.adicionar({ pacienteId, profissionalId, dataAgendamento, horaAgendamento, tipoAgendamento, observacoes, status }, (err, result) => {
      if (err) {
        console.error('Erro ao cadastrar agendamento:', err);
        return res.status(500).json({ message: 'Erro ao cadastrar agendamento.' });
      }
      res.status(201).json({ message: 'Agendamento cadastrado com sucesso!', agendamentoId: result.insertId });
    });
  }

  static visualizarAgendamentos(req, res) {
    Agendamento.visualizarTodos((err, results) => {
      if (err) {
        console.error('Erro ao buscar agendamentos:', err);
        return res.status(500).json({ message: 'Erro ao buscar agendamentos.' });
      }
      res.json({ agendamentos: results });
    });
  }

static visualizarAgendamentoPorId(req, res) {
    const { id } = req.params;
    Agendamento.visualizarPorId(id, (err, results) => {
      if (err) {
        console.error('Erro ao buscar agendamento:', err);
        return res.status(500).json({ message: 'Erro ao buscar agendamento.' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'Agendamento não encontrado.' });
      }
      res.json({ agendamento: results[0] });
    });
  }

  static editarAgendamento(req, res) {
    const { id } = req.params;
    const dados = req.body;

    console.log('Dados recebidos para edição:', dados);
    console.log('ID do agendamento:', id);

    // Validação adicional
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: 'ID inválido.' });
    }

    Agendamento.editar(id, dados, (err, result) => {
        if (err) {
            console.error('Erro detalhado ao atualizar agendamento:', err);
            return res.status(500).json({ 
                message: 'Erro ao atualizar agendamento.',
                error: err.message 
            });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Agendamento não encontrado.' });
        }
        res.json({ message: 'Agendamento atualizado com sucesso!' });
    });
  }

  static deletarAgendamento(req, res) {
    const { id } = req.params;
    Agendamento.deletar(id, (err, result) => {
      if (err) {
        console.error('Erro ao deletar agendamento:', err);
        return res.status(500).json({ message: 'Erro ao deletar agendamento.' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Agendamento não encontrado.' });
      }
      res.json({ message: 'Agendamento deletado com sucesso!' });
    });
  }
}

export default AgendamentoController;
