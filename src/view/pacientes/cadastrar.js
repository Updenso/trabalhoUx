import { showSuccessAlert, showErrorAlert } from "../utils/alerts.js";

document.addEventListener('DOMContentLoaded', () => {
    const formPaciente = document.getElementById('FormPaciente');
    const cepInput = document.getElementById('cep');
    const ruaInput = document.getElementById('rua');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const cepStatus = document.getElementById('cepStatus');
    const cpfInput = document.getElementById('cpf');
    const phoneInput = document.getElementById('phone');

    const tabs = document.querySelectorAll('.tab');
    const etapas = document.querySelectorAll('.etapa');
    const botaoAnterior = document.getElementById('botaoAnterior');
    const botaoProximo = document.getElementById('botaoProximo');
    let etapaAtual = 0;

    function mostrarEtapa(n) {
        tabs.forEach(tab => tab.style.display = 'none');
        if (tabs[n]) tabs[n].style.display = 'block';

        botaoAnterior.style.display = n === 0 ? 'none' : 'inline-block';

        if (n === tabs.length - 1) {
            botaoProximo.textContent = 'Enviar';
            botaoProximo.type = 'submit';
            botaoProximo.onclick = null;
        } else {
            botaoProximo.textContent = 'Próximo';
            botaoProximo.type = 'button';
            botaoProximo.onclick = () => proximoAnterior(1);
        }

        atualizarIndicadores(n);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function atualizarIndicadores(n) {
        etapas.forEach((etapa, i) => {
            etapa.classList.remove('ativo', 'concluido');
            if (i < n) etapa.classList.add('concluido');
            if (i === n) etapa.classList.add('ativo');
        });
    }

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
            showErrorAlert('Por favor, preencha todos os campos obrigatórios.');
        }
        return todosValidos;
    }

    window.proximoAnterior = function(direcao) {
        if (direcao === 1 && !validarEtapaAtual()) return;
        etapaAtual += direcao;
        etapaAtual = Math.max(0, Math.min(etapaAtual, tabs.length - 1));
        mostrarEtapa(etapaAtual);
    };

    mostrarEtapa(etapaAtual);

    const formatarCep = cep => cep.replace(/\D/g, '');
    const formatarCPF = cpf => cpf
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');

    const formatarTelefone = tel => tel
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2');

    const preencherEndereco = data => {
        ruaInput.value = data.logradouro || '';
        bairroInput.value = data.bairro || '';
        cidadeInput.value = data.localidade || '';
        estadoInput.value = data.uf || '';
    };

    const buscarCep = async cep => {
        const puro = formatarCep(cep);
        if (puro.length !== 8) {
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

        preencherEndereco({});

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${puro}/json/`);
            const data = await resposta.json();

            if (data.erro) {
                cepStatus.textContent = 'CEP não encontrado.';
                cepStatus.className = 'mt-1 text-sm text-red-500';
                return;
            }

            preencherEndereco(data);
            cepStatus.textContent = 'CEP encontrado!';
            cepStatus.className = 'mt-1 text-sm text-green-500';
        } catch {
            cepStatus.textContent = 'Erro ao buscar CEP.';
            cepStatus.className = 'mt-1 text-sm text-red-500';
        }
    };

    if (cepInput) {
        cepInput.addEventListener('blur', e => buscarCep(e.target.value));
        cepInput.addEventListener('input', e => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5)
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            e.target.value = value;
        });
    }

    if (cpfInput) cpfInput.addEventListener('input', e => e.target.value = formatarCPF(e.target.value));
    if (phoneInput) phoneInput.addEventListener('input', e => e.target.value = formatarTelefone(e.target.value));

    if (formPaciente) {
        formPaciente.addEventListener('submit', async event => {
            event.preventDefault();
            if (!validarEtapaAtual()) return;

            const fd = new FormData(formPaciente);
            const payload = {
                nomeCompleto: fd.get('name'),
                email: fd.get('email'),
                dataNascimento: fd.get('dob'),
                cpf: formatarCep(fd.get('cpf')),
                telefone: fd.get('phone'),
                genero: fd.get('gender'),
                endereco: {
                    cep: formatarCep(fd.get('cep')),
                    rua: fd.get('rua'),
                    numero: fd.get('numero'),
                    bairro: fd.get('bairro'),
                    cidade: fd.get('cidade'),
                    estado: fd.get('estado')
                },
                historicoMedico: fd.get('medicalHistory')
            };

            try {
                const response = await fetch('/api/pacientes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json();

                if (response.ok) {
                    showSuccessAlert(result.message || 'Paciente cadastrado com sucesso!');
                    formPaciente.reset();
                    etapaAtual = 0;
                    mostrarEtapa(etapaAtual);
                    formPaciente.scrollIntoView({ behavior: 'smooth' });
                } else {
                    showErrorAlert(result.message || 'Erro ao cadastrar paciente.');
                }

            } catch (err) {
                console.error(err);
                showErrorAlert('Erro ao conectar com o servidor. Tente novamente.');
            }
        });
    }
});
