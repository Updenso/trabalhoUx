document.addEventListener('DOMContentLoaded', async () => {
    const pacienteIdInput = document.getElementById('paciente_id');
    const pacienteNomeInput = document.getElementById('paciente_nome');
    const profissionalIdInput = document.getElementById('profissional_id');
    const profissionalNomeInput = document.getElementById('profissional_nome');

    const formAgendamento = document.getElementById('formAgendamento');
    const statusMessage = document.getElementById('statusMessage');
    const mainTitle = document.getElementById('mainTitle');

    // Captura o ID do agendamento da URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    let agendamentoOriginal = null;

    function mostrarMensagem(mensagem, tipo = 'erro') {
        statusMessage.textContent = mensagem;
        statusMessage.className = `mt-4 p-3 rounded-md text-sm font-medium text-center ${
            tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`;
        statusMessage.classList.remove('hidden');

        if (tipo === 'sucesso') {
            setTimeout(() => {
                window.location.href = '../agendamentos/visualizarAgendamentos.html';
            }, 2000);
        }
    }

    async function carregarAgendamento() {
    if (!id) {
        mainTitle.textContent = 'Novo Agendamento';
        return;
    }

    try {
        const response = await fetch(`/api/agendamentos/${id}`);
        if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
        const data = await response.json();
        if (!data.agendamento) throw new Error('Agendamento não encontrado');

        agendamentoOriginal = data.agendamento;

                // Preencher paciente
        if (agendamentoOriginal.paciente_id) {
            pacienteIdInput.value = agendamentoOriginal.paciente_id;
            pacienteNomeInput.value = agendamentoOriginal.paciente_nome || 'Paciente não encontrado';
        }

        // Preencher profissional
        if (agendamentoOriginal.profissional_id) {
            profissionalIdInput.value = agendamentoOriginal.profissional_id;
            profissionalNomeInput.value = agendamentoOriginal.profissional_nome || 'Profissional não encontrado';
        }


        // Campos editáveis
        if (agendamentoOriginal.data_agendamento) {
            const dataObj = new Date(agendamentoOriginal.data_agendamento);
            document.getElementById('data_agendamento').value = dataObj.toISOString().split('T')[0];
        }
        if (agendamentoOriginal.hora_agendamento) {
            document.getElementById('hora_agendamento').value = agendamentoOriginal.hora_agendamento.substring(0, 5);
        }
        if (agendamentoOriginal.tipo_agendamento) {
            document.getElementById('tipo_agendamento').value = agendamentoOriginal.tipo_agendamento;
        }
        if (agendamentoOriginal.observacoes) {
            document.getElementById('observacoes').value = agendamentoOriginal.observacoes;
        }

    } catch (error) {
        console.error('Erro ao carregar agendamento:', error);
        mostrarMensagem('Erro ao carregar dados do agendamento');
    }
}


    formAgendamento.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(formAgendamento);

        const updatedData = {
            pacienteId: parseInt(formData.get('paciente_id')),
            profissionalId: parseInt(formData.get('profissional_id')),
            dataAgendamento: formData.get('data_agendamento'),
            horaAgendamento: formData.get('hora_agendamento') + ':00',
            tipoAgendamento: formData.get('tipo_agendamento'),
            observacoes: formData.get('observacoes')
        };

        try {
            const response = await fetch(`/api/agendamentos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();
            if (response.ok) {
                mostrarMensagem(result.message || 'Agendamento atualizado com sucesso!', 'sucesso');
            } else {
                mostrarMensagem(result.message || result.error || 'Erro ao atualizar agendamento.');
            }

        } catch (error) {
            console.error('Erro na requisição:', error);
            mostrarMensagem('Erro ao conectar com o servidor.');
        }
    });

    await carregarAgendamento();
});
