document.addEventListener('DOMContentLoaded', async () => {
    const pacienteSelect = document.getElementById('paciente_id');
    const profissionalSelect = document.getElementById('profissional_id');
    const formAgendamento = document.getElementById('formAgendamento');
    const statusMessage = document.getElementById('statusMessage');
    const mainTitle = document.getElementById('mainTitle');

    // Captura o ID do agendamento da URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    let pacientes = [];
    let profissionais = [];
    let agendamentoOriginal = null;

    // Função para mostrar mensagens de status
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

    // Função para carregar pacientes
    async function carregarPacientes() {
        try {
            console.log('Carregando pacientes...');
            const response = await fetch('/api/pacientes');
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Dados de pacientes recebidos:', data);
            
            // Diferentes formatos de resposta possíveis
            pacientes = data.pacientes || data || [];
            console.log(`${pacientes.length} pacientes carregados`);
            
            // Limpa e preenche o select
            pacienteSelect.innerHTML = '<option value="">Selecione...</option>';
            
            pacientes.forEach(paciente => {
                const option = document.createElement('option');
                option.value = paciente.paciente_id;
                option.textContent = paciente.nome_completo || paciente.nomeCompleto || paciente.nome || `Paciente ${paciente.paciente_id}`;
                pacienteSelect.appendChild(option);
            });
            
            return true;
        } catch (error) {
            console.error('Erro ao carregar pacientes:', error);
            mostrarMensagem('Erro ao carregar lista de pacientes');
            return false;
        }
    }

    // Função para carregar profissionais
    async function carregarProfissionais() {
        try {
            console.log('Carregando profissionais...');
            const response = await fetch('/api/profissionais');
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Dados de profissionais recebidos:', data);
            
            // Diferentes formatos de resposta possíveis
            profissionais = data.profissionais || data || [];
            console.log(`${profissionais.length} profissionais carregados`);
            
            // Limpa e preenche o select
            profissionalSelect.innerHTML = '<option value="">Selecione...</option>';
            
            profissionais.forEach(profissional => {
                const option = document.createElement('option');
                option.value = profissional.profissional_id;
                option.textContent = profissional.nome_completo || profissional.nomeCompleto || profissional.nome || `Profissional ${profissional.profissional_id}`;
                profissionalSelect.appendChild(option);
            });
            
            return true;
        } catch (error) {
            console.error('Erro ao carregar profissionais:', error);
            mostrarMensagem('Erro ao carregar lista de profissionais');
            return false;
        }
    }

    // Função para carregar dados do agendamento
    async function carregarAgendamento() {
        if (!id) {
            mainTitle.textContent = 'Novo Agendamento';
            return;
        }

        try {
            console.log(`Carregando agendamento ID: ${id}`);
            const response = await fetch(`/api/agendamentos/${id}`);
            
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Dados do agendamento recebidos:', data);
            
            if (!data.agendamento) {
                throw new Error('Agendamento não encontrado');
            }
            
            agendamentoOriginal = data.agendamento;
            console.log('Agendamento original:', agendamentoOriginal);
            
            // Aguarda um momento para garantir que os selects estão carregados
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // Preenche o formulário
            if (agendamentoOriginal.paciente_id) {
                pacienteSelect.value = agendamentoOriginal.paciente_id;
                console.log('Paciente selecionado:', pacienteSelect.value);
            }
            
            if (agendamentoOriginal.profissional_id) {
                profissionalSelect.value = agendamentoOriginal.profissional_id;
                console.log('Profissional selecionado:', profissionalSelect.value);
            }
            
            // Formata a data para o input type="date"
            if (agendamentoOriginal.data_agendamento) {
                const dataObj = new Date(agendamentoOriginal.data_agendamento);
                const dataFormatada = dataObj.toISOString().split('T')[0];
                document.getElementById('data_agendamento').value = dataFormatada;
            }
            
            if (agendamentoOriginal.hora_agendamento) {
                // Remove segundos se existirem
                const hora = agendamentoOriginal.hora_agendamento.substring(0, 5);
                document.getElementById('hora_agendamento').value = hora;
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

    // Função principal de inicialização
    async function inicializar() {
        console.log('Inicializando página de edição...');
        
        // Carrega pacientes e profissionais primeiro
        const [pacientesCarregados, profissionaisCarregados] = await Promise.all([
            carregarPacientes(),
            carregarProfissionais()
        ]);
        
        if (pacientesCarregados && profissionaisCarregados) {
            await carregarAgendamento();
        }
        
        // Verifica se os valores foram setados corretamente
        setTimeout(() => {
            console.log('Valor final do paciente select:', pacienteSelect.value);
            console.log('Valor final do profissional select:', profissionalSelect.value);
        }, 500);
    }

    // Event listener para o formulário
    formAgendamento.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        // Coleta os dados do formulário
        const formData = new FormData(formAgendamento);
        
        console.log('Dados do formulário:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        const pacienteId = parseInt(formData.get('paciente_id'));
        const profissionalId = parseInt(formData.get('profissional_id'));
        
        // Validação
        if (!pacienteId || !profissionalId) {
            mostrarMensagem('Selecione um paciente e um profissional válidos!');
            return;
        }
        
        const updatedData = {
            pacienteId: pacienteId,
            profissionalId: profissionalId,
            dataAgendamento: formData.get('data_agendamento'),
            horaAgendamento: formData.get('hora_agendamento') + ':00', // Adiciona segundos
            tipoAgendamento: formData.get('tipo_agendamento'),
            observacoes: formData.get('observacoes'),
            status: 'Agendado'
        };
        
        console.log('Dados enviados para atualização:', updatedData);

        try {
            const response = await fetch(`/api/agendamentos/${id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            const result = await response.json();
            console.log('Resposta do servidor:', result);

            if (response.ok) {
                mostrarMensagem(result.message || 'Agendamento atualizado com sucesso!', 'sucesso');
            } else {
                mostrarMensagem(result.message || result.error || 'Erro ao atualizar agendamento.');
            }

        } catch (error) {
            console.error('Erro na requisição:', error);
            mostrarMensagem('Erro ao conectar com o servidor. Verifique o console para detalhes.');
        }
    });

    // Inicializa a página
    await inicializar();
});