// static/js/script.js

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initNavigation();
    initAnimations();
    initSkillBars();
    initContactForm();
    initSmoothScroll();
    initTypewriter();
    initParallax();
    initTooltips();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Active nav link highlighting
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === currentPath || 
                (currentPath === '/' && link.getAttribute('href') === '/')) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveNavLink();
}

// Animation on scroll
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Trigger skill bar animations
                if (entry.target.classList.contains('skill-item')) {
                    animateSkillBar(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.skill-card, .project-card, .interest-card, .contact-item, .skill-item'
    );
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Skill bars animation
function initSkillBars() {
    function animateSkillBar(skillItem) {
        const progressBar = skillItem.querySelector('.progress-bar');
        if (progressBar) {
            const width = progressBar.style.width;
            progressBar.style.width = '0%';
            
            setTimeout(() => {
                progressBar.style.width = width;
            }, 200);
        }
    }
    
    // Export for use in intersection observer
    window.animateSkillBar = animateSkillBar;
}

// Contact form enhancements
function initContactForm() {
    const contactForm = document.querySelector('form[method="post"]');
    
    if (contactForm) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        
        contactForm.addEventListener('submit', function(e) {
            // Show loading state
            submitBtn.innerHTML = '<span class="loading me-2"></span>Sending...';
            submitBtn.disabled = true;
            
            // Form validation
            const requiredFields = contactForm.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            // Email validation
            const emailField = contactForm.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailField.value)) {
                    emailField.classList.add('is-invalid');
                    isValid = false;
                } else {
                    emailField.classList.remove('is-invalid');
                }
            }
            
            if (!isValid) {
                e.preventDefault();
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                showNotification('Please fill in all required fields correctly.', 'error');
                return;
            }
        });
        
        // Reset button state after form submission
        window.addEventListener('load', function() {
            if (submitBtn) {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
        
        // Real-time validation
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
    }
}

// Field validation helper
function validateField(field) {
    const value = field.value.trim();
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        field.classList.add('is-invalid');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('is-invalid');
            return false;
        }
    }
    
    field.classList.remove('is-invalid');
    return true;
}

// Smooth scrolling for anchor links
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const offsetTop = targetElement.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Typewriter effect for hero section
function initTypewriter() {
    const typewriterElements = document.querySelectorAll('[data-typewriter]');
    
    typewriterElements.forEach(element => {
        const text = element.getAttribute('data-typewriter');
        const speed = parseInt(element.getAttribute('data-speed')) || 100;
        
        element.innerHTML = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            }
        }
        
        // Start typewriter effect when element is in view
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    observer.unobserve(element);
                }
            });
        });
        
        observer.observe(element);
    });
}

// Parallax effect for hero section
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < heroSection.offsetHeight) {
                heroSection.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// Initialize tooltips
function initTooltips() {
    // Add tooltips to skill progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const percentage = bar.style.width;
        if (percentage) {
            bar.setAttribute('title', `Proficiency: ${percentage}`);
            bar.style.cursor = 'help';
        }
    });
    
    // Add tooltips to social links
    const socialLinks = document.querySelectorAll('.social-links a');
    const socialTitles = {
        'fa-github': 'GitHub Profile',
        'fa-linkedin': 'LinkedIn Profile',
        'fa-envelope': 'Send Email'
    };
    
    socialLinks.forEach(link => {
        const icon = link.querySelector('i');
        if (icon) {
            const iconClass = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
            if (socialTitles[iconClass]) {
                link.setAttribute('title', socialTitles[iconClass]);
            }
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 9999;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 150);
        }
    }, 5000);
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Project card interactions
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Search functionality (if needed)
function initSearch() {
    const searchInput = document.querySelector('#search-input');
    const searchableItems = document.querySelectorAll('.searchable-item');
    
    if (searchInput && searchableItems.length > 0) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            searchableItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                const isVisible = text.includes(searchTerm);
                
                item.style.display = isVisible ? 'block' : 'none';
            });
        });
    }
}

// Back to top button
function initBackToTop() {
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopBtn.className = 'btn btn-primary back-to-top';
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: none;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(backToTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });
    
    // Scroll to top functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize back to top button
document.addEventListener('DOMContentLoaded', function() {
    initBackToTop();
});

// Performance monitoring
function initPerformanceMonitoring() {
    // Log page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    });
    
    // Monitor long tasks
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver(function(list) {
            for (const entry of list.getEntries()) {
                if (entry.duration > 50) {
                    console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
                }
            }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
    }
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    showNotification('An error occurred. Please refresh the page.', 'error');
});

// Service worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registered successfully');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Export functions for external use
window.portfolioJS = {
    showNotification,
    validateField,
    initAnimations,
    initSkillBars
};