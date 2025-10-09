// Navigation JavaScript - ES6 Module
export class Navigation {
    constructor() {
        this.hamburger = null;
        this.navMenu = null;
        this.dropdowns = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupWayfinding();
    }

    setupEventListeners() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.bindEvents());
        } else {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.dropdowns = document.querySelectorAll('.dropdown');

        if (this.hamburger && this.navMenu) {
            this.hamburger.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Handle dropdown menus on mobile
        this.dropdowns.forEach(dropdown => {
            const link = dropdown.querySelector('a');
            if (link) {
                link.addEventListener('click', (e) => {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        this.toggleDropdown(dropdown);
                    }
                });
            }
        });

        // Close mobile menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-menu a:not(.dropdown > a)');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeMobileMenu();
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.navMenu && this.navMenu.classList.contains('active')) {
                if (!e.target.closest('.main-nav')) {
                    this.closeMobileMenu();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
                this.closeAllDropdowns();
            }
        });
    }

    toggleMobileMenu() {
        if (this.hamburger && this.navMenu) {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
            
            // Close all dropdowns when toggling menu
            this.closeAllDropdowns();
        }
    }

    closeMobileMenu() {
        if (this.hamburger && this.navMenu) {
            this.hamburger.classList.remove('active');
            this.navMenu.classList.remove('active');
            this.closeAllDropdowns();
        }
    }

    toggleDropdown(dropdown) {
        // Close other dropdowns
        this.dropdowns.forEach(d => {
            if (d !== dropdown) {
                d.classList.remove('active');
            }
        });
        
        // Toggle current dropdown
        dropdown.classList.toggle('active');
    }

    closeAllDropdowns() {
        this.dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }

    setupWayfinding() {
        // Add active class to current page link
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-menu a');
        
        navLinks.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (currentPath.includes(linkPath.split('/').pop())) {
                link.classList.add('active');
            }
        });
    }
}

// DOM Manipulation utilities
export class DOMUtils {
    static createElement(tag, className = '', content = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content) element.textContent = content;
        return element;
    }

    static appendChildren(parent, children) {
        children.forEach(child => parent.appendChild(child));
    }

    static clearElement(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }
}

// Array methods utilities
export class ArrayUtils {
    static filterByProperty(array, property, value) {
        return array.filter(item => item[property] === value);
    }

    static sortByProperty(array, property, ascending = true) {
        return array.sort((a, b) => {
            if (ascending) {
                return a[property] > b[property] ? 1 : -1;
            } else {
                return a[property] < b[property] ? 1 : -1;
            }
        });
    }

    static groupByProperty(array, property) {
        return array.reduce((groups, item) => {
            const key = item[property];
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(item);
            return groups;
        }, {});
    }

    static uniqueByProperty(array, property) {
        const seen = new Set();
        return array.filter(item => {
            const value = item[property];
            if (seen.has(value)) {
                return false;
            }
            seen.add(value);
            return true;
        });
    }
}

// Template literals utility
export class TemplateUtils {
    static createCard(title, description, imageUrl, link) {
        return `
            <div class="card">
                <img src="${imageUrl}" alt="${title}" class="card-image">
                <div class="card-content">
                    <h3 class="card-title">${title}</h3>
                    <p class="card-description">${description}</p>
                    <a href="${link}" class="card-link">Learn More</a>
                </div>
            </div>
        `;
    }

    static createListItem(item, properties) {
        const propertyElements = properties.map(prop => 
            `<span class="item-${prop}">${item[prop]}</span>`
        ).join('');
        
        return `
            <li class="dynamic-item" data-id="${item.id || ''}">
                ${propertyElements}
            </li>
        `;
    }

    static createModal(id, title, content) {
        return `
            <div id="${id}" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <span class="modal-close">&times;</span>
                    </div>
                    <div class="modal-body">
                        ${content}
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize navigation when module is imported
if (typeof window !== 'undefined') {
    new Navigation();
}