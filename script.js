const thalmanStore = {
    state: {
        currency: 'EUR',
        rates: { EUR: 1, USD: 1.08, GBP: 0.85 },
        symbols: { EUR: '€', USD: '$', GBP: '£' },
        selections: {
            '1': { id: '1', title: 'Product 001 | Structured Denim', variant: 'Charcoal Black', size: 'S', image: 'images/denim-charcoal.png', basePrice: 290 },
            '2': { id: '2', title: 'Product 002 | Heavyweight Hoodie', variant: 'Black', size: 'S', image: 'images/hoodie-black.png', basePrice: 220 }
        },
        cart: []
    },
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

window.toggleBag = thalmanStore.ui.toggleBag;
window.openLightbox = thalmanStore.ui.openLightbox;
window.closeLightbox = thalmanStore.ui.closeLightbox;

// Light / Dark Mode Toggle
function toggleTheme() {
    const html = document.documentElement;
    const btn = document.getElementById('themeToggleBtn');
    if (html.getAttribute('data-theme') === 'dark') {
        html.setAttribute('data-theme', 'light');
        btn.innerText = 'Dark Mode';
    } else {
        html.setAttribute('data-theme', 'dark');
        btn.innerText = 'Light Mode';
    }
}

// Live User Simulation Counter
function initLiveCounter() {
    let count = Math.floor(Math.random() * 8) + 12; // Start between 12-19
    const counterEl = document.getElementById('userCount');
    if(counterEl) {
        counterEl.innerText = count;
        setInterval(() => {
            const fluctuation = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
            count = Math.max(8, count + fluctuation);
            counterEl.innerText = count;
        }, 5000);
    }
}

// Newsletter Signup Handler
function handleNewsletter(event) {
    event.preventDefault();
    const emailInput = document.getElementById('subscriberEmail');
    const successMsg = document.getElementById('newsletterSuccess');
    if(emailInput.value) {
        successMsg.style.display = 'block';
        emailInput.value = '';
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 5000);
    }
}

function switchVariant(id, btnElement) {
    const { color, img, title } = btnElement.dataset;
    thalmanStore.state.selections[id].variant = color;
    thalmanStore.state.selections[id].image = img;
    thalmanStore.state.selections[id].title = `${title} (${color})`;

    document.getElementById(`img-${id}`).src = img;
    document.getElementById(`title-${id}`).innerText = thalmanStore.state.selections[id].title;

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
    thalmanStore.state.cart.push({ ...itemData, key: Date.now() });
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
        container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.8rem; text-align: center; margin-top: 40px;">Your bag is currently empty.</p>`;
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
                    <div class="bag-item-meta" style="color: var(--text-main); margin-top: 4px; font-size: 0.75rem;">${symbol}${convertedItemPrice}</div>
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

    document.querySelectorAll('.product-price').forEach((el) => {
        const base = parseFloat(el.dataset.basePrice);
        const converted = Math.round(base * rate);
        el.innerText = `${symbol}${converted}`;
    });

    renderCart();
}

function checkoutSimulation() {
    alert('Accessing THALMAN encrypted gateway... Simulation initialized.');
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    initLiveCounter();
});
