// Language toggle functionality
class LanguageManager {
    constructor() {
        this.currentLang = 'es';
        this.translations = {
            es: {
                criteria: {
                    labels: [
                        'Impacto en Productividad (5pts)', 
                        'Innovación y Originalidad (3pts)', 
                        'Viabilidad Técnica (4pts)', 
                        'Facilidad de Uso (3pts)', 
                        'Presentación (2pts)'
                    ],
                    title: 'Criterios de Evaluación'
                }
            },
            pt: {
                criteria: {
                    labels: [
                        'Impacto na Produtividade (5pts)', 
                        'Inovação e Originalidade (3pts)', 
                        'Viabilidade Técnica (4pts)', 
                        'Facilidade de Uso (3pts)', 
                        'Apresentação (2pts)'
                    ],
                    title: 'Critérios de Avaliação'
                }
            }
        };
        this.chart = null;
        this.init();
    }

    init() {
        this.setupLanguageToggle();
        this.initRadarChart();
        this.setupSmoothScrolling();
    }

    setupLanguageToggle() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                if (lang !== this.currentLang) {
                    this.switchLanguage(lang);
                }
            });
        });
    }

    switchLanguage(newLang) {
        // Update current language
        this.currentLang = newLang;
        
        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-lang="${newLang}"]`).classList.add('active');
        
        // Update all translatable elements
        document.querySelectorAll('[data-es][data-pt]').forEach(element => {
            if (newLang === 'es') {
                if (element.classList.contains('topic-examples') || 
                    element.classList.contains('roadmap') || 
                    element.classList.contains('timeline-item') ||
                    element.closest('.topics-note')) {
                    element.innerHTML = element.dataset.es;
                } else {
                    element.textContent = element.dataset.es;
                }
            } else {
                if (element.classList.contains('topic-examples') || 
                    element.classList.contains('roadmap') || 
                    element.classList.contains('timeline-item') ||
                    element.closest('.topics-note')) {
                    element.innerHTML = element.dataset.pt;
                } else {
                    element.textContent = element.dataset.pt;
                }
            }
        });

        // Update chart labels
        this.updateChartLanguage();
        
        // Update document language
        document.documentElement.lang = newLang;
    }

    initRadarChart() {
        const ctx = document.getElementById('criteriaChart');
        if (!ctx) return;

        const chartCtx = ctx.getContext('2d');
        
        // Chart data - these are the maximum possible scores for each criteria (weights)
        const maxScores = [5, 3, 4, 3, 2]; // Maximum score for each criteria based on weights
        
        this.chart = new Chart(chartCtx, {
            type: 'radar',
            data: {
                labels: this.translations[this.currentLang].criteria.labels,
                datasets: [
                    {
                        label: this.currentLang === 'es' ? 'Puntuación Máxima' : 'Pontuação Máxima',
                        data: maxScores,
                        borderColor: 'rgba(102, 126, 234, 1)',
                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                        borderWidth: 3,
                        pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                        pointBorderColor: '#fff',
                        pointRadius: 8
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(52, 73, 94, 0.9)',
                            padding: 20,
                            font: {
                                size: 14,
                                family: 'Inter'
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white',
                        borderColor: 'rgba(102, 126, 234, 1)',
                        borderWidth: 1
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        min: 0,
                        ticks: {
                            stepSize: 1,
                            color: 'rgba(52, 73, 94, 0.7)',
                            font: {
                                size: 12
                            }
                        },
                        grid: {
                            color: 'rgba(52, 73, 94, 0.2)'
                        },
                        angleLines: {
                            color: 'rgba(52, 73, 94, 0.2)'
                        },
                        pointLabels: {
                            color: 'rgba(52, 73, 94, 0.9)',
                            font: {
                                size: 13,
                                family: 'Inter',
                                weight: '500'
                            }
                        }
                    }
                },
                elements: {
                    line: {
                        borderWidth: 3
                    }
                }
            }
        });
    }

    updateChartLanguage() {
        if (!this.chart) return;

        // Update chart labels
        this.chart.data.labels = this.translations[this.currentLang].criteria.labels;
        
        // Update dataset labels
        this.chart.data.datasets[0].label = this.currentLang === 'es' ? 'Puntuación Máxima' : 'Pontuação Máxima';
        
        this.chart.update();
    }

    setupSmoothScrolling() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = 140; // Height of fixed header + nav
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Intersection Observer for animations
class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections and cards
        document.querySelectorAll('.section, .objective-card, .topic-card, .team-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat h3');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.textContent);
        
        // Skip animation if target is NaN (like "?")
        if (isNaN(target)) {
            return;
        }
        
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

// Team card hover effects
class InteractionManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupCardHoverEffects();
        this.setupTopicCardEffects();
    }

    setupCardHoverEffects() {
        const cards = document.querySelectorAll('.team-card, .objective-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                card.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
                card.style.boxShadow = 'none';
            });
        });
    }

    setupTopicCardEffects() {
        const topicCards = document.querySelectorAll('.topic-card');
        
        topicCards.forEach(card => {
            card.addEventListener('click', () => {
                // Add a pulse effect when clicked
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.transform = 'translateY(-5px) scale(1)';
                }, 150);
            });
        });
    }
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LanguageManager();
    new AnimationManager();
    new InteractionManager();
});

// Add some additional CSS animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInFromBottom 0.6s ease-out forwards;
    }

    @keyframes slideInFromBottom {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .team-card, .objective-card, .topic-card {
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .member {
        transition: all 0.2s ease;
    }

    .member:hover .member-avatar {
        transform: scale(1.1);
    }

    .stat h3 {
        font-variant-numeric: tabular-nums;
    }
`;
document.head.appendChild(style);
