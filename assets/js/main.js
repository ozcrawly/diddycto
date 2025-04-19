// main.js

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Exclude Bootstrap components
        if (!this.getAttribute('data-bs-toggle')) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Adjust for navbar height
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without scrolling
                history.pushState(null, null, targetId);
            }
        }
    });
});


// Copy Address Functionality
function copyAddress() {
    const address = '5QQRKwnJsoy5MHbYvUe1zgtNUGhesQ5SErQvnAZgpump';
    navigator.clipboard.writeText(address)
        .then(() => {
            const copyBtn = document.querySelector('.copy-btn');
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.classList.add('copied');
            
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
                copyBtn.classList.remove('copied');
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy address. Please try again.');
        });
}

// Mobile Menu Close on Click
document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
            document.querySelector('.navbar-toggler').click();
        }
    });
});

// Prevent Flash of Unstyled Content
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// Optional: Add loading animation for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
});

// Optional: Add scroll animation for elements
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((element) => {
    observer.observe(element);
});



// Market Data Functions
const TOKEN_ADDRESS = '5QQRKwnJsoy5MHbYvUe1zgtNUGhesQ5SErQvnAZgpump';

async function fetchMarketData() {
    try {
        const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN_ADDRESS}`);
        const data = await response.json();
        
        if (data.pairs && data.pairs.length > 0) {
            const pair = data.pairs[0]; // Get the main pair
            updateUI(pair);
        }
    } catch (error) {
        console.error('Error fetching market data:', error);
        displayError();
    }
}

function updateUI(pairData) {
    // Update Price
    const priceElement = document.getElementById('tokenPrice');
    const priceChangeElement = document.getElementById('priceChange');
    const mcapElement = document.getElementById('marketCap');
    const liquidityElement = document.getElementById('liquidity');

    if (pairData.priceUsd) {
        priceElement.textContent = `$${parseFloat(pairData.priceUsd).toFixed(12)}`;
    }

    if (pairData.marketCap) {
        mcapElement.textContent = formatCurrency(pairData.marketCap);
    }

    if (pairData.liquidity?.usd) {
        liquidityElement.textContent = formatCurrency(pairData.liquidity.usd);
    }
}

function formatCurrency(value) {
    if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
}

function displayError() {
    const elements = ['tokenPrice', 'marketCap', 'liquidity'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        element.textContent = 'Error loading data';
        element.classList.add('error');
    });
}

// Fetch data initially and set up refresh interval
document.addEventListener('DOMContentLoaded', () => {
    fetchMarketData();
    // Refresh every 30 seconds
    setInterval(fetchMarketData, 30000);
});


// Show disclaimer on every page load
document.addEventListener('DOMContentLoaded', function() {
    const disclaimerModal = new bootstrap.Modal(document.getElementById('disclaimerModal'), {
        backdrop: 'static',  // Prevents closing by clicking outside
        keyboard: false      // Prevents closing with keyboard
    });
    disclaimerModal.show();
});