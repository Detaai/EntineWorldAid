// Entine Store - Magical Enhanced Version ✨
console.log('🏰 Loading Entine Store - Magical Edition...');

// Initialize EmailJS for notifications
(function(){
    emailjs.init("YOUR_PUBLIC_KEY"); // You'll need to replace this with your EmailJS public key
})();

// Wait for page to load completely
window.addEventListener('load', function() {
    console.log('✨ Page fully loaded, initializing magical store...');
    initializeStore();
    initializeMagicalFeatures();
});

function initializeStore() {
    const productContainer = document.getElementById('product-container');
    
    if (!productContainer) {
        console.error('❌ Product container not found!');
        return;
    }

    // Enhanced product data with magical descriptions
    const products = [
        {
            id: 1,
            title: "⚔️ Entine: Quest for the Soul Stone",
            category: "books",
            price: "📖 Hardcover $25 • 📚 Paperback $20 • 💎 Kindle $9.99",
            image: "https://m.media-amazon.com/images/I/61QknGCPtBL._SY466_.jpg",
            link: "https://www.amazon.com/Entine-Quest-Stone-Caleb-Jones/dp/B0F8VB6K6Z/ref=sr_1_1?sr=8-1",
            available: true,
            description: "Begin the legendary quest that started it all!"
        },
        {
            id: 2,
            title: "🗡️ Entine Book 2: The Crystal Wars",
            category: "books",
            price: "💰 $24.99",
            image: "https://via.placeholder.com/300x400/1a1a2e/ffd700?text=🗡️+Crystal+Wars",
            link: "#",
            available: false,
            description: "The saga continues with epic crystal battles!"
        },
        {
            id: 3,
            title: "🌟 Entine Book 3: Realm of Shadows",
            category: "books",
            price: "💰 $24.99",
            image: "https://via.placeholder.com/300x400/2c3e50/ffd700?text=🌟+Shadows",
            link: "#",
            available: false,
            description: "Venture into the mysterious shadow realm!"
        },
        {
            id: 4,
            title: "⚡ Entine Book 4: Lightning Prophecy",
            category: "books",
            price: "💰 $24.99",
            image: "https://via.placeholder.com/300x400/8e44ad/ffd700?text=⚡+Lightning",
            link: "#",
            available: false,
            description: "Ancient prophecies come to life!"
        },
        {
            id: 5,
            title: "🔥 Entine Book 5: Dragon's Awakening",
            category: "books",
            price: "💰 $24.99",
            image: "https://via.placeholder.com/300x400/e74c3c/ffd700?text=🔥+Dragons",
            link: "#",
            available: false,
            description: "Dragons rise from their eternal slumber!"
        },
        {
            id: 6,
            title: "❄️ Entine Book 6: Frozen Kingdoms",
            category: "books",
            price: "💰 $24.99",
            image: "https://via.placeholder.com/300x400/3498db/ffd700?text=❄️+Frozen",
            link: "#",
            available: false,
            description: "Journey through icy magical realms!"
        },
        {
            id: 7,
            title: "🌸 Entine Book 7: Garden of Destiny",
            category: "books",
            price: "💰 $24.99",
            image: "https://via.placeholder.com/300x400/27ae60/ffd700?text=🌸+Garden",
            link: "#",
            available: false,
            description: "Where fate blooms eternal!"
        },
        {
            id: 8,
            title: "💫 Entine Book 8: Cosmic Gateway",
            category: "books",
            price: "💰 $24.99",
            image: "https://via.placeholder.com/300x400/9b59b6/ffd700?text=💫+Cosmic",
            link: "#",
            available: false,
            description: "Travel between worlds and dimensions!"
        },
        {
            id: 9,
            title: "👑 Entine Book 9: Crown of Eternity",
            category: "books",
            price: "💰 $24.99",
            image: "https://via.placeholder.com/300x400/f39c12/1a1a2e?text=👑+Crown",
            link: "#",
            available: false,
            description: "The epic conclusion to the legendary saga!"
        },
        {
            id: 10,
            title: "🏔️ Mystic Mountain Realm",
            category: "pictures",
            price: "🖼️ $49.99",
            image: "https://via.placeholder.com/300x400/34495e/ffd700?text=🏔️+Mountain+Art",
            link: "#",
            available: false,
            description: "Majestic peaks from the Entine world!"
        },
        {
            id: 11,
            title: "🌅 Enchanted Sunset Portal",
            category: "pictures",
            price: "🖼️ $39.99",
            image: "https://via.placeholder.com/300x400/e67e22/ffd700?text=🌅+Portal+Art",
            link: "#",
            available: false,
            description: "Magical gateways at twilight!"
        },
        {
            id: 12,
            title: "🎨 Abstract Magic Weaving",
            category: "pictures",
            price: "🖼️ $65.99",
            image: "https://via.placeholder.com/300x400/8e44ad/ffd700?text=🎨+Magic+Art",
            link: "#",
            available: false,
            description: "Pure magical energy captured in art!"
        },
        {
            id: 13,
            title: "🗺️ Ancient Quest Map",
            category: "pictures",
            price: "🖼️ $55.99",
            image: "https://via.placeholder.com/300x400/d4af37/1a1a2e?text=🗺️+Quest+Map",
            link: "#",
            available: false,
            description: "Navigate the lands of Entine!"
        },
        {
            id: 14,
            title: "🔖 Dragonhide Adventure Mark",
            category: "bookmarks",
            price: "📑 $19.99",
            image: "https://via.placeholder.com/300x400/8b4513/ffd700?text=🔖+Dragon+Mark",
            link: "#",
            available: false,
            description: "Forged from ancient dragon scales!"
        },
        {
            id: 15,
            title: "🌿 Elderwood Nature Mark",
            category: "bookmarks",
            price: "📑 $15.99",
            image: "https://via.placeholder.com/300x400/228b22/ffd700?text=🌿+Elder+Mark",
            link: "#",
            available: false,
            description: "Blessed by the forest spirits!"
        },
        {
            id: 16,
            title: "📜 Ancient Scroll Keeper",
            category: "bookmarks",
            price: "📑 $12.99",
            image: "https://via.placeholder.com/300x400/daa520/1a1a2e?text=📜+Scroll+Mark",
            link: "#",
            available: false,
            description: "Guard your place in ancient texts!"
        }
    ];

    // Store all products globally
    window.allProducts = products;
    
    // Render all products initially
    renderProducts(products);
    
    // Setup filter buttons
    setupFilters();
    
    console.log('🎉 Magical store initialized with', products.length, 'treasures');
}

