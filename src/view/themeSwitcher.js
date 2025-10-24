document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme') || 'light-theme';
    
    // Aplica o tema salvo ao carregar a página
    applyTheme(currentTheme);
    
    // Adiciona um listener ao botão de alternar tema
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = localStorage.getItem('theme') === 'dark-theme' ? 'light-theme' : 'dark-theme';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }
    
    function applyTheme(theme) {
        // Remove classes de tema anteriores
        body.classList.remove('light-theme', 'dark-theme');
        
        // Adiciona a classe do tema atual
        body.classList.add(theme);
        
        // Aplica cores específicas para o body
        if (theme === 'dark-theme') {
            body.style.setProperty('background-color', '#111827', 'important');
            body.style.setProperty('color', '#000000ff', 'important');
        } else {
            body.style.setProperty('background-color', '#eeeeeeff', 'important');
            body.style.setProperty('color', '#1f2937', 'important');
        }
    }
});