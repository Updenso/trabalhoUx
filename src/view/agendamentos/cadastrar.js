document.addEventListener('DOMContentLoaded', () => {
    const formAgendamento = document.getElementById('formAgendamento');
    const statusMessage = document.getElementById('statusMessage');

    function showMessage(message, type = 'success') {
        statusMessage.textContent = message;
        statusMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700', 'bg-red-100', 'text-red-700');

        if (type === 'success') {
            statusMessage.classList.add('bg-green-100', 'text-green-700');
        } else {
            statusMessage.classList.add('bg-red-100', 'text-red-700');
        }

        statusMessage.classList.remove('hidden');
    }

    if (formAgendamento) {
        const modal = document.getElementById('confirmModal');
        const confirmText = document.getElementById('confirmText');
        const confirmButton = document.getElementById('confirmButton');
        const cancelButton = document.getElementById('cancelButton');

        let agendamentoData = null;

        formAgendamento.addEventListener('submit', (event) => {
            event.preventDefault();

            statusMessage.classList.add('hidden');

            const formData = new FormData(formAgendamento);
            agendamentoData = {
                pacienteId: formData.get('paciente_id'),
                profissionalId: formData.get('profissional_id'),
                dataAgendamento: formData.get('data_agendamento'),
                horaAgendamento: formData.get('hora_agendamento'),
                tipoAgendamento: formData.get('tipo_agendamento'),
                observacoes: formData.get('observacoes')
            };

            const pacienteNome = formAgendamento.querySelector(`#paciente_id option[value="${agendamentoData.pacienteId}"]`)?.textContent || "";
            const profissionalNome = formAgendamento.querySelector(`#profissional_id option[value="${agendamentoData.profissionalId}"]`)?.textContent || "";

            confirmText.textContent =
                `Paciente: ${pacienteNome}\nProfissional: ${profissionalNome}\nData: ${agendamentoData.dataAgendamento} às ${agendamentoData.horaAgendamento}\nTipo: ${agendamentoData.tipoAgendamento}`;

            modal.classList.remove('hidden');
        });

        cancelButton.addEventListener('click', () => {
            modal.classList.add('hidden');
        });

        confirmButton.addEventListener('click', async () => {
            modal.classList.add('hidden');

            try {
                const response = await fetch('/api/agendamentos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(agendamentoData)
                });

                const result = await response.json();

                if (response.ok) {
                    showMessage(result.message || 'Agendamento cadastrado com sucesso!', 'success');
                    formAgendamento.reset();
                } else {
                    showMessage(result.message || 'Erro ao cadastrar agendamento.', 'error');
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                showMessage('Erro ao conectar com o servidor. Tente novamente.', 'error');
            }
        });
    } else {
        console.error('Formulário com ID "formAgendamento" não encontrado.');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const pacienteSelect = document.getElementById('paciente_id');
    const profissionalSelect = document.getElementById('profissional_id');

    async function carregarPacientes() {
        try {
            const response = await fetch('/api/pacientes');
            const data = await response.json();
            const pacientes = data.pacientes || [];

            pacientes.forEach(p => {
                const option = document.createElement('option');
                option.value = p.pacienteId;
                option.textContent = p.nomeCompleto;
                pacienteSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar pacientes:', error);
        }
    }

    async function carregarProfissionais() {
        try {
            const response = await fetch('/api/profissionais');
            const data = await response.json();
            const profissionais = data.profissionais || [];

            profissionais.forEach(p => {
                const option = document.createElement('option');
                option.value = p.profissionalId;
                option.textContent = p.nomeCompleto;
                profissionalSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar profissionais:', error);
        }
    }

    carregarPacientes();
    carregarProfissionais();
});
