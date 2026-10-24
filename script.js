// THALMAN Dynamic Logic Module
// Reactive State & Currency Engine

const thalmanStore = {
    state: {
        currency: 'EUR',
        rates: { EUR: 1, USD: 1.08, GBP: 0.85 },
        symbols: { EUR: '€', USD: '$', GBP: '£' },
        selections: {
            // Internal tracking for dynamic price/variant update
            '1': { id: '1', title: 'Product 001 | Structured Denim', variant: 'Charcoal Black', size: 'S', image: 'images/denim-charcoal.png', basePrice: 290 },
            '2': { id: '2', title: 'Product 002 | Heavyweight Hoodie', variant: 'Black', size: 'S', image: 'images/hoodie-black.png', basePrice: 220 }
        },
        cart: []
    },

    // UI Modules
    ui: {
        toggleBag: () => {
            document.getElementById('bagDrawer').classList.toggle('open');
            document.getElementById('drawerOverlay').classList.toggle('open');
        },
        openLightbox: (src) => {
            document.getElementById('lightboxImg').src = src;
            document.getElementById('lightbox').classList.add('active');
        },
        closeLightbox: () => {
            document.getElementById('lightbox').classList.remove('active');
        }
    }
};

// Expose UI functions to HTML globally
window.toggleBag = thalmanStore.ui.toggleBag;
window.openLightbox = thalmanStore.ui.openLightbox;
window.closeLightbox = thalmanStore.ui.closeLightbox;

// Core Functional Logic

function switchVariant(id, btnElement) {
    // Read dataset from HTML button
    const { color, img, title } = btnElement.dataset;
    
    // Update State
    thalmanStore.state.selections[id].variant = color;
    thalmanStore.state.selections[id].image = img;
    thalmanStore.state.selections[id].title = `${title} (${color})`;

    // Update DOM Image & Title
    document.getElementById(`img-${id}`).src = img;
    document.getElementById(`title-${id}`).innerText = thalmanStore.state.selections[id].title;

    // Toggle Active Class
    const parentOptions = btnElement.parentElement;
    parentOptions.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
}

function selectSize(id, btnElement) {
    const { size } = btnElement.dataset;
    thalmanStore.state.selections[id].size = size;

    const parentOptions = btnElement.parentElement;
    parentOptions.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
}

function addToBag(id, name) {
    const itemData = thalmanStore.state.selections[id];
    thalmanStore.state.cart.push({
        ...itemData, // Clone item data
        key: Date.now() // Unique key for remove function
    });
    updateBagCount();
    renderCart();
    toggleBag();
}

function removeFromBag(timestamp) {
    const itemIndex = thalmanStore.state.cart.findIndex(item => item.key === timestamp);
    thalmanStore.state.cart.splice(itemIndex, 1);
    updateBagCount();
    renderCart();
}

function updateBagCount() {
    document.getElementById('bagCount').innerText = thalmanStore.state.cart.length;
}

function renderCart() {
    const container = document.getElementById('drawerItems');
    const subtotalEl = document.getElementById('bagSubtotal');
    const symbol = thalmanStore.state.symbols[thalmanStore.state.currency];
    const rate = thalmanStore.state.rates[thalmanStore.state.currency];

    if (thalmanStore.state.cart.length === 0) {
        container.innerHTML = `<p style="color: #888; font-size: 0.8rem; text-align: center; margin-top: 40px;">Your bag is currently empty.</p>`;
        subtotalEl.innerText = `${symbol}0`;
        return;
    }

    let cartHtml = '';
    let cartSubtotalBase = 0;

    thalmanStore.state.cart.forEach((item) => {
        cartSubtotalBase += item.basePrice;
        const convertedItemPrice = Math.round(item.basePrice * rate);
        cartHtml += `
            <div class="bag-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="bag-item-details">
                    <div class="bag-item-title">${item.title}</div>
                    <div class="bag-item-meta">${item.variant} / Size ${item.size}</div>
                    <div class="bag-item-meta" style="color: #fff; margin-top: 4px; font-size: 0.75rem;">${symbol}${convertedItemPrice}</div>
                    <button class="bag-item-remove" onclick="removeFromBag(${item.key})">Remove</button>
                </div>
            </div>
        `;
    });

    const convertedTotal = Math.round(cartSubtotalBase * rate);
    container.innerHTML = cartHtml;
    subtotalEl.innerText = `${symbol}${convertedTotal}`;
}

function updateCurrency() {
    thalmanStore.state.currency = document.getElementById('currencySelector').value;
    const symbol = thalmanStore.state.symbols[thalmanStore.state.currency];
    const rate = thalmanStore.state.rates[thalmanStore.state.currency];

    // Update main product prices
    document.querySelectorAll('.product-price').forEach((el) => {
        const base = parseFloat(el.dataset.basePrice);
        const converted = Math.round(base * rate);
        el.innerText = `${symbol}${converted}`;
    });

    // Re-render cart with new currency
    renderCart();
}

// Security simulation function
function checkoutSimulation() {
    alert('Accessing THALMAN encrypted gateway... Simulation initialized. (Functional backend link required for processing).');
}

// Ensure DOM is ready for currency initial load
document.addEventListener('DOMContentLoaded', () => {
    // Initial data refresh, ensures cart is synced
    renderCart();
});
