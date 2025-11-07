import { showSuccessAlert, showErrorAlert } from "../utils/alerts.js";

document.addEventListener('DOMContentLoaded', async () => {
    const formEditarProfissional = document.getElementById('FormEditarProfissional');
    const profissionalIdInput = document.getElementById('profissionalId');

    const cepInput = document.getElementById('cep');
    const ruaInput = document.getElementById('rua');
    const numeroInput = document.getElementById('numero');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const cepStatus = document.getElementById('cepStatus');

    const buscarEPreencherCep = async (cep) => {
        const cepFormatado = cep.replace(/\D/g, '');
        if (cepFormatado.length !== 8) {
            cepStatus.textContent = 'CEP inválido.';
            return;
        }

        cepStatus.textContent = 'Buscando CEP...';

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepFormatado}/json/`);
            const data = await response.json();

            if (data.erro) {
                cepStatus.textContent = 'CEP não encontrado.';
                return;
            }

            ruaInput.value = data.logradouro || '';
            bairroInput.value = data.bairro || '';
            cidadeInput.value = data.localidade || '';
            estadoInput.value = data.uf || '';
            cepStatus.textContent = 'Endereço encontrado!';
        } catch (error) {
            console.error(error);
            cepStatus.textContent = 'Erro ao buscar CEP.';
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const profissionalIdFromUrl = urlParams.get('id');

    async function fetchAndPopulateProfissional(id) {
        if (!id || isNaN(id)) {
            showErrorAlert('Por favor, insira um ID de profissional válido.');
            formEditarProfissional.reset();
            return;
        }

        try {
            const response = await fetch(`/api/profissionais/${id}`);
            if (!response.ok) {
                showErrorAlert('Profissional não encontrado.');
                return;
            }

            const result = await response.json();
            const profissional = result.profissional;

            if (!profissional) {
                showErrorAlert('Profissional não encontrado.');
                return;
            }

            profissionalIdInput.value = profissional.profissionalId;
            document.getElementById('name').value = profissional.nomeCompleto;
            document.getElementById('email').value = profissional.email;
            document.getElementById('crm').value = profissional.crm;
            document.getElementById('dob').value = profissional.dataNascimento;
            document.getElementById('joiningDate').value = profissional.dataAdmissao;
            document.getElementById('phone').value = profissional.telefone;
            document.querySelectorAll(`input[name="gender"][value="${profissional.genero}"]`)
                .forEach(radio => radio.checked = true);
            document.getElementById('specialty').value = profissional.especialidade;

            if (typeof profissional.endereco === 'object') {
                cepInput.value = profissional.endereco.cep || '';
                ruaInput.value = profissional.endereco.rua || '';
                numeroInput.value = profissional.endereco.numero || '';
                bairroInput.value = profissional.endereco.bairro || '';
                cidadeInput.value = profissional.endereco.cidade || '';
                estadoInput.value = profissional.endereco.estado || '';
            }

            document.getElementById('biography').value = profissional.biografia;

        } catch (error) {
            console.error(error);
            showErrorAlert('Erro ao carregar dados do profissional.');
        }
    }

    if (profissionalIdFromUrl) {
        profissionalIdInput.value = profissionalIdFromUrl;
        await fetchAndPopulateProfissional(profissionalIdFromUrl);
    }

    profissionalIdInput.addEventListener('change', () => {
        fetchAndPopulateProfissional(profissionalIdInput.value);
    });

    cepInput.addEventListener('blur', (e) => {
        if (e.target.value) buscarEPreencherCep(e.target.value);
    });

    if (formEditarProfissional) {
        formEditarProfissional.addEventListener('submit', async (event) => {
            event.preventDefault();

            const idParaAtualizar = profissionalIdInput.value;
            if (!idParaAtualizar || isNaN(idParaAtualizar)) {
                showErrorAlert('ID do profissional inválido.');
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
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showSuccessAlert(result.message || 'Profissional atualizado com sucesso!');
                } else {
                    showErrorAlert(result.message || 'Erro ao atualizar profissional.');
                }
            } catch (error) {
                console.error(error);
                showErrorAlert('Erro ao conectar com o servidor.');
            }
        });
    }
});
