import { showSuccessAlert, showErrorAlert } from "../utils/alerts.js";

document.addEventListener('DOMContentLoaded', async () => {
    const formEditarPaciente = document.getElementById('FormEditarPaciente');
    const pacienteIdInput = document.getElementById('pacienteId');

    const urlParams = new URLSearchParams(window.location.search);
    const pacienteIdFromUrl = urlParams.get('id');

    if (pacienteIdFromUrl) {
        pacienteIdInput.value = pacienteIdFromUrl;
        fetchAndPopulatePatient(pacienteIdFromUrl);
    }

    async function fetchAndPopulatePatient(id) {
        if (!id || isNaN(id)) {
            showErrorAlert('Por favor, insira um ID de paciente válido.');
            formEditarPaciente.reset();
            pacienteIdInput.value = id;
            return;
        }

        try {
            const response = await fetch(`/api/pacientes/${id}`);
            if (!response.ok) {
                formEditarPaciente.reset();
                pacienteIdInput.value = id;
                showErrorAlert('Paciente não encontrado.');
                return;
            }

            const result = await response.json();
            if (result.paciente) {
                const patient = result.paciente;

                document.getElementById('pacienteId').value = patient.pacienteId;
                document.getElementById('name').value = patient.nomeCompleto;
                document.getElementById('dob').value = patient.dataNascimento ? patient.dataNascimento.split('T')[0] : '';
                document.querySelectorAll(`input[name="gender"][value="${patient.genero}"]`)
                    .forEach(radio => radio.checked = true);

                document.getElementById('cpf').value = patient.cpf;
                document.getElementById('email').value = patient.email;
                document.getElementById('phone').value = patient.telefone;

                if (patient.endereco) {
                    const enderecoArray = patient.endereco.split(', ');
                    document.getElementById('rua').value = enderecoArray[0] || '';
                    document.getElementById('numero').value = enderecoArray[1] || '';
                    document.getElementById('bairro').value = enderecoArray[2] || '';
                    document.getElementById('cidade').value = enderecoArray[3] || '';
                    document.getElementById('estado').value = enderecoArray[4] || '';
                }

                document.getElementById('medicalHistory').value = patient.historicoMedico;

            } else {
                showErrorAlert(result.message || 'Paciente não encontrado.');
            }
        } catch (error) {
            console.error(error);
            showErrorAlert('Erro ao carregar dados do paciente.');
        }
    }

    pacienteIdInput.addEventListener('change', () => {
        fetchAndPopulatePatient(pacienteIdInput.value);
    });

    if (formEditarPaciente) {
        formEditarPaciente.addEventListener('submit', async (event) => {
            event.preventDefault();

            const idParaAtualizar = pacienteIdInput.value;

            if (!idParaAtualizar || isNaN(idParaAtualizar)) {
                showErrorAlert('Não é possível salvar: ID do paciente inválido.');
                return;
            }

            const formData = new FormData(formEditarPaciente);
            const data = {
                nomeCompleto: formData.get('name'),
                dataNascimento: formData.get('dob'),
                genero: formData.get('gender'),
                cpf: formData.get('cpf'),
                email: formData.get('email'),
                telefone: formData.get('phone'),
                endereco: {
                    rua: formData.get('rua'),
                    numero: formData.get('numero'),
                    bairro: formData.get('bairro'),
                    cidade: formData.get('cidade'),
                    estado: formData.get('estado')
                },
                historicoMedico: formData.get('medicalHistory')
            };

            try {
                const response = await fetch(`/api/pacientes/${idParaAtualizar}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showSuccessAlert(result.message || 'Paciente atualizado com sucesso!');
                } else {
                    showErrorAlert(result.message || 'Erro ao atualizar paciente.');
                }
            } catch (error) {
                console.error(error);
                showErrorAlert('Erro ao conectar com o servidor. Tente novamente.');
            }
        });
    }
});