function renderProducts(products) {
    const container = document.getElementById('product-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        if (!product.available) {
            card.classList.add('coming-soon');
        }
        
        // Add entrance animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}" onerror="this.src='https://via.placeholder.com/300x400/1a1a2e/ffd700?text=✨+Magical+Item'">
            <h2>${product.title}</h2>
            <p class="category">✨ ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
            <p style="color: #c9b037; font-style: italic; margin: 10px 0;">${product.description}</p>
            <p class="price">${product.price}</p>
            ${product.available ? 
                `<a href="${product.link}" target="_blank" class="buy-btn">🛒 Buy Now on Amazon</a>` :
                `<div class="coming-soon-badge">🔮 Coming Soon</div>
                 <button class="notify-btn" onclick="showMagicalAlert('${product.title}')">🔔 Notify Me</button>`
            }
        `;
        
        container.appendChild(card);
    });
}

function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add magical sparkle effect
            this.style.transform = 'scale(1.1)';
            setTimeout(() => this.style.transform = 'scale(1)', 200);
            
            // Remove active from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active to clicked button
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            if (category === 'donation') {
                showDonationSection();
            } else {
                hideDonationSection();
                if (category === 'all') {
                    renderProducts(window.allProducts);
                } else {
                    const filtered = window.allProducts.filter(product => product.category === category);
                    renderProducts(filtered);
                }
            }
        });
    });
}

function initializeMagicalFeatures() {
    // Newsletter signup
    const subscribeBtn = document.querySelector('.subscribe-btn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function() {
            const emailInput = document.querySelector('.magic-input');
            const email = emailInput.value;
            if (email && email.includes('@')) {
                showMagicalAlert('🎉 Welcome to the Quest! You\'ll be notified of new adventures!');
                emailInput.value = '';
            } else {
                showMagicalAlert('⚠️ Please enter a valid email address to join the quest!');
            }
        });
    }
    
    // Magical typewriter effect for title
    const title = document.querySelector('.magical-title');
    if (title && !title.dataset.animated) {
        title.dataset.animated = 'true';
        const text = title.textContent;
        title.textContent = '';
        title.style.borderRight = '3px solid gold';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                title.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    title.style.borderRight = 'none';
                }, 500);
            }
        };
        setTimeout(typeWriter, 1000);
    }
    
    // Add floating magical orbs
    createMagicalOrbs();
    
    // Add magical hover effects to cards
    document.addEventListener('mouseover', function(e) {
        if (e.target.closest('.product-card')) {
            const card = e.target.closest('.product-card');
            card.style.transform = 'translateY(-8px) scale(1.02)';
            
            // Add temporary magical sparkle
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                font-size: 1.5rem;
                animation: sparkleRotate 1s ease-in-out;
                pointer-events: none;
                z-index: 10;
            `;
            card.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) sparkle.remove();
            }, 1000);
        }
    });
    
    document.addEventListener('mouseout', function(e) {
        if (e.target.closest('.product-card')) {
            const card = e.target.closest('.product-card');
            card.style.transform = 'translateY(0) scale(1)';
        }
    });
}

