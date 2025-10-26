document.addEventListener('DOMContentLoaded', () => {
    const dropdownContainers = document.querySelectorAll('.dropdown-container');
    
    dropdownContainers.forEach(container => {
        const toggle = container.querySelector('.dropdown-toggle');
        const menu = container.querySelector('.dropdown-menu');
        const arrow = toggle ? toggle.querySelector('svg:last-child') : null; // Pega apenas a última SVG (a seta)
        
        if (!toggle || !menu) return; // Segurança caso não encontre os elementos
        
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isHeaderDropdown = container.closest('header'); // Verifica se está no cabeçalho
            const isSidebarDropdown = container.closest('aside'); // Verifica se está na sidebar
            
            // Fecha outros dropdowns do mesmo contexto
            dropdownContainers.forEach(otherContainer => {
                if (otherContainer !== container) {
                    const otherMenu = otherContainer.querySelector('.dropdown-menu');
                    const otherArrow = otherContainer.querySelector('.dropdown-toggle svg:last-child');
                    
                    if (otherMenu) {
                        otherMenu.classList.add('hidden');
                    }
                    if (otherArrow) {
                        otherArrow.classList.remove('rotate-180');
                    }
                }
            });
            
            // Alterna o dropdown atual
            menu.classList.toggle('hidden');
            if (arrow) {
                arrow.classList.toggle('rotate-180');
            }
        });
    });
    
    // Fecha dropdowns ao clicar fora
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown-container')) {
            dropdownContainers.forEach(container => {
                const menu = container.querySelector('.dropdown-menu');
                const arrow = container.querySelector('.dropdown-toggle svg:last-child');
                
                if (menu) {
                    menu.classList.add('hidden');
                }
                if (arrow) {
                    arrow.classList.remove('rotate-180');
                }
            });
        }
    });
});