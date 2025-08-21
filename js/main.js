/**
 * The Soul Sister Project - Main JavaScript
 * Commissioned to Be Seen Retreat Website
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // Mobile Navigation Toggle
    // ========================================
    
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenu && navMenu) {
        mobileMenu.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenu.contains(event.target)) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
    
    
    // ========================================
    // Smooth Scrolling for Anchor Links
    // ========================================
    
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // ========================================
    // Navbar Background on Scroll
    // ========================================
    
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        function updateNavbar() {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }
        }
        
        window.addEventListener('scroll', updateNavbar);
        updateNavbar(); // Initial call
    }
    
    
    // ========================================
    // Gallery Functionality (Retreat Page)
    // ========================================
    
    const mainImage = document.querySelector('.main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Update main image with smooth transition
                mainImage.style.opacity = '0';
                
                setTimeout(() => {
                    mainImage.src = this.src;
                    mainImage.alt = this.alt;
                    mainImage.style.opacity = '1';
                }, 150);
            });
        });
    }
    
    
    // ========================================
    // Form Validation and Enhancement
    // ========================================
    
    const foundersForm = document.getElementById('foundersForm');
    
    if (foundersForm) {
        // Add loading state functionality
        function setFormLoading(isLoading) {
            const submitButton = foundersForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            if (isLoading) {
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                submitButton.disabled = true;
                foundersForm.classList.add('loading');
            } else {
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                foundersForm.classList.remove('loading');
            }
        }
        
        // Form submission handling
        foundersForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic validation
            const requiredFields = foundersForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                    
                    // Reset border color on input
                    field.addEventListener('input', function() {
                        this.style.borderColor = '#e2e8f0';
                    });
                } else {
                    field.style.borderColor = '#e2e8f0';
                }
            });
            
            if (!isValid) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            // Set loading state
            setFormLoading(true);
            
            // Create FormData object
            const formData = new FormData(foundersForm);
            
            // Submit to Formspree
            fetch(foundersForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Redirect to thank you page
                    window.location.href = 'thank-you.html';
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('There was an error submitting your responses. Please try again or contact us directly.', 'error');
            })
            .finally(() => {
                setFormLoading(false);
            });
        });
        
        // Character counting for textareas
        const textareas = foundersForm.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            const maxLength = textarea.getAttribute('maxlength');
            if (maxLength) {
                const counter = document.createElement('div');
                counter.className = 'character-counter';
                counter.style.cssText = 'text-align: right; font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;';
                
                function updateCounter() {
                    const remaining = maxLength - textarea.value.length;
                    counter.textContent = `${remaining} characters remaining`;
                    
                    if (remaining < 50) {
                        counter.style.color = '#ef4444';
                    } else if (remaining < 100) {
                        counter.style.color = '#f59e0b';
                    } else {
                        counter.style.color = '#6b7280';
                    }
                }
                
                textarea.parentNode.insertBefore(counter, textarea.nextSibling);
                textarea.addEventListener('input', updateCounter);
                updateCounter();
            }
        });
    }
    
    
    // ========================================
    // Notification System
    // ========================================
    
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            max-width: 400px;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
            color: white;
            font-weight: 500;
        `;
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
        
        document.body.appendChild(notification);
        
        // Close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
    
    // Add notification animations to head
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1rem;
            opacity: 0.8;
            transition: opacity 0.2s ease;
            margin-left: auto;
        }
        
        .notification-close:hover {
            opacity: 1;
        }
    `;
    document.head.appendChild(notificationStyles);
    
    
    // ========================================
    // Scroll Animations (Intersection Observer)
    // ========================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Elements to animate on scroll
    const animateElements = document.querySelectorAll(`
        .step,
        .expectation-card,
        .feature,
        .timeline-item,
        .investment-card,
        .vision-box,
        .founders-call,
        .retreat-details-preview
    `);
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    
    // ========================================
    // Typing Effect for Hero Titles (Optional Enhancement)
    // ========================================
    
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.textContent.includes('10 Seats')) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                heroTitle.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 1000);
    }
    
    
    // ========================================
    // Enhanced Form Interactions
    // ========================================
    
    // Auto-resize textareas
    const autoResizeTextareas = document.querySelectorAll('textarea');
    autoResizeTextareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
    
    // Add focus effects to form groups
    const formInputs = document.querySelectorAll('input, textarea, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.style.transform = 'translateY(-2px)';
            this.parentNode.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.style.transform = 'translateY(0)';
            this.parentNode.style.boxShadow = 'none';
        });
    });
    
    
    // ========================================
    // Preloader (if needed)
    // ========================================
    
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Hide any loading overlays
        const loaders = document.querySelectorAll('.loader, .preloader');
        loaders.forEach(loader => {
            loader.style.display = 'none';
        });
    });
    
    
    // ========================================
    // Performance Optimizations
    // ========================================
    
    // Debounce function for scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Optimized scroll handler
    const debouncedScrollHandler = debounce(() => {
        // Any scroll-dependent functions can go here
        updateNavbar();
    }, 10);
    
    window.addEventListener('scroll', debouncedScrollHandler);
    
    
    // ========================================
    // Accessibility Enhancements
    // ========================================
    
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #667eea;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 10000;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark if it doesn't exist
    const mainContent = document.querySelector('main') || document.querySelector('.hero');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main';
    }
    
    
    // ========================================
    // Error Handling
    // ========================================
    
    window.addEventListener('error', function(e) {
        console.error('JavaScript error:', e.error);
        // Could send error reports to analytics here
    });
    
    
    // ========================================
    // Analytics and Tracking (Optional)
    // ========================================
    
    // Track form interactions
    const trackEvent = (action, category = 'User Interaction') => {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: window.location.pathname
            });
        }
        
        // Console log for development
        console.log(`Analytics Event: ${category} - ${action}`);
    };
    
    // Track button clicks
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            trackEvent(`Button Click: ${buttonText}`, 'CTA');
        });
    });
    
    // Track form starts
    if (foundersForm) {
        let formStarted = false;
        foundersForm.addEventListener('input', function() {
            if (!formStarted) {
                trackEvent('Form Started', 'Form Interaction');
                formStarted = true;
            }
        });
    }
    
    
    // ========================================
    // Console Welcome Message
    // ========================================
    
    console.log(`
    🌟 The Soul Sister Project
    ✨ Commissioned to Be Seen Retreat
    
    Built with love and purpose to help women step into their calling.
    
    Technical questions? Contact: hello@soulsisterproject.com
    `);
    
});

// ========================================
// Additional Utility Functions
// ========================================

/**
 * Format phone numbers as user types
 */
function formatPhoneNumber(input) {
    const value = input.value.replace(/\D/g, '');
    const match = value.match(/^(\d{3})(\d{3})(\d{4})$/);
    
    if (match) {
        input.value = `(${match[1]}) ${match[2]}-${match[3]}`;
    }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Get query parameters
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Copy text to clipboard
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
    }
}

// Make utility functions available globally
window.SoulSisterProject = {
    formatPhoneNumber,
    isValidEmail,
    getQueryParam,
    copyToClipboard
};