document.addEventListener('DOMContentLoaded', async () => {
    const formEditarProfissional = document.getElementById('FormEditarProfissional');
    const statusMessage = document.getElementById('statusMessage');
    const profissionalIdInput = document.getElementById('profissionalId');

    // Referências aos campos de CEP e endereço
    const cepInput = document.getElementById('cep');
    const ruaInput = document.getElementById('rua');
    const numeroInput = document.getElementById('numero');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const cepStatus = document.getElementById('cepStatus');

    // Função para buscar e preencher os dados do endereço pelo CEP
    const buscarEPreencherCep = async (cep) => {
        const cepFormatado = cep.replace(/\D/g, '');
        if (cepFormatado.length !== 8) {
            cepStatus.textContent = 'CEP inválido.';
            cepStatus.className = 'mt-1 text-sm text-red-500';
            return;
        }

        cepStatus.textContent = 'Buscando CEP...';
        cepStatus.className = 'mt-1 text-sm text-blue-500';

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
            const data = await response.json();

            if (data.erro) {
                cepStatus.textContent = 'CEP não encontrado.';
                cepStatus.className = 'mt-1 text-sm text-red-500';
                return;
            }

            ruaInput.value = data.logradouro || '';
            bairroInput.value = data.bairro || '';
            cidadeInput.value = data.localidade || '';
            estadoInput.value = data.uf || '';
            cepStatus.textContent = 'Endereço encontrado!';
            cepStatus.className = 'mt-1 text-sm text-green-500';
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            cepStatus.textContent = 'Erro ao buscar CEP. Tente novamente.';
            cepStatus.className = 'mt-1 text-sm text-red-500';
        }
    };
    
    // Obter o ID do profissional da URL
    const urlParams = new URLSearchParams(window.location.search);
    const profissionalIdFromUrl = urlParams.get('id');

    // Função para buscar e preencher os dados do profissional
    async function fetchAndPopulateProfissional(id) {
        // Se o ID for inválido ou vazio, limpar o formulário e exibir mensagem de erro
        if (!id || isNaN(id)) {
            statusMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
            statusMessage.classList.add('bg-red-100', 'text-red-700');
            statusMessage.textContent = 'Por favor, insira um ID de profissional válido.';
            // Limpar todos os campos do formulário (exceto o ID)
            formEditarProfissional.reset();
            profissionalIdInput.value = id; // Manter o ID digitado no campo
            return;
        }

        try {
            const response = await fetch(`/api/profissionais/${id}`);
            if (!response.ok) {
                // Se a resposta não for OK (ex: 404), limpar o formulário e exibir mensagem de não encontrado
                formEditarProfissional.reset();
                profissionalIdInput.value = id; // Manter o ID digitado no campo
                statusMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
                statusMessage.classList.add('bg-red-100', 'text-red-700');
                statusMessage.textContent = 'Profissional não encontrado.';
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();

            if (result.profissional) {
                const profissional = result.profissional;

                // Preencher o campo ID
                document.getElementById('profissionalId').value = profissional.profissionalId;
                document.getElementById('name').value = profissional.nomeCompleto;
                document.getElementById('email').value = profissional.email;
                document.getElementById('crm').value = profissional.crm;
                document.getElementById('dob').value = profissional.dataNascimento;
                document.getElementById('joiningDate').value = profissional.dataAdmissao;
                document.getElementById('phone').value = profissional.telefone;
                // Selecionar o gênero
                document.querySelectorAll(`input[name="gender"][value="${profissional.genero}"]`).forEach(radio => radio.checked = true);
                document.getElementById('specialty').value = profissional.especialidade;

                // Preencher campos de endereço
                if (profissional.endereco) {
                    // Verifica se o endereço é um objeto ou uma string
                    if (typeof profissional.endereco === 'object') {
                        cepInput.value = profissional.endereco.cep || '';
                        ruaInput.value = profissional.endereco.rua || '';
                        numeroInput.value = profissional.endereco.numero || '';
                        bairroInput.value = profissional.endereco.bairro || '';
                        cidadeInput.value = profissional.endereco.cidade || '';
                        estadoInput.value = profissional.endereco.estado || '';
                    }  else if (typeof profissional.endereco === 'string') {
                            // A sua string de endereço não contém o CEP no início.
                            // Ela parece estar no formato: "Rua, Número, Bairro, Cidade, Estado"
                            const partes = profissional.endereco.split(', ');

                            // Atribui os valores corretos aos campos.
                            document.getElementById('rua').value = partes[0] || '';
                            document.getElementById('numero').value = partes[1] || '';
                            document.getElementById('bairro').value = partes[2] || '';
                            document.getElementById('cidade').value = partes[3] || '';
                            document.getElementById('estado').value = partes[4] || '';

                            // O campo CEP deve ficar vazio, pois ele não está presente na string da API.
                            
                        }
                        document.getElementById('cep').value = '';
                }

                document.getElementById('biography').value = profissional.biografia;
                statusMessage.classList.add('hidden');
            } else {
                statusMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
                statusMessage.classList.add('bg-red-100', 'text-red-700');
                statusMessage.textContent = result.message || 'Profissional não encontrado.';
            }
        } catch (error) {
            console.error('Erro ao buscar dados do profissional:', error);
            statusMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
            statusMessage.classList.add('bg-red-100', 'text-red-700');
            statusMessage.textContent = 'Erro ao carregar dados do profissional.';
        }
    }

    // Se houver um ID na URL, preencher o campo e carregar os dados
    if (profissionalIdFromUrl) {
        profissionalIdInput.value = profissionalIdFromUrl;
        await fetchAndPopulateProfissional(profissionalIdFromUrl);
    } else {
        // Caso não haja ID na URL, limpar o campo e a mensagem de status para que o usuário possa digitar
        profissionalIdInput.value = '';
        statusMessage.textContent = '';
        statusMessage.classList.add('hidden');
    }

    // Adicionar um event listener para o campo ID, para buscar dados ao digitar/colar um ID
    profissionalIdInput.addEventListener('change', () => {
        const newProfissionalId = profissionalIdInput.value;
        fetchAndPopulateProfissional(newProfissionalId);
    });
    
    // Adicionar um event listener para o campo CEP
    cepInput.addEventListener('blur', (e) => {
        const cep = e.target.value;
        if (cep) {
            buscarEPreencherCep(cep);
        }
    });

    // Lidar com o envio do formulário de edição
    if (formEditarProfissional) {
        formEditarProfissional.addEventListener('submit', async (event) => {
            event.preventDefault();

            statusMessage.textContent = '';
            statusMessage.classList.add('hidden');

            // Certificar-se de que o ID do profissional é obtido do campo de input, não da URL
            const idParaAtualizar = profissionalIdInput.value; 

            if (!idParaAtualizar || isNaN(idParaAtualizar)) {
                statusMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
                statusMessage.classList.add('bg-red-100', 'text-red-700');
                statusMessage.textContent = 'Não é possível salvar: ID do profissional inválido.';
                return;
            }

            const formData = new FormData(formEditarProfissional);
            const data = {
                nomeCompleto: formData.get('name'),
                email: formData.get('email'),
                crm: formData.get('crm'),
                dataNascimento: formData.get('dob'),
                dataAdmissao: formData.get('joiningDate'),
                telefone: formData.get('phone'),
                genero: formData.get('gender'),
                especialidade: formData.get('specialty'),
                endereco: {
                    cep: formData.get('cep'),
                    rua: formData.get('rua'),
                    numero: formData.get('numero'),
                    bairro: formData.get('bairro'),
                    cidade: formData.get('cidade'),
                    estado: formData.get('estado')
                },
                biografia: formData.get('biography')
            };

            try {
                const response = await fetch(`/api/profissionais/${idParaAtualizar}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    statusMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700');
                    statusMessage.classList.add('bg-green-100', 'text-green-700');
                    statusMessage.textContent = result.message || 'Profissional atualizado com sucesso!';
                } else {
                    statusMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
                    statusMessage.classList.add('bg-red-100', 'text-red-700');
                    statusMessage.textContent = result.message || 'Erro ao atualizar profissional.';
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                statusMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
                statusMessage.classList.add('bg-red-100', 'text-red-700');
                statusMessage.textContent = 'Erro ao conectar com o servidor. Tente novamente.';
            }
        });
    } else {
        console.error('Formulário com ID "FormEditarProfissional" não encontrado.');
    }
});