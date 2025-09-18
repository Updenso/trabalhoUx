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
    const steps = document.querySelectorAll('.step');
    let currentStep = 1;

    function showStep(step) {
        steps.forEach((el, index) => {
            el.classList.toggle('active', index === step - 1);
        });
        window.scrollTo(0, 0); // Rola para o topo da etapa
    }

    window.nextStep = () => {
        if (currentStep < steps.length) {
            currentStep++;
            showStep(currentStep);
        }
    };

    window.prevStep = () => {
        if (currentStep > 1) {
            currentStep--;
            showStep(currentStep);
        }
    };

    showStep(currentStep);

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
            cepStatus.className = 'flex justify-center align-center mt-1 text-sm text-red-500';
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
            cepStatus.className = 'flex justify-center align-center mt-1 text-sm text-green-500';
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
            if (value.length > 5) value = value.substring(0, 5) + '-' + value.substring(5, 8);
            e.target.value = value;
        });
    }
    
    // ===== Envio do formulário =====
if (formProfissional) {
    formProfissional.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (statusMessage) {
            statusMessage.textContent = '';  // Limpa qualquer mensagem anterior
            statusMessage.classList.add('hidden'); // Esconde o statusMessage
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

            if (statusMessage) {
                if (response.ok) {
                    statusMessage.classList.remove('hidden', 'bg-red-100', 'text-red-700');
                    statusMessage.classList.add('bg-green-100', 'text-green-700', 'block', 'p-3', 'rounded-md', 'text-center', 'mb-4');
                    statusMessage.textContent = result.message || 'Profissional cadastrado com sucesso!';

                    // Esconde a mensagem depois de 3 segundos
                    setTimeout(() => {
                        statusMessage.className = 'hidden';
                        statusMessage.textContent = '';
                    }, 3000);
                } else {
                    statusMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
                    statusMessage.classList.add('bg-red-100', 'text-red-700', 'block');
                    statusMessage.textContent = result.message || 'Erro ao cadastrar profissional.';
                }
            }

            if (response.ok) {
                // Limpa os campos do formulário
                formProfissional.reset();

                // Reinicia a primeira etapa
                currentStep = 1;
                showStep(currentStep);

                // Opcional: rola para o topo do formulário
                formProfissional.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            if (statusMessage) {
                statusMessage.classList.remove('hidden', 'bg-green-100', 'text-green-700');
                statusMessage.classList.add('bg-red-100', 'text-red-700', 'block');
                statusMessage.textContent = 'Erro ao conectar com o servidor. Tente novamente.';
            }
        }
    });
} else {
    console.error('Formulário com ID "FormProfissional" não encontrado.');
}

});
