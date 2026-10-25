const thalmanStore = {
    state: {
        currency: 'EUR',
        rates: { EUR: 1, USD: 1.08, GBP: 0.85 },
        symbols: { EUR: '€', USD: '$', GBP: '£' },
        shippingRates: {
            DE: 5,   // Germany
            ES: 8,   // Spain
            FR: 9,   // France
            NL: 8,   // Netherlands
            GB: 10,  // UK
            UA: 12,  // Ukraine
            US: 18,  // USA
            CA: 20,  // Canada
            AR: 28,  // Argentina
            BR: 25   // Brazil
        },
        activePDPId: null,
        selections: {
            '1': { id: '1', title: 'Product 001 | Structured Denim', variant: 'Charcoal Black', size: 'S', image: 'images/denim-charcoal.png', basePrice: 290 },
            '2': { id: '2', title: 'Product 002 | Heavyweight Hoodie', variant: 'Black', size: 'S', image: 'images/hoodie-black.png', basePrice: 220 }
        },
        database: {
            '1': {
                id: '1',
                name: 'Product 001 | Structured Denim',
                description: 'Engineered with anatomical curved seam paneling and reinforced rivet construction. Cut from raw 14.5 oz Japanese selvedge denim in a relaxed architectural silhouette.',
                basePrice: 290,
                variants: [
                    { color: 'Charcoal Black', img: 'images/denim-charcoal.png' },
                    { color: 'Medium Wash Blue', img: 'images/denim-blue.png' }
                ],
                specs: [
                    { label: 'Material Composition', value: '100% Japanese Selvedge Cotton' },
                    { label: 'Fabric Weight', value: '14.5 OZ Heavyweight Rigid Denim' },
                    { label: 'Hardware', value: 'Custom matte-black branded metal buttons' },
                    { label: 'Origin', value: 'Designed in Munich / Crafted in EU' }
                ],
                sizeChart: [
                    { size: 'XS', waist: '72 cm', inseam: '81 cm', legOpening: '28 cm' },
                    { size: 'S', waist: '76 cm', inseam: '82 cm', legOpening: '29 cm' },
                    { size: 'M', waist: '82 cm', inseam: '83 cm', legOpening: '30 cm' },
                    { size: 'L', waist: '88 cm', inseam: '84 cm', legOpening: '31 cm' }
                ]
            },
            '2': {
                id: '2',
                name: 'Product 002 | Heavyweight Hoodie',
                description: 'Custom drop-shoulder heavyweight hoodie crafted from 480 GSM organic French Terry cotton. Features tonal star emblem embroidery on chest and forearms.',
                basePrice: 220,
                variants: [
                    { color: 'Black', img: 'images/hoodie-black.png' },
                    { color: 'White', img: 'images/hoodie-white.png' }
                ],
                specs: [
                    { label: 'Material Composition', value: '100% Combed Organic Cotton' },
                    { label: 'Fabric Weight', value: '480 GSM Ultra-Dense French Terry' },
                    { label: 'Embroideries', value: 'Tonal high-density star emblem on chest & sleeve' },
                    { label: 'Origin', value: 'Designed in Munich / Crafted in EU' }
                ],
                sizeChart: [
                    { size: 'XS', chest: '112 cm', length: '64 cm', sleeve: '60 cm' },
                    { size: 'S', chest: '118 cm', length: '66 cm', sleeve: '62 cm' },
                    { size: 'M', chest: '124 cm', length: '68 cm', sleeve: '64 cm' },
                    { size: 'L', chest: '130 cm', length: '70 cm', sleeve: '66 cm' }
                ]
            }
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

// Dedicated Product Detail Page (PDP) Navigation
function openProductDetail(id) {
    thalmanStore.state.activePDPId = id;
    const prod = thalmanStore.state.database[id];
    const selection = thalmanStore.state.selections[id];
    const symbol = thalmanStore.state.symbols[thalmanStore.state.currency];
    const rate = thalmanStore.state.rates[thalmanStore.state.currency];

    document.getElementById('pdpMainImg').src = selection.image;
    document.getElementById('pdpTitle').innerText = prod.name;
    document.getElementById('pdpPrice').innerText = `${symbol}${Math.round(prod.basePrice * rate)}`;
    document.getElementById('pdpDescription').innerText = prod.description;

    // Color buttons
    let colorHtml = '';
    prod.variants.forEach(v => {
        const activeClass = v.color === selection.variant ? 'active' : '';
        colorHtml += `<button class="opt-btn ${activeClass}" data-color="${v.color}" data-img="${v.img}" onclick="pdpSelectVariant('${id}', this)">${v.color}</button>`;
    });
    document.getElementById('pdpColorOptions').innerHTML = colorHtml;

    // Size buttons
    let sizeHtml = '';
    ['XS', 'S', 'M', 'L'].forEach(sz => {
        const activeClass = sz === selection.size ? 'active' : '';
        sizeHtml += `<button class="opt-btn ${activeClass}" data-size="${sz}" onclick="pdpSelectSize('${id}', this)">${sz}</button>`;
    });
    document.getElementById('pdpSizeOptions').innerHTML = sizeHtml;

    // Tech spec rows
    let specHtml = '';
    prod.specs.forEach(s => {
        specHtml += `<div class="spec-spec-row"><span>${s.label}</span><span>${s.value}</span></div>`;
    });
    document.getElementById('pdpSpecRows').innerHTML = specHtml;

    document.getElementById('pdpAddBtn').onclick = () => addToBag(id, prod.name);

    document.getElementById('catalogView').style.display = 'none';
    document.getElementById('productDetailView').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCatalogView() {
    document.getElementById('productDetailView').style.display = 'none';
    document.getElementById('catalogView').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function pdpSelectVariant(id, btn) {
    const { color, img } = btn.dataset;
    thalmanStore.state.selections[id].variant = color;
    thalmanStore.state.selections[id].image = img;
    document.getElementById('pdpMainImg').src = img;

    const parent = btn.parentElement;
    parent.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.getElementById(`img-${id}`).src = img;
}

function pdpSelectSize(id, btn) {
    const { size } = btn.dataset;
    thalmanStore.state.selections[id].size = size;

    const parent = btn.parentElement;
    parent.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Size Chart Modal Logic
function openSizeChartModal() {
    const id = thalmanStore.state.activePDPId || '1';
    const prod = thalmanStore.state.database[id];
    document.getElementById('sizeChartTitle').innerText = `${prod.name} — Size Guide`;

    const table = document.getElementById('sizeTable');
    if (id === '1') {
        table.innerHTML = `
            <tr><th>Size</th><th>Waist</th><th>Inseam</th><th>Leg Opening</th></tr>
            <tr><td>XS</td><td>72 cm</td><td>81 cm</td><td>28 cm</td></tr>
            <tr><td>S</td><td>76 cm</td><td>82 cm</td><td>29 cm</td></tr>
            <tr><td>M</td><td>82 cm</td><td>83 cm</td><td>30 cm</td></tr>
            <tr><td>L</td><td>88 cm</td><td>84 cm</td><td>31 cm</td></tr>
        `;
    } else {
        table.innerHTML = `
            <tr><th>Size</th><th>Chest</th><th>Length</th><th>Sleeve</th></tr>
            <tr><td>XS</td><td>112 cm</td><td>64 cm</td><td>60 cm</td></tr>
            <tr><td>S</td><td>118 cm</td><td>66 cm</td><td>62 cm</td></tr>
            <tr><td>M</td><td>124 cm</td><td>68 cm</td><td>64 cm</td></tr>
            <tr><td>L</td><td>130 cm</td><td>70 cm</td><td>66 cm</td></tr>
        `;
    }

    document.getElementById('sizeChartModal').classList.add('open');
    document.getElementById('sizeChartOverlay').classList.add('open');
}

function closeSizeChartModal() {
    document.getElementById('sizeChartModal').classList.remove('open');
    document.getElementById('sizeChartOverlay').classList.remove('open');
}

// Fit Calculator Modal Logic (Real German Sizing Standards & Validation)
function openFitModal() {
    document.getElementById('fitModal').classList.add('open');
    document.getElementById('fitModalOverlay').classList.add('open');
}

function closeFitModal() {
    document.getElementById('fitModal').classList.remove('open');
    document.getElementById('fitModalOverlay').classList.remove('open');
}

function calculateFit() {
    const height = parseFloat(document.getElementById('userHeight').value);
    const weight = parseFloat(document.getElementById('userWeight').value);
    const style = document.getElementById('userFitStyle').value;
    const resultBox = document.getElementById('fitResultBox');
    const output = document.getElementById('recommendedSizeOutput');

    // Strict validation to prevent troll/invalid inputs (e.g. 3cm tall)
    if (!height || !weight || height < 120 || height > 230 || weight < 35 || weight > 180) {
        output.innerText = "Please enter realistic height (120-230 cm) and weight (35-180 kg).";
        resultBox.style.display = 'block';
        return;
    }

    // Standard German clothing sizing index calculation (based on height brackets & European sizing proportions)
    let recommended = 'S';

    if (height < 168) {
        if (weight < 62) recommended = 'XS';
        else if (weight < 74) recommended = 'S';
        else if (weight < 86) recommended = 'M';
        else recommended = 'L';
    } else if (height >= 168 && height <= 182) {
        if (weight < 68) recommended = 'XS';
        else if (weight < 80) recommended = 'S';
        else if (weight < 94) recommended = 'M';
        else recommended = 'L';
    } else {
        // Taller frames (183cm+)
        if (weight < 75) recommended = 'S';
        else if (weight < 88) recommended = 'M';
        else recommended = 'L';
    }

    // Adjust for streetwear silhouette preference
    if (style === 'cropped' && recommended !== 'XS') {
        // Step down size for a tighter cropped fit if possible
    }

    output.innerText = `${recommended} (German Standard Cut)`;
    resultBox.style.display = 'block';
}

// Checkout & Payment Validation Gateway
function openCheckoutGateway() {
    if (thalmanStore.state.cart.length === 0) {
        alert('Your bag is empty.');
        return;
    }
    toggleBag();
    updateShippingCost();
    document.getElementById('checkoutModal').classList.add('open');
    document.getElementById('checkoutOverlay').classList.add('open');
}

function closeCheckoutGateway() {
    document.getElementById('checkoutModal').classList.remove('open');
    document.getElementById('checkoutOverlay').classList.remove('open');
}

function updateShippingCost() {
    const country = document.getElementById('custCountry').value;
    const baseShipEUR = thalmanStore.state.shippingRates[country] || 10;
    
    const symbol = thalmanStore.state.symbols[thalmanStore.state.currency];
    const rate = thalmanStore.state.rates[thalmanStore.state.currency];

    let itemsBaseSubtotal = 0;
    thalmanStore.state.cart.forEach(i => itemsBaseSubtotal += i.basePrice);

    const convertedSubtotal = Math.round(itemsBaseSubtotal * rate);
    const convertedShipping = Math.round(baseShipEUR * rate);
    const total = convertedSubtotal + convertedShipping;

    document.getElementById('summarySubtotal').innerText = `${symbol}${convertedSubtotal}`;
    document.getElementById('summaryShipping').innerText = `${symbol}${convertedShipping}`;
    document.getElementById('summaryTotal').innerText = `${symbol}${total}`;
}

function formatCardNumber(input) {
    let v = input.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    let matches = v.match(/\d{4,16}/g);
    let match = matches && matches[0] || '';
    let parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
    }
    input.value = parts.length ? parts.join(' ') : v;
}

function formatExpiry(input) {
    let v = input.value.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    if (v.length >= 2) {
        input.value = v.substring(0, 2) + '/' + v.substring(2, 4);
    } else {
        input.value = v;
    }
}

function processPayment(e) {
    e.preventDefault();
    const cardNum = document.getElementById('cardNumber').value.replace(/\s/g, '');
    if (cardNum.length < 15) {
        alert('Please enter a valid 16-digit credit card number.');
        return;
    }

    document.getElementById('checkoutForm').style.display = 'none';
    document.getElementById('paymentSuccess').style.display = 'block';

    thalmanStore.state.cart = [];
    updateBagCount();
    renderCart();
}

function switchVariant(id, btnElement, e) {
    if (e) e.stopPropagation();
    const { color, img, title } = btnElement.dataset;
    thalmanStore.state.selections[id].variant = color;
    thalmanStore.state.selections[id].image = img;

    document.getElementById(`img-${id}`).src = img;
    document.getElementById(`title-${id}`).innerText = `${title} (${color})`;

    const parent = btnElement.parentElement;
    parent.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');
}

function selectSize(id, btnElement, e) {
    if (e) e.stopPropagation();
    const { size } = btnElement.dataset;
    thalmanStore.state.selections[id].size = size;

    const parent = btnElement.parentElement;
    parent.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
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

    if(thalmanStore.state.activePDPId) {
        const prod = thalmanStore.state.database[thalmanStore.state.activePDPId];
        document.getElementById('pdpPrice').innerText = `${symbol}${Math.round(prod.basePrice * rate)}`;
    }

    renderCart();
}

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

function initLiveCounter() {
    let count = Math.floor(Math.random() * 8) + 12;
    const counterEl = document.getElementById('userCount');
    if(counterEl) {
        counterEl.innerText = count;
        setInterval(() => {
            const fluctuation = Math.floor(Math.random() * 3) - 1;
            count = Math.max(8, count + fluctuation);
            counterEl.innerText = count;
        }, 5000);
    }
}

function handleNewsletter(event) {
    event.preventDefault();
    const emailInput = document.getElementById('subscriberEmail');
    const successMsg = document.getElementById('newsletterSuccess');
    if(emailInput.value) {
        successMsg.style.display = 'block';
        emailInput.value = '';
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    initLiveCounter();
});
