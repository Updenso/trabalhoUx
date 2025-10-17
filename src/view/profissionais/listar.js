import { deleteProfissional } from './deletar.js';

document.addEventListener('DOMContentLoaded', () => {
    const profissionalsTableBody = document.getElementById('profissionalsTableBody');

    async function fetchAndDisplayProfissionals() {
        try {
            const response = await fetch('/api/profissionais');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            if (result.profissionais && result.profissionais.length > 0) {
                profissionalsTableBody.innerHTML = ''; 
                result.profissionais.forEach(profissional => {
                    const row = profissionalsTableBody.insertRow();

                    let cell = row.insertCell();
                    cell.textContent = profissional.profissionalId;
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-l', 'border-r', 'border-gray-200');
                    
                    cell = row.insertCell();
                    cell.textContent = profissional.nomeCompleto;
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-r', 'border-gray-200');
                    
                    cell = row.insertCell();
                    cell.textContent = profissional.email;
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-r', 'border-gray-200');

                    cell = row.insertCell();
                    cell.textContent = profissional.crm;
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-r', 'border-gray-200');

                    cell = row.insertCell();
                    cell.textContent = profissional.dataNascimento;
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-r', 'border-gray-200');

                    cell = row.insertCell();
                    cell.textContent = profissional.dataAdmissao;
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-r', 'border-gray-200');

                    cell = row.insertCell();
                    cell.textContent = profissional.telefone;
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-r', 'border-gray-200');

                    cell = row.insertCell();
                    cell.textContent = profissional.genero;
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-r', 'border-gray-200');

                    cell = row.insertCell();
                    cell.textContent = profissional.especialidade;
                    cell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-700', 'border-r', 'border-gray-200');

                    cell = row.insertCell();
                    cell.textContent = profissional.endereco; 
                    cell.classList.add('px-6', 'py-4', 'text-sm', 'text-gray-700', 'border-r', 'border-gray-200');

                    cell = row.insertCell();
                    cell.textContent = profissional.biografia;
                    cell.classList.add('px-6', 'py-4', 'text-sm', 'text-gray-700', 'max-w-xs', 'overflow-hidden', 'text-ellipsis', 'border-r', 'border-gray-200');

                    const actionsCell = row.insertCell();
                    actionsCell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'font-medium', 'border-r', 'border-gray-200');

                    const editButton = document.createElement('button');
                    editButton.textContent = 'Editar';
                    editButton.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'p-3', 'rounded-md', 'mr-2');
                    editButton.onclick = () => {
                        window.location.href = `editarProfissional.html?id=${profissional.profissionalId}`;
                    };
                    actionsCell.appendChild(editButton);

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Excluir';
                    deleteButton.classList.add('bg-red-500', 'hover:bg-red-700', 'text-white', 'p-3', 'rounded-md');
                    deleteButton.onclick = async () => {
                        if (await deleteProfissional(profissional.profissionalId)) {
                            fetchAndDisplayProfissionals(); // Recarrega a lista após a exclusão
                        }
                    };
                    actionsCell.appendChild(deleteButton);
                });
            } else {
                profissionalsTableBody.innerHTML = '<tr><td colspan="10" class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center">Nenhum profissional encontrado.</td></tr>';
            }
        } catch (error) {
            console.error('Erro ao buscar profissionais:', error);
            profissionalsTableBody.innerHTML = '<tr><td colspan="10" class="px-6 py-4 whitespace-nowrap text-sm text-red-500 text-center">Erro ao carregar profissionais.</td></tr>';
        }
    }

    fetchAndDisplayProfissionals();
}); 