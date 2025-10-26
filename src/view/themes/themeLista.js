document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const header = document.querySelector('header');
    const aside = document.querySelector('aside');
    const abas = document.querySelectorAll('aside ul li span');
    const links = document.querySelectorAll('aside ul li a');
    const main = document.querySelector('main');


    const currentTheme = localStorage.getItem('theme') || 'light-theme';
    
    // Aplica o tema salvo ao carregar
    applyTheme(currentTheme);
    
    // Alternar tema ao clicar
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = localStorage.getItem('theme') === 'dark-theme' ? 'light-theme' : 'dark-theme';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }
    
    function applyTheme(theme) {
        // Remove classes anteriores
        body.classList.remove('light-theme', 'dark-theme');
        header.classList.remove('light-theme', 'dark-theme');
        aside.classList.remove('light-theme', 'dark-theme');
        main.classList.remove('light-theme', 'dark-theme');


        body.classList.add(theme); 
        header.classList.add(theme);
        aside.classList.add(theme);
        main.classList.add(theme);
       


        // Aplica estilos
        if (theme === 'dark-theme') {
            body.style.setProperty('background-color', '#080F2D', 'important');
            body.style.setProperty('color', '#f9fafb', 'important');
            
            header.style.setProperty('background-color', '#0F2D70', 'important');
            header.style.setProperty('color', '#f9fafb', 'important');
            
            aside.style.setProperty('background-color', '#1343A0', 'important');
            abas.forEach(link => {
                link.style.setProperty('color', '#f9fafb', 'important');
                link.style.setProperty('background-color', 'transparent', 'important');
            });
            links.forEach(link => {
                link.style.setProperty('color', '#f9fafb', 'important');
                link.style.setProperty('background-color', 'transparent', 'important');
            });

            main.style.setProperty('background-color', 'transparent', 'important');
            main.style.setProperty('color', '#f9fafb', 'important');

            
        } 
        else {
            body.style.setProperty('background-color', '#eeeeee', 'important');
            body.style.setProperty('color', '#1f2937', 'important');

            header.style.setProperty('background-color', 'oklch(62.3% 0.214 259.815)', 'important');
            header.style.setProperty('color', '#1f2937', 'important');

            aside.style.setProperty('background-color', '#fff', 'important');
            abas.forEach(link => {
                link.style.setProperty('color', '#1f2937', 'important');
                link.style.setProperty('background-color', 'transparent', 'important');
            });
            links.forEach(link => {
                link.style.setProperty('color', '#1f2937', 'important');
                link.style.setProperty('background-color', 'transparent', 'important');
            });

            main.style.setProperty('background-color', '#eeeeee', 'important');
            main.style.setProperty('color', '#1f2937', 'important');
        }
    }
});
