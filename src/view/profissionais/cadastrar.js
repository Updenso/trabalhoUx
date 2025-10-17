document.addEventListener('DOMContentLoaded', () => {
    // ===== Elementos do formulário =====
    const formProfissional = document.getElementById('FormProfissional');
    const statusMessage = document.getElementById('statusMessage');
    const cepInput = document.getElementById('cep');
    const ruaInput = document.getElementById('rua');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const cepStatus = document.getElementById('cepStatus');

    // ===== Etapas do formulário =====
    const tabs = document.querySelectorAll('.tab');
    const etapas = document.querySelectorAll('.etapa');
    const botaoAnterior = document.getElementById('botaoAnterior');
    const botaoProximo = document.getElementById('botaoProximo');
    let etapaAtual = 0;

    // Função para mostrar a etapa atual
    function mostrarEtapa(n) {
        // Esconde todas as tabs
        tabs.forEach(tab => {
            tab.style.display = 'none';
        });

        // Mostra a tab atual
        if (tabs[n]) {
            tabs[n].style.display = 'block';
        }

        // Atualiza o botão "Anterior"
        if (n === 0) {
            botaoAnterior.style.display = 'none';
        } else {
            botaoAnterior.style.display = 'inline-block';
        }

        // Atualiza o botão "Próximo" ou "Enviar"
        if (n === tabs.length - 1) {
            botaoProximo.textContent = 'Enviar';
            botaoProximo.type = 'submit';
            botaoProximo.onclick = null; // Remove o onclick para permitir o submit
        } else {
            botaoProximo.textContent = 'Próximo';
            botaoProximo.type = 'button';
            botaoProximo.onclick = () => proximoAnterior(1); // Adiciona o onclick
        }

        // Atualiza os indicadores de etapa
        atualizarIndicadores(n);

        // Rola para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Função para atualizar os indicadores visuais
    function atualizarIndicadores(n) {
        etapas.forEach((etapa, index) => {
            etapa.classList.remove('ativo', 'concluido');
            
            if (index < n) {
                etapa.classList.add('concluido');
            } else if (index === n) {
                etapa.classList.add('ativo');
            }
        });
    }

    // Função para validar campos obrigatórios da etapa atual
    function validarEtapaAtual() {
        const tabAtual = tabs[etapaAtual];
        const camposObrigatorios = tabAtual.querySelectorAll('[required]');
        let todosValidos = true;

        camposObrigatorios.forEach(campo => {
            campo.classList.remove('invalido');
            
            if (!campo.value.trim()) {
                campo.classList.add('invalido');
                todosValidos = false;
            }
        });

        if (!todosValidos) {
            mostrarMensagem('Por favor, preencha todos os campos obrigatórios.', 'erro');
        }

        return todosValidos;
    }

    // Função para avançar ou voltar etapas
    window.proximoAnterior = function(direcao) {
        // Se está avançando, valida a etapa atual
        if (direcao === 1) {
            // Se está na última etapa, não avança (deixa o submit do form funcionar)
            if (etapaAtual === tabs.length - 1) {
                return;
            }
            
            // Valida a etapa atual antes de avançar
            if (!validarEtapaAtual()) {
                return false;
            }
        }

        // Esconde a mensagem de status ao mudar de etapa
        if (statusMessage) {
            statusMessage.classList.add('hidden');
        }

        // Atualiza a etapa atual
        etapaAtual += direcao;

        // Garante que não ultrapasse os limites
        if (etapaAtual >= tabs.length) {
            etapaAtual = tabs.length - 1;
        } else if (etapaAtual < 0) {
            etapaAtual = 0;
        }

        mostrarEtapa(etapaAtual);
    };

    // Inicializa mostrando a primeira etapa
    mostrarEtapa(etapaAtual);

    // ===== Função para mostrar mensagens =====
    function mostrarMensagem(texto, tipo) {
        if (!statusMessage) return;

        statusMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700', 'bg-green-100', 'text-green-700', 'bg-blue-100', 'text-blue-700');
        
        if (tipo === 'sucesso') {
            statusMessage.classList.add('bg-green-100', 'text-green-700');
        } else if (tipo === 'erro') {
            statusMessage.classList.add('bg-red-100', 'text-red-700');
        } else {
            statusMessage.classList.add('bg-blue-100', 'text-blue-700');
        }

        statusMessage.classList.add('block', 'p-3', 'rounded-md', 'text-center', 'mb-4');
        statusMessage.textContent = texto;

        // Auto-esconde mensagens de sucesso após 3 segundos
        if (tipo === 'sucesso') {
            setTimeout(() => {
                statusMessage.classList.add('hidden');
                statusMessage.textContent = '';
            }, 3000);
        }
    }

    // ===== Função para formatar CEP =====
    const formatarCep = (cep) => cep.replace(/\D/g, '');

    // ===== Função para preencher endereço =====
    const preencherEndereco = (data) => {
        ruaInput.value = data.logradouro || '';
        bairroInput.value = data.bairro || '';
        cidadeInput.value = data.localidade || '';
        estadoInput.value = data.uf || '';
    };

    // ===== Buscar CEP na API =====
    const buscarCep = async (cep) => {
        const cepFormatado = formatarCep(cep);
        if (cepFormatado.length !== 8) {
            if (cepStatus) {
                cepStatus.textContent = 'CEP inválido.';
                cepStatus.className = 'mt-1 text-sm text-red-500';
            }
            return;
        }

        if (cepStatus) {
            cepStatus.textContent = 'Buscando CEP...';
            cepStatus.className = 'mt-1 text-sm text-blue-500';
        }

        preencherEndereco({ logradouro: '', bairro: '', localidade: '', uf: '' });

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
            const data = await resposta.json();

            if (data.erro) {
                if (cepStatus) {
                    cepStatus.textContent = 'CEP não encontrado.';
                    cepStatus.className = 'mt-1 text-sm text-red-500';
                }
                return;
            }

            preencherEndereco(data);
            if (cepStatus) {
                cepStatus.textContent = 'CEP encontrado com sucesso!';
                cepStatus.className = 'mt-1 text-sm text-green-500';
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            if (cepStatus) {
                cepStatus.textContent = 'Erro ao buscar CEP. Tente novamente.';
                cepStatus.className = 'mt-1 text-sm text-red-500';
            }
        }
    };

    // ===== Eventos do CEP =====
    if (cepInput) {
        cepInput.addEventListener('blur', (e) => {
            const cep = e.target.value;
            if (cep) buscarCep(cep);
        });

        cepInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
        });
    }
    
    // ===== Envio do formulário =====
    if (formProfissional) {
        formProfissional.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Valida a última etapa antes de enviar
            if (!validarEtapaAtual()) {
                return;
            }

            const formData = new FormData(formProfissional);
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
                    cep: formatarCep(formData.get('cep')),
                    rua: formData.get('rua'),
                    numero: formData.get('numero'),
                    bairro: formData.get('bairro'),
                    cidade: formData.get('cidade'),
                    estado: formData.get('estado')
                },
                biografia: formData.get('biography')
            };

            try {
                const response = await fetch('/api/profissionais', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    mostrarMensagem(result.message || 'Profissional cadastrado com sucesso!', 'sucesso');

                    // Limpa o formulário
                    formProfissional.reset();

                    // Volta para a primeira etapa
                    etapaAtual = 0;
                    mostrarEtapa(etapaAtual);

                    // Rola para o topo
                    formProfissional.scrollIntoView({ behavior: 'smooth' });
                } else {
                    mostrarMensagem(result.message || 'Erro ao cadastrar profissional.', 'erro');
                }
            } catch (error) {
                console.error('Erro na requisição:', error);
                mostrarMensagem('Erro ao conectar com o servidor. Tente novamente.', 'erro');
            }
        });
    } else {
        console.error('Formulário com ID "FormProfissional" não encontrado.');
    }

    // Remove classes 'invalido' quando o usuário começa a digitar
    document.querySelectorAll('input[required], select[required], textarea[required]').forEach(campo => {
        campo.addEventListener('input', () => {
            campo.classList.remove('invalido');
        });
    });
});