function createMagicalOrbs() {
    const container = document.body;
    const colors = ['#ffd700', '#ff6b9d', '#c4b5fd', '#34d399', '#fbbf24'];
    
    for (let i = 0; i < 5; i++) {
        const orb = document.createElement('div');
        orb.className = 'magical-orb';
        orb.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, ${colors[i]}, transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 5;
            animation: floatOrb ${15 + i * 3}s infinite linear;
            left: ${Math.random() * 100}%;
            top: 100%;
            box-shadow: 0 0 20px ${colors[i]};
        `;
        container.appendChild(orb);
    }
}

function showMagicalAlert(message) {
    // Create custom magical alert
    const alertDiv = document.createElement('div');
    alertDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #1a1a2e, #16213e);
        border: 2px solid #ffd700;
        border-radius: 20px;
        padding: 30px;
        color: #ffd700;
        font-family: 'Cinzel', serif;
        font-size: 18px;
        z-index: 1000;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
        text-align: center;
        max-width: 400px;
    `;
    
    alertDiv.innerHTML = `
        <p>${message}</p>
        <button onclick="this.parentElement.remove()" style="
            background: linear-gradient(45deg, #ffd700, #ffed4e);
            color: #1a1a2e;
            border: none;
            padding: 10px 20px;
            border-radius: 15px;
            cursor: pointer;
            font-weight: bold;
            margin-top: 15px;
        ">✨ Understood</button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 5000);
}

// Donation System Functions
function showDonationSection() {
    const productContainer = document.getElementById('product-container');
    const donationSection = document.getElementById('donation-section');
    
    productContainer.style.display = 'none';
    donationSection.style.display = 'block';
    
    // Initialize donation functionality
    initializeDonationSystem();
}

function hideDonationSection() {
    const productContainer = document.getElementById('product-container');
    const donationSection = document.getElementById('donation-section');
    
    productContainer.style.display = 'grid';
    donationSection.style.display = 'none';
}

function initializeDonationSystem() {
    // Amount button selection
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.querySelector('.custom-amount');
    let selectedAmount = 0;
    
    amountButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            amountButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            selectedAmount = parseInt(this.getAttribute('data-amount'));
            customAmountInput.value = '';
            
            // Reinitialize PayPal if it's already shown
            const paypalContainer = document.getElementById('paypal-button-container');
            if (paypalContainer.style.display === 'block') {
                initializePayPal();
            }
        });
    });
    
    customAmountInput.addEventListener('input', function() {
        amountButtons.forEach(b => b.classList.remove('selected'));
        selectedAmount = parseFloat(this.value) || 0;
        
        // Reinitialize PayPal if it's already shown
        const paypalContainer = document.getElementById('paypal-button-container');
        if (paypalContainer.style.display === 'block') {
            initializePayPal();
        }
    });
    
    // Message character counter
    const messageTextarea = document.querySelector('.donation-message');
    const charCount = document.querySelector('.char-count');
    
    messageTextarea.addEventListener('input', function() {
        const count = this.value.length;
        charCount.textContent = `${count}/500 characters`;
        if (count > 450) {
            charCount.style.color = '#ff6b6b';
        } else {
            charCount.style.color = '#ffd700';
        }
    });
    
    // Payment method selection
    const paymentButtons = document.querySelectorAll('.payment-btn');
    const paypalContainer = document.getElementById('paypal-button-container');
    const cardForm = document.getElementById('card-form');
    
    paymentButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            paymentButtons.forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            
            const method = this.getAttribute('data-method');
            if (method === 'paypal') {
                paypalContainer.style.display = 'block';
                cardForm.style.display = 'none';
                initializePayPal();
            } else {
                paypalContainer.style.display = 'none';
                cardForm.style.display = 'block';
            }
        });
    });
    
    // Donate button for card payments
    const donateBtn = document.querySelector('.donate-btn');
    if (donateBtn) {
        donateBtn.addEventListener('click', function() {
            processDonation();
        });
    }
}

function initializePayPal() {
    // Initialize PayPal button with real integration
    const paypalContainer = document.getElementById('paypal-button-container');
    paypalContainer.innerHTML = ''; // Clear any existing content
    
    const amount = getSelectedAmount();
    if (amount <= 0) {
        paypalContainer.innerHTML = '<p style="color: #ffd700; text-align: center;">Please select an amount first</p>';
        return;
    }
    
    // PayPal Button (using test client-id for now - you'll need to replace with real one)
    paypal.Buttons({
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: amount.toString()
                    },
                    description: `Entine Quest Donation - $${amount}`
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Payment successful
                const donorName = document.querySelector('.donor-name').value || 'Anonymous Hero';
                const donorEmail = document.querySelector('.donor-email').value;
                const message = document.querySelector('.donation-message').value;
                
                // Send notification email
                sendNotificationEmail(donorName, donorEmail, amount, message, details.id);
                
                // Show success message
                showDonationSuccess(donorName, amount);
                clearDonationForm();
            });
        },
        onError: function(err) {
            console.error('PayPal Error:', err);
            showMagicalAlert('❌ Payment failed. Please try again.');
        }
    }).render('#paypal-button-container');
}

function processPayPalDonation() {
    const amount = getSelectedAmount();
    if (!validateDonation(amount)) return;
    
    const donorName = document.querySelector('.donor-name').value || 'Anonymous Hero';
    const donorEmail = document.querySelector('.donor-email').value;
    const message = document.querySelector('.donation-message').value;
    
    showMagicalAlert('🔄 Creating PayPal payment...');
    
    // Create PayPal payment
    fetch('/api/create-payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: amount,
            donorName: donorName,
            donorEmail: donorEmail,
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            // Redirect to PayPal
            const approvalUrl = data.links.find(link => link.rel === 'approve').href;
            window.location.href = approvalUrl;
        } else {
            showMagicalAlert('❌ Failed to create PayPal payment: ' + data.error);
        }
    })
    .catch(error => {
        console.error('PayPal payment error:', error);
        showMagicalAlert('❌ There was an error creating the PayPal payment. Please try again.');
    });
}

function processDonation() {
    const amount = getSelectedAmount();
    if (!validateDonation(amount)) return;
    
    const donorName = document.querySelector('.donor-name').value || 'Anonymous Hero';
    const donorEmail = document.querySelector('.donor-email').value;
    const message = document.querySelector('.donation-message').value;
    
    // For card payments, redirect to PayPal (most secure option)
    showMagicalAlert('🔄 Redirecting to secure PayPal checkout...');
    
    // Create a PayPal payment link
    const paypalUrl = `https://www.paypal.com/paypalme/detachedguf/${amount}`;
    
    // Send notification first
    sendNotificationEmail(donorName, donorEmail, amount, message, 'MANUAL_' + Date.now());
    
    // Open PayPal.me link
    window.open(paypalUrl, '_blank');
    
    // Show success message after short delay
    setTimeout(() => {
        showDonationSuccess(donorName, amount);
        clearDonationForm();
    }, 2000);
}

// Function to send notification email using EmailJS
function sendNotificationEmail(donorName, donorEmail, amount, message, transactionId) {
    const templateParams = {
        to_name: 'Entine Quest Author',
        to_email: 'your_email@example.com', // Replace with your email
        donor_name: donorName,
        donor_email: donorEmail,
        amount: amount,
        message: message || 'No message provided',
        transaction_id: transactionId,
        cashapp: '@detachedguf',
        phone: '(928) 716-1710'
    };
    
    // This would send via EmailJS (you need to set up an account)
    emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
        .then(function(response) {
            console.log('✅ Notification email sent!', response.status, response.text);
        }, function(error) {
            console.log('❌ Email failed...', error);
        });
}

function getSelectedAmount() {
    const customAmount = document.querySelector('.custom-amount').value;
    const selectedBtn = document.querySelector('.amount-btn.selected');
    
    if (customAmount) {
        return parseFloat(customAmount);
    } else if (selectedBtn) {
        return parseInt(selectedBtn.getAttribute('data-amount'));
    }
    return 0;
}

function validateDonation(amount) {
    if (amount <= 0) {
        showMagicalAlert('⚠️ Please select a donation amount');
        return false;
    }
    
    const email = document.querySelector('.donor-email').value;
    if (!email || !email.includes('@')) {
        showMagicalAlert('⚠️ Please enter a valid email address');
        return false;
    }
    
    return true;
}

function completeDonation(amount) {
    const donorName = document.querySelector('.donor-name').value || 'Anonymous Hero';
    const donorEmail = document.querySelector('.donor-email').value;
    const message = document.querySelector('.donation-message').value;
    
    // Send SMS to your phone (this would need a backend service)
    sendSMSNotification(donorName, amount, message);
    
    // Process payment to CashApp (this would need PayPal-to-CashApp integration)
    transferToCashApp(amount);
    
    // Show success message
    showDonationSuccess(donorName, amount);
    
    // Clear form
    clearDonationForm();
}

function sendSMSNotification(donorName, amount, message) {
    // This would use Twilio API or similar service
    console.log('📱 Sending SMS notification:', {
        to: 'YOUR_PHONE_NUMBER', // You'd replace this with your actual phone number
        message: `🎉 New Entine Quest donation from ${donorName}! Amount: $${amount}. Message: "${message || 'No message provided'}"`
    });
    
    // In a real implementation, this would make an API call to your backend
    // which would then use Twilio to send the SMS
}

function transferToCashApp(amount) {
    // This would use PayPal's API to transfer funds to your linked CashApp account
    console.log('💰 Transferring $' + amount + ' to CashApp');
    
    // In a real implementation, this would involve:
    // 1. PayPal payment completed
    // 2. Backend service transfers funds to your CashApp account
    // 3. Confirmation of transfer
}

function showDonationSuccess(donorName, amount) {
    showMagicalAlert(`
        🎉 Thank you, ${donorName}! 
        <br><br>Your $${amount} donation has been received and will help bring more Entine adventures to life! 
        <br><br>📱 A notification has been sent to the author
        <br>💰 Funds will be transferred to CashApp @detachedguf
        <br><br>You are now part of the Entine Quest legacy! ⚔️
    `);
}

function clearDonationForm() {
    document.querySelector('.donor-name').value = '';
    document.querySelector('.donor-email').value = '';
    document.querySelector('.donation-message').value = '';
    document.querySelector('.custom-amount').value = '';
    document.querySelector('.char-count').textContent = '0/500 characters';
    
    document.querySelectorAll('.amount-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.payment-btn').forEach(btn => btn.classList.remove('selected'));
    
    document.getElementById('paypal-button-container').style.display = 'none';
    document.getElementById('card-form').style.display = 'none';
}