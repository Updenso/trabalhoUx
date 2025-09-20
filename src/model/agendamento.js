import db from '../config/DBconfig.js';

class Agendamento {
  static adicionar(dados, callback) {
    const query = `
      INSERT INTO agendamento 
        (paciente_id, profissional_id, data_agendamento, hora_agendamento, tipo_agendamento, observacoes) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      dados.pacienteId,
      dados.profissionalId,
      dados.dataAgendamento,
      dados.horaAgendamento,
      dados.tipoAgendamento,
      dados.observacoes || null
    ];
    db.query(query, values, callback);
  }

  static visualizarPorId(id, callback) {
  const query = `
    SELECT 
      a.agendamento_id,
      a.paciente_id,
      a.profissional_id,
      p.nome_completo AS paciente_nome,
      prof.nome_completo AS profissional_nome,
      a.data_agendamento,
      a.hora_agendamento,
      a.tipo_agendamento,
      a.observacoes
    FROM agendamento a
    LEFT JOIN paciente p ON a.paciente_id = p.paciente_id
    LEFT JOIN profissional prof ON a.profissional_id = prof.profissional_id
    WHERE a.agendamento_id = ?
  `;
  db.query(query, [id], callback);
}


  static editar(id, dados, callback) {
    const fields = [];
    const values = [];

    const mapa = {
      pacienteId: 'paciente_id',
      profissionalId: 'profissional_id',
      dataAgendamento: 'data_agendamento',
      horaAgendamento: 'hora_agendamento',
      tipoAgendamento: 'tipo_agendamento',
      observacoes: 'observacoes'
    };

    for (const [key, column] of Object.entries(mapa)) {
      if (dados[key] !== undefined) {
        fields.push(`${column} = ?`);
        values.push(dados[key]);
      }
    }

    if (fields.length === 0) {
      return callback(new Error('Nenhum campo válido para atualizar.'));
    }

    const query = `UPDATE agendamento SET ${fields.join(', ')} WHERE agendamento_id = ?`;
    values.push(id);

    db.query(query, values, callback);
  }

  static deletar(id, callback) {
    const query = `DELETE FROM agendamento WHERE agendamento_id = ?`;
    db.query(query, [id], callback);
  }

  static visualizarTodos(callback) {
  const query = `
    SELECT 
      a.agendamento_id,
      p.nome_completo AS paciente_nome,
      prof.nome_completo AS profissional_nome,
      a.data_agendamento,
      a.hora_agendamento,
      a.tipo_agendamento,
      a.observacoes
    FROM agendamento a
    LEFT JOIN paciente p ON a.paciente_id = p.paciente_id
    LEFT JOIN profissional prof ON a.profissional_id = prof.profissional_id
    ORDER BY a.data_agendamento, a.hora_agendamento
  `;
  db.query(query, callback);
  }

}



export default Agendamento;
