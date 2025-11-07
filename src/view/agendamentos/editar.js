import { showSuccessAlert, showErrorAlert } from "../utils/alerts.js";

document.addEventListener('DOMContentLoaded', async () => {
    const pacienteIdInput = document.getElementById('paciente_id');
    const pacienteNomeInput = document.getElementById('paciente_nome');
    const profissionalIdInput = document.getElementById('profissional_id');
    const profissionalNomeInput = document.getElementById('profissional_nome');

    const formAgendamento = document.getElementById('formAgendamento');
    const mainTitle = document.getElementById('mainTitle');

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    let agendamentoOriginal = null;

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

            pacienteIdInput.value = agendamentoOriginal.paciente_id;
            pacienteNomeInput.value = agendamentoOriginal.paciente_nome || 'Paciente não encontrado';

            profissionalIdInput.value = agendamentoOriginal.profissional_id;
            profissionalNomeInput.value = agendamentoOriginal.profissional_nome || 'Profissional não encontrado';

            if (agendamentoOriginal.data_agendamento) {
                const dataObj = new Date(agendamentoOriginal.data_agendamento);
                document.getElementById('data_agendamento').value =
                    dataObj.toISOString().split('T')[0];
            }

            if (agendamentoOriginal.hora_agendamento) {
                document.getElementById('hora_agendamento').value =
                    agendamentoOriginal.hora_agendamento.substring(0, 5);
            }

            document.getElementById('tipo_agendamento').value =
                agendamentoOriginal.tipo_agendamento || "Consulta";

            document.getElementById('observacoes').value =
                agendamentoOriginal.observacoes || "";

        } catch (error) {
            console.error('Erro ao carregar agendamento:', error);
            showErrorAlert('Erro ao carregar dados do agendamento.');
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
                showSuccessAlert(result.message || 'Agendamento atualizado com sucesso!');

                setTimeout(() => {
                    window.location.href = '../agendamentos/visualizarAgendamentos.html';
                }, 2000);
            } else {
                showErrorAlert(result.message || result.error || 'Erro ao atualizar agendamento.');
            }

        } catch (error) {
            console.error('Erro na requisição:', error);
            showErrorAlert('Erro ao conectar com o servidor.');
        }
    });

    await carregarAgendamento();
});
