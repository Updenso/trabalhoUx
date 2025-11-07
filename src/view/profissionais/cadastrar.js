import { showSuccessAlert, showErrorAlert } from "../utils/alerts.js";

document.addEventListener('DOMContentLoaded', () => {
    const formProfissional = document.getElementById('FormProfissional');
    const cepInput = document.getElementById('cep');
    const ruaInput = document.getElementById('rua');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const cepStatus = document.getElementById('cepStatus');

    const tabs = document.querySelectorAll('.tab');
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

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function validarEtapaAtual() {
        const tabAtual = tabs[etapaAtual];
        const camposObrigatorios = tabAtual.querySelectorAll('[required]');
        let ok = true;

        camposObrigatorios.forEach(campo => {
            campo.classList.remove('invalido');
            if (!campo.value.trim()) {
                campo.classList.add('invalido');
                ok = false;
            }
        });

        if (!ok) showErrorAlert('Por favor, preencha todos os campos obrigatórios.');
        return ok;
    }

    window.proximoAnterior = function (d) {
        if (d === 1 && etapaAtual !== tabs.length - 1 && !validarEtapaAtual()) return;
        etapaAtual = Math.max(0, Math.min(etapaAtual + d, tabs.length - 1));
        mostrarEtapa(etapaAtual);
    };

    mostrarEtapa(etapaAtual);

    const formatarCep = cep => cep.replace(/\D/g, '');

    const preencherEndereco = data => {
        ruaInput.value = data.logradouro || '';
        bairroInput.value = data.bairro || '';
        cidadeInput.value = data.localidade || '';
        estadoInput.value = data.uf || '';
    };

    const buscarCep = async cep => {
        const cepFormatado = formatarCep(cep);
        if (cepFormatado.length !== 8) {
            cepStatus.textContent = 'CEP inválido.';
            cepStatus.className = 'mt-1 text-sm text-red-500';
            return;
        }

        cepStatus.textContent = 'Buscando CEP...';
        cepStatus.className = 'mt-1 text-sm text-blue-500';

        preencherEndereco({});

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
            const data = await resposta.json();

            if (data.erro) {
                cepStatus.textContent = 'CEP não encontrado.';
                cepStatus.className = 'mt-1 text-sm text-red-500';
                return;
            }

            preencherEndereco(data);
            cepStatus.textContent = 'CEP encontrado!';
            cepStatus.className = 'mt-1 text-sm text-green-500';

        } catch (err) {
            console.error(err);
            cepStatus.textContent = 'Erro ao buscar CEP.';
            cepStatus.className = 'mt-1 text-sm text-red-500';
        }
    };

    if (cepInput) {
        cepInput.addEventListener('blur', e => buscarCep(e.target.value));
    }

    if (formProfissional) {
        formProfissional.addEventListener('submit', async event => {
            event.preventDefault();
            if (!validarEtapaAtual()) return;

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
                    showSuccessAlert(result.message || 'Profissional cadastrado com sucesso!');
                    formProfissional.reset();
                    etapaAtual = 0;
                    mostrarEtapa(etapaAtual);
                    formProfissional.scrollIntoView({ behavior: 'smooth' });
                } else {
                    showErrorAlert(result.message || 'Erro ao cadastrar profissional.');
                }

            } catch (error) {
                console.error(error);
                showErrorAlert('Erro ao conectar com o servidor. Tente novamente.');
            }
        });
    }
});
