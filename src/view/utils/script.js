 // JavaScript para lidar com a responsividade da barra lateral
        document.addEventListener('DOMContentLoaded', () => {
            const sidebar = document.getElementById('sidebar');
            const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
            const sidebarOverlay = document.getElementById('sidebarOverlay');

            // Função para abrir a barra lateral em mobile
            const openSidebar = () => {
                sidebar.classList.remove('-translate-x-full');
                sidebarOverlay.classList.remove('hidden');
            };

            // Função para fechar a barra lateral em mobile
            const closeSidebar = () => {
                sidebar.classList.add('-translate-x-full');
                sidebarOverlay.classList.add('hidden');
            };

            // Adiciona listener para o botão de alternar sidebar em mobile
            mobileSidebarToggle.addEventListener('click', openSidebar);

            // Adiciona listener para o overlay (clicar fora da sidebar fecha ela)
            sidebarOverlay.addEventListener('click', closeSidebar);

            // Adiciona ou remove a classe 'hidden' na barra lateral para telas menores que md
            const handleResize = () => {
                if (window.innerWidth >= 768) { // md breakpoint em Tailwind é 768px
                    sidebar.classList.remove('-translate-x-full'); // Garante que a sidebar esteja visível em desktop
                    sidebarOverlay.classList.add('hidden'); // Garante que o overlay esteja oculto em desktop
                } else {
                    sidebar.classList.add('-translate-x-full'); // Esconde por padrão em mobile
                    sidebarOverlay.classList.add('hidden'); // Garante que o overlay esteja oculto inicialmente em mobile
                }
            };

            // Listener para redimensionamento da janela
            window.addEventListener('resize', handleResize);

            // Chama a função handleResize na carga inicial para definir o estado correto da barra lateral
            handleResize();
        });


// Variável global para controlar o rating atual
let currentRating = 0;

// Função para alternar visibilidade do formulário
function toggleFormulario() {
    const formulario = document.getElementById('formularioFeedback');
    const icone = document.getElementById('iconeBotao');
    
    if (formulario.classList.contains('form-hidden')) {
        // Mostrar formulário
        formulario.classList.remove('form-hidden');
        formulario.classList.add('form-visible');
        icone.className = 'fas fa-times text-white text-xl';
    } else {
        // Esconder formulário
        formulario.classList.add('form-hidden');
        formulario.classList.remove('form-visible');
        icone.className = 'fa-solid fa-envelope text-white text-xl';
    }
}

// Função para definir rating das estrelas
function setRating(rating) {
    currentRating = rating;
    document.getElementById('rating').value = rating;
    
    // Atualizar visual das estrelas
    const stars = document.querySelectorAll('.star');
    const ratingText = document.getElementById('ratingText');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
            star.style.color = '#fbbf24';
        } else {
            star.classList.remove('active');
            star.style.color = '#d1d5db';
        }
    });
    
    // Atualizar texto baseado na avaliação
    const textos = {
        1: 'Muito insatisfeito',
        2: 'Insatisfeito',
        3: 'Neutro',
        4: 'Satisfeito',
        5: 'Muito satisfeito'
    };
    
    ratingText.textContent = textos[rating] || 'Clique nas estrelas para avaliar';
}

// Função para enviar feedback
function enviarFeedback(event) {
    event.preventDefault();
    
    // Coletar dados do formulário
    const nome = document.getElementById('nome').value.trim();
    const rating = document.getElementById('rating').value;
    const descricao = document.getElementById('descricao').value.trim();
    
    // Validações
    if (!nome) {
        alert('Por favor, preencha seu nome.');
        document.getElementById('nome').focus();
        return;
    }
    
    if (rating === '0' || !rating) {
        alert('Por favor, selecione uma avaliação.');
        return;
    }
    
    if (!descricao) {
        alert('Por favor, descreva seu feedback.');
        document.getElementById('descricao').focus();
        return;
    }
    
    // Simular envio (aqui você pode integrar com sua API)
    const feedbackData = {
        nome: nome,
        rating: parseInt(rating),
        descricao: descricao,
        timestamp: new Date().toISOString()
    };
    
    console.log('Feedback enviado:', feedbackData);
    
    // Mostrar mensagem de sucesso
    alert('Feedback enviado com sucesso! Obrigado pela sua avaliação.');
    
    // Limpar e fechar formulário
    limparFormulario();
    toggleFormulario();
}

// Função para limpar o formulário
function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('descricao').value = '';
    document.getElementById('rating').value = '0';
    
    // Resetar estrelas
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        star.classList.remove('active');
        star.style.color = '#d1d5db';
    });
    
    // Resetar texto e contador
    document.getElementById('ratingText').textContent = 'Clique nas estrelas para avaliar';
    document.getElementById('charCount').textContent = '0/500 caracteres';
    
    currentRating = 0;
}

// Contador de caracteres para textarea
function setupCharCounter() {
    const textarea = document.getElementById('descricao');
    const charCount = document.getElementById('charCount');
    
    if (textarea && charCount) {
        textarea.addEventListener('input', function() {
            const length = this.value.length;
            charCount.textContent = `${length}/500 caracteres`;
            
            // Limitar a 500 caracteres
            if (length > 500) {
                this.value = this.value.substring(0, 500);
                charCount.textContent = '500/500 caracteres';
            }
            
            // Mudar cor quando próximo do limite
            if (length > 450) {
                charCount.style.color = '#ef4444';
            } else if (length > 400) {
                charCount.style.color = '#f59e0b';
            } else {
                charCount.style.color = '#9ca3af';
            }
        });
    }
}

// Efeitos hover para as estrelas
function setupStarHover() {
    const stars = document.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', function() {
            // Destacar estrelas até a posição atual
            stars.forEach((s, i) => {
                if (i <= index) {
                    s.style.color = '#fbbf24';
                } else {
                    s.style.color = '#d1d5db';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            // Voltar ao estado baseado no rating atual
            stars.forEach((s, i) => {
                if (i < currentRating) {
                    s.style.color = '#fbbf24';
                } else {
                    s.style.color = '#d1d5db';
                }
            });
        });
    });
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Garantir que o formulário inicie escondido
    const formulario = document.getElementById('formularioFeedback');
    if (formulario && !formulario.classList.contains('form-hidden')) {
        formulario.classList.add('form-hidden');
    }
    
    // Configurar funcionalidades
    setupCharCounter();
    setupStarHover();
    
    // Adicionar evento de tecla ESC para fechar
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const formulario = document.getElementById('formularioFeedback');
            if (formulario && !formulario.classList.contains('form-hidden')) {
                toggleFormulario();
            }
        }
    });
});

// Função opcional para integração com API real
function enviarFeedbackParaAPI(feedbackData) {
    // Exemplo de como você pode integrar com uma API real
    /*
    fetch('/api/feedback', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Sucesso:', data);
        alert('Feedback enviado com sucesso!');
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert('Erro ao enviar feedback. Tente novamente.');
    });
    */
}
        