// Asegurar que las funciones estén disponibles globalmente desde el inicio
window.toggleMobileMenu = function() {
    console.log('toggleMobileMenu called before initialization');
};

window.toggleDropdown = function(id) {
    console.log('toggleDropdown called before initialization for:', id);
};

// Función principal de inicialización
function initializeHeaderFunctions() {
    // Variables para los elementos
    let mobileMenu = null;
    let mobileBtn = null;
    
    // Inicializar elementos después de que el DOM esté listo
    function initializeElements() {
        mobileMenu = document.getElementById('mobileMenu');
        mobileBtn = document.querySelector('.mobile-menu-btn');
        
        console.log('Mobile menu element:', mobileMenu); // Debug
        console.log('Mobile button element:', mobileBtn); // Debug
        
        return mobileMenu && mobileBtn;
    }
    
    function toggleMobileMenu() {
        // Re-inicializar elementos si no están disponibles
        if (!mobileMenu || !mobileBtn) {
            if (!initializeElements()) {
                console.error('Cannot find mobile menu elements');
                return;
            }
        }
        
        const isActive = mobileMenu.classList.contains('active');
        
        console.log('Toggling menu, currently active:', isActive); // Debug
        
        if (isActive) {
            // Cerrar menú
            mobileMenu.classList.remove('active');
            mobileBtn.classList.remove('active');
            
            // Cerrar todos los dropdowns
            document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            
            // Quitar clase del body para permitir scroll
            document.body.classList.remove('mobile-menu-open');
            console.log('Menu closed'); // Debug
        } else {
            // Abrir menú
            mobileMenu.classList.add('active');
            mobileBtn.classList.add('active');
            
            // Prevenir scroll del body cuando el menú está abierto
            document.body.classList.add('mobile-menu-open');
            console.log('Menu opened'); // Debug
        }
    }

    function toggleDropdown(id) {
        if (typeof event !== 'undefined' && event) {
            event.preventDefault();
        }
        
        // Get all mobile dropdowns
        const allDropdowns = document.querySelectorAll('.mobile-dropdown');
        const targetDropdown = document.getElementById(id);
        
        console.log('Toggling dropdown:', id, targetDropdown); // Debug
        
        // Close all other dropdowns first
        allDropdowns.forEach(dropdown => {
            if (dropdown.id !== id && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
            }
        });
        
        // Toggle the clicked dropdown with smooth animation
        if (targetDropdown) {
            targetDropdown.classList.toggle('active');
        }
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        // Re-inicializar elementos si no están disponibles
        if (!mobileMenu || !mobileBtn) {
            initializeElements();
        }
        
        if (mobileMenu && mobileBtn && 
            !mobileMenu.contains(event.target) && 
            !mobileBtn.contains(event.target) &&
            mobileMenu.classList.contains('active')) {
            
            mobileMenu.classList.remove('active');
            mobileBtn.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
            
            // Close all mobile dropdowns
            document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Close mobile menu when resizing to desktop view
    window.addEventListener('resize', function() {
        // Re-inicializar elementos si no están disponibles
        if (!mobileMenu || !mobileBtn) {
            initializeElements();
        }
        
        // If window is wider than tablet breakpoint, close mobile menu and dropdowns
        if (window.innerWidth > 900 && mobileMenu && mobileBtn) {
            mobileMenu.classList.remove('active');
            mobileBtn.classList.remove('active');
            document.body.classList.remove('mobile-menu-open');
            
            document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Mejorar la accesibilidad con teclado
    document.addEventListener('keydown', function(event) {
        // Re-inicializar elementos si no están disponibles
        if (!mobileMenu || !mobileBtn) {
            initializeElements();
        }
        
        if (event.key === 'Escape') {
            // Cerrar menú móvil si está abierto
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileBtn.classList.remove('active');
                document.body.classList.remove('mobile-menu-open');
                
                document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
            
            // Cerrar dropdowns del menú desktop
            document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
            });
        }
    });

    // Funciones para mejorar la accesibilidad de los dropdowns desktop
    function initializeDesktopDropdowns() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(navItem => {
            const navLink = navItem.querySelector('.nav-link.has-dropdown');
            const dropdown = navItem.querySelector('.dropdown-menu');
            const dropdownItems = navItem.querySelectorAll('.dropdown-item');
            
            if (!navLink || !dropdown) return;
            
            // Manejar la navegación por teclado en dropdowns
            navLink.addEventListener('keydown', function(event) {
                if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    
                    // Mostrar dropdown
                    dropdown.style.opacity = '1';
                    dropdown.style.visibility = 'visible';
                    dropdown.style.transform = 'translateX(-50%) translateY(0)';
                    navLink.setAttribute('aria-expanded', 'true');
                    
                    // Enfocar el primer item si existe
                    if (dropdownItems.length > 0) {
                        dropdownItems[0].focus();
                        dropdownItems[0].setAttribute('tabindex', '0');
                    }
                }
            });
            
            // Manejar la navegación entre items del dropdown
            dropdownItems.forEach((item, index) => {
                item.addEventListener('keydown', function(event) {
                    if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        const nextItem = dropdownItems[index + 1] || dropdownItems[0];
                        nextItem.focus();
                        nextItem.setAttribute('tabindex', '0');
                        item.setAttribute('tabindex', '-1');
                    } else if (event.key === 'ArrowUp') {
                        event.preventDefault();
                        const prevItem = dropdownItems[index - 1] || dropdownItems[dropdownItems.length - 1];
                        prevItem.focus();
                        prevItem.setAttribute('tabindex', '0');
                        item.setAttribute('tabindex', '-1');
                    } else if (event.key === 'Escape') {
                        event.preventDefault();
                        dropdown.style.opacity = '0';
                        dropdown.style.visibility = 'hidden';
                        navLink.setAttribute('aria-expanded', 'false');
                        navLink.focus();
                        
                        // Resetear tabindex
                        dropdownItems.forEach(di => di.setAttribute('tabindex', '-1'));
                    }
                });
                
                // Cerrar dropdown al hacer clic en un item
                item.addEventListener('click', function() {
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                    navLink.setAttribute('aria-expanded', 'false');
                    dropdownItems.forEach(di => di.setAttribute('tabindex', '-1'));
                });
            });
            
            // Cerrar dropdown cuando se pierde el focus
            navItem.addEventListener('focusout', function(event) {
                // Usar setTimeout para permitir que el nuevo elemento reciba focus
                setTimeout(() => {
                    if (!navItem.contains(document.activeElement)) {
                        dropdown.style.opacity = '0';
                        dropdown.style.visibility = 'hidden';
                        navLink.setAttribute('aria-expanded', 'false');
                        dropdownItems.forEach(di => di.setAttribute('tabindex', '-1'));
                    }
                }, 100);
            });
        });
    }

    // Esperar un poco más y reintentar inicialización
    setTimeout(() => {
        initializeElements();
        initializeDesktopDropdowns(); // Inicializar funcionalidad de dropdowns desktop
    }, 100);

    // Make functions globally available - REEMPLAZAR las funciones placeholder
    window.toggleMobileMenu = toggleMobileMenu;
    window.toggleDropdown = toggleDropdown;
}

// Ejecutar cuando el DOM esté listo o inmediatamente si ya está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeHeaderFunctions);
} else {
    initializeHeaderFunctions();
}