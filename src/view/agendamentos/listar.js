import { deleteAgendamento } from './deletar.js';

// Funções de formatação
function formatarData(dataString) {
    if (!dataString) return '';
    
    try {
        const data = new Date(dataString);
        if (isNaN(data.getTime())) return dataString;
        
        const dia = String(data.getDate()).padStart(2, '0');
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const ano = String(data.getFullYear()).slice(-2);
        
        return `${dia}/${mes}/${ano}`;
    } catch (error) {
        return dataString;
    }
}

function formatarHora(horaString) {
    if (!horaString) return '';
    
    // Remove segundos se existirem
    return horaString.substring(0, 5);
}

document.addEventListener('DOMContentLoaded', () => {
    const appointmentsTableBody = document.getElementById('appointmentsTableBody');

    async function fetchAndDisplayAppointments() {
        try {
            const response = await fetch('/api/agendamentos');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            if (result.agendamento && result.agendamento.length > 0) {
                appointmentsTableBody.innerHTML = '';
                result.agendamento.forEach(appointment => {
                    const row = appointmentsTableBody.insertRow();

                    // ID
                    let cell = row.insertCell();
                    cell.textContent = appointment.agendamento_id;
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-l', 'border-r', 'border-gray-200');
                    
                    // Nome do Paciente
                    cell = row.insertCell();
                    cell.textContent = appointment.paciente_nome;   
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-r', 'border-gray-200');
                    
                    // Nome do Profissional
                    cell = row.insertCell();
                    cell.textContent = appointment.profissional_nome;
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-r', 'border-gray-200');

                    // Data do Agendamento (Formatada)
                    cell = row.insertCell();
                    cell.textContent = formatarData(appointment.data_agendamento);
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-r', 'border-gray-200');

                    // Hora do Agendamento (Formatada)
                    cell = row.insertCell();
                    cell.textContent = formatarHora(appointment.hora_agendamento);
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-r', 'border-gray-200');

                    // Tipo de Agendamento
                    cell = row.insertCell();
                    cell.textContent = appointment.tipo_agendamento;
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-r', 'border-gray-200');

                    // Observações
                    cell = row.insertCell();
                    cell.textContent = appointment.observacoes || 'Nenhuma';
                    cell.classList.add('px-6', 'py-4', 'text-sm', 'text-gray-700', 'max-w-xs', 'overflow-hidden', 'text-ellipsis', 'border-r', 'border-gray-200');
                    
                    // Ações
                    const actionsCell = row.insertCell();
                    actionsCell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'font-medium', 'border-r', 'border-gray-200');

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Editar';
                    editButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'p-3', 'rounded-md', 'mr-2');
                    editButton.onclick = () => {
                        window.location.href = `editarAgendamentos.html?id=${appointment.agendamento_id}`;
                    };
                    actionsCell.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Excluir';
                    deleteButton.classList.add('bg-red-500', 'hover:bg-red-700', 'text-white', 'p-3', 'rounded-md');
                    deleteButton.onclick = async () => {
                        if (await deleteAgendamento(appointment.agendamento_id)) {
                            fetchAndDisplayAppointments();
                        }
                    };
                    actionsCell.appendChild(deleteButton);
                });
            } else {
                appointmentsTableBody.innerHTML = '<tr><td colspan="9" class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">Nenhum agendamento encontrado.</td></tr>';
            }
        } catch (error) {
            console.error('Erro ao buscar agendamentos:', error);
            appointmentsTableBody.innerHTML = '<tr><td colspan="9" class="px-6 py-4 whitespace-nowrap text-sm text-red-500 text-center">Erro ao carregar agendamentos.</td></tr>';
        }
    }

    fetchAndDisplayAppointments();
});