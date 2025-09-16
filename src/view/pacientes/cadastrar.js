document.addEventListener('DOMContentLoaded', () => {
  const formPaciente = document.getElementById('FormPaciente');
  const statusMessage = document.getElementById('statusMessage');
  const steps = document.querySelectorAll('.step');
  const cepInput = document.getElementById('cep');
  const ruaInput = document.getElementById('rua');
  const bairroInput = document.getElementById('bairro');
  const cidadeInput = document.getElementById('cidade');
  const estadoInput = document.getElementById('estado');
  const cepStatus = document.getElementById('cepStatus');
  let currentStep = 0;

   function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.nextStep = () => {
    if (currentStep < steps.length - 1) {
      currentStep++;
      showStep(currentStep);
    }
  };

  window.prevStep = () => {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  };

  showStep(currentStep);

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
  if (formPaciente) {
    formPaciente.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(formPaciente);
      const data = {
        nomeCompleto: formData.get('name'),
        email: formData.get('email'),
        dataNascimento: formData.get('dob'),
        cpf: formData.get('cpf'),
        telefone: formData.get('phone'),
        genero: formData.get('gender'),
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
        const response = await fetch('/api/pacientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await response.json();

        if (response.ok) {
          formPaciente.reset();
          currentStep = 0;
          showStep(currentStep);

          // Mensagem de sucesso temporária
          statusMessage.textContent = result.message || 'Paciente cadastrado com sucesso!';
          statusMessage.className = 'bg-green-100 text-green-700 block p-3 rounded-md text-center mb-4';
          setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = 'hidden';
          }, 3000);
        } else {
          statusMessage.textContent = result.message || 'Erro ao cadastrar paciente.';
          statusMessage.className = 'bg-red-100 text-red-700 block p-3 rounded-md text-center mb-4';
        }
      } catch (err) {
        console.error(err);
        statusMessage.textContent = 'Erro ao conectar com o servidor. Tente novamente.';
        statusMessage.className = 'bg-red-100 text-red-700 block p-3 rounded-md text-center mb-4';
      }
    });
  }
});
