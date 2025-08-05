// Custom cursor functionality
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

let mouseX = 0;
let mouseY = 0;
let outlineX = 0;
let outlineY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
});

// Smooth cursor outline animation
function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;

    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;

    requestAnimationFrame(animateOutline);
}
animateOutline();

// Cursor hover effects
const hoverElements = document.querySelectorAll('button, .card, input, .chip, .candidate-card, .expand-btn');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });

    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});

// Tab switching functionality
const tabButtons = document.querySelectorAll('.nav-btn');
const tabContents = document.querySelectorAll('.tab-content');
const dynamicText = document.getElementById('dynamic-text');

const tabTexts = {
    'roles': 'Cognizant Interview',
    'clusters': 'Tech Clusters',
    'candidates': 'All Candidates'
};

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(`${targetTab}-tab`).classList.add('active');

        // Update dynamic text with animation
        dynamicText.style.opacity = '0';
        dynamicText.style.transform = 'translateY(20px)';

        setTimeout(() => {
            dynamicText.textContent = tabTexts[targetTab];
            dynamicText.style.opacity = '1';
            dynamicText.style.transform = 'translateY(0)';
        }, 200);

        // Trigger card animations
        setTimeout(() => {
            const cards = document.querySelectorAll(`#${targetTab}-tab .card, #${targetTab}-tab .candidate-card`);
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';

                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
    });
});

// Search functionality
const roleSearch = document.getElementById('role-search');
const clusterSearch = document.getElementById('cluster-search');
const candidateSearch = document.getElementById('candidate-search');

function setupSearch(searchInput, targetSelector) {
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const items = document.querySelectorAll(targetSelector);

        items.forEach(item => {
            const title = item.querySelector('.card-title, h3')?.textContent.toLowerCase() || '';
            const description = item.querySelector('.card-description, .question-text')?.textContent.toLowerCase() || '';
            const questions = Array.from(item.querySelectorAll('.question-text')).map(q => q.textContent.toLowerCase()).join(' ');

            const isVisible = title.includes(searchTerm) ||
                description.includes(searchTerm) ||
                questions.includes(searchTerm);

            if (isVisible) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 100);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
}

setupSearch(roleSearch, '#roles-grid .card');
setupSearch(clusterSearch, '#clusters-grid .card');
setupSearch(candidateSearch, '.candidate-card');

// Filter functionality
const filterChips = document.querySelectorAll('.chip');

filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const container = chip.closest('.search-container');
        const chips = container.querySelectorAll('.chip');
        const filter = chip.getAttribute('data-filter');
        const isRolesTab = container.closest('#roles-tab');
        const isClustersTab = container.closest('#clusters-tab');
        const isCandidatesTab = container.closest('#candidates-tab');

        let targetSelector = '';
        if (isRolesTab) {
            targetSelector = '#roles-grid .card';
        } else if (isClustersTab) {
            targetSelector = '#clusters-grid .card';
        } else if (isCandidatesTab) {
            targetSelector = '.candidate-card';
        }

        // Remove active class from all chips in this container
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        // Filter items
        const items = document.querySelectorAll(targetSelector);

        items.forEach((item, index) => {
            const category = item.getAttribute('data-category');
            const isVisible = filter === 'all' || category === filter;

            if (isVisible) {
                item.style.display = 'block';
                item.style.opacity = '0';
                item.style.transform = 'translateY(30px)';

                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(-20px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Candidate card expand/collapse functionality
function toggleCandidate(button) {
    const candidateCard = button.closest('.candidate-card');
    const questionsContainer = candidateCard.querySelector('.candidate-questions');
    const svg = button.querySelector('svg');

    if (questionsContainer.classList.contains('expanded')) {
        questionsContainer.classList.remove('expanded');
        svg.style.transform = 'rotate(0deg)';
        candidateCard.style.marginBottom = '0';
    } else {
        questionsContainer.classList.add('expanded');
        svg.style.transform = 'rotate(180deg)';
        candidateCard.style.marginBottom = '1rem';

        // Animate questions
        const questions = questionsContainer.querySelectorAll('.question-item');
        questions.forEach((question, index) => {
            question.style.opacity = '0';
            question.style.transform = 'translateX(-20px)';

            setTimeout(() => {
                question.style.opacity = '1';
                question.style.transform = 'translateX(0)';
            }, index * 50);
        });
    }
}

// Make toggleCandidate globally available
window.toggleCandidate = toggleCandidate;

// Card interaction effects
const cards = document.querySelectorAll('.card, .candidate-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        if (!card.classList.contains('candidate-card')) {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        }
    });

    card.addEventListener('mouseleave', () => {
        if (!card.classList.contains('candidate-card')) {
            card.style.transform = 'translateY(0) scale(1)';
        }
    });

    card.addEventListener('click', (e) => {
        // Don't trigger for candidate cards or if clicking expand button
        if (card.classList.contains('candidate-card') || e.target.closest('.expand-btn')) {
            return;
        }

        // Add click animation
        card.style.transform = 'translateY(-8px) scale(0.98)';

        setTimeout(() => {
            card.style.transform = 'translateY(-8px) scale(1.02)';
        }, 150);

        // Show notification for card selection
        const cardTitle = card.querySelector('.card-title, h3')?.textContent || 'Item';
        showNotification(`Viewing: ${cardTitle}`);
    });
});

// Notification system
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
            </svg>
            <span>${message}</span>
        </div>
    `;

    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;

    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 500;
    `;

    notification.querySelector('svg').style.cssText = `
        width: 20px;
        height: 20px;
        flex-shrink: 0;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out and remove
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Intersection Observer for scroll animations
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

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.card, .candidate-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Performance optimization: Debounce scroll events
let scrollTimeout;
window.addEventListener('scroll', () => {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }

    scrollTimeout = setTimeout(() => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');

        if (scrolled > 100) {
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = 'none';
        }
    }, 10);
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add initial animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Initialize tooltips for badges
    const badges = document.querySelectorAll('.role-badge, .cluster-badge');
    badges.forEach(badge => {
        badge.addEventListener('mouseenter', (e) => {
            const badgeText = e.target.textContent;
            let tooltip = '';

            switch (badgeText) {
                case 'GenC':
                    tooltip = 'Entry-level development role';
                    break;
                case 'GenC Pro':
                    tooltip = 'Advanced development role';
                    break;
                case 'GenC Next':
                    tooltip = 'Leadership and architecture role';
                    break;
                case 'Cybersecurity':
                    tooltip = 'Security specialist role';
                    break;
                case 'Cluster 1':
                    tooltip = 'Java development track';
                    break;
                case 'Cluster 2':
                    tooltip = 'Python development track';
                    break;
                case 'Cluster 3':
                    tooltip = 'C# .NET development track';
                    break;
            }

            if (tooltip) {
                showTooltip(e.target, tooltip);
            }
        });

        badge.addEventListener('mouseleave', () => {
            hideTooltip();
        });
    });
});

// Tooltip functionality
function showTooltip(element, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        white-space: nowrap;
        z-index: 10000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    document.body.appendChild(tooltip);

    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
    tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;

    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => {
            tooltip.remove();
        }, 300);
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

// Service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker can be registered here for offline functionality
    });
}
