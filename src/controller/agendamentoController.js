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

    // Bloquear alteração de paciente e profissional
    if ('pacienteId' in dados || 'profissionalId' in dados) {
        delete dados.pacienteId;
        delete dados.profissionalId;
    }

    // Primeiro, pegar os dados atuais do agendamento (incluindo nomes)
    Agendamento.visualizarPorId(id, (err, results) => {
        if (err) {
            console.error('Erro ao buscar agendamento:', err);
            return res.status(500).json({ message: 'Erro ao buscar agendamento.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Agendamento não encontrado.' });
        }

        const agendamento = results[0];
        const pacienteNome = agendamento.paciente_nome;
        const profissionalNome = agendamento.profissional_nome;

        console.log('Paciente:', pacienteNome, 'Profissional:', profissionalNome);

        // Atualizar somente os campos permitidos
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

            // Retornar nomes junto com a mensagem
            res.json({ 
                message: 'Agendamento atualizado com sucesso!',
                pacienteNome,
                profissionalNome
            });
        });
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
