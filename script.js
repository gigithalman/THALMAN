class ThalmanApp {
    constructor() {
        this.currency = 'EUR';
        this.rates = { EUR: 1, USD: 1.08, GBP: 0.85 };
        this.symbols = { EUR: '€', USD: '$', GBP: '£' };
        this.shippingRates = { DE: 5, ES: 8, FR: 9, GB: 10, UA: 12, US: 18 };
        this.activeId = null;
        this.cart = [];

        this.database = {
            '1': {
                name: 'Product 001 | Structured Denim',
                desc: 'Engineered with anatomical curved seam paneling and reinforced rivet construction. Cut from raw 14.5 oz Japanese selvedge denim.',
                basePrice: 290,
                img: 'images/denim-charcoal.png',
                variants: [
                    { color: 'Charcoal Black', img: 'images/denim-charcoal.png' },
                    { color: 'Medium Wash Blue', img: 'images/denim-blue.png' }
                ],
                specs: [
                    { label: 'Material', value: '100% Japanese Selvedge Cotton' },
                    { label: 'Weight', value: '14.5 OZ Heavyweight Rigid Denim' },
                    { label: 'Origin', value: 'Crafted in EU' }
                ]
            },
            '2': {
                name: 'Product 002 | Heavyweight Hoodie',
                desc: 'Custom drop-shoulder heavyweight hoodie crafted from 480 GSM organic French Terry cotton with tonal star emblem embroidery.',
                basePrice: 220,
                img: 'images/hoodie-black.png',
                variants: [
                    { color: 'Black', img: 'images/hoodie-black.png' },
                    { color: 'White', img: 'images/hoodie-white.png' }
                ],
                specs: [
                    { label: 'Material', value: '100% Combed Organic Cotton' },
                    { label: 'Weight', value: '480 GSM French Terry' },
                    { label: 'Origin', value: 'Crafted in EU' }
                ]
            },
            '3': {
                name: 'Product 003 | Germany Edition Kit',
                desc: 'Jacquard knit performance match jersey engineered with breathable moisture-wicking weave and custom national emblem detailing.',
                basePrice: 180,
                img: 'images/germany.png',
                specs: [
                    { label: 'Fabric', value: 'Jacquard Knit Technical Polyester' },
                    { label: 'Customization', value: '10p per character name/number print' },
                    { label: 'Origin', value: 'Crafted in EU' }
                ]
            },
            '4': {
                name: 'Product 004 | Spain Edition Kit',
                desc: 'Jacquard knit performance match jersey engineered with breathable moisture-wicking weave and custom national emblem detailing.',
                basePrice: 180,
                img: 'images/spain.png',
                specs: [
                    { label: 'Fabric', value: 'Jacquard Knit Technical Polyester' },
                    { label: 'Customization', value: '10p per character name/number print' },
                    { label: 'Origin', value: 'Crafted in EU' }
                ]
            },
            '5': {
                name: 'Product 005 | England Edition Kit',
                desc: 'Jacquard knit performance match jersey engineered with breathable moisture-wicking weave and custom national emblem detailing.',
                basePrice: 180,
                img: 'images/england.png',
                specs: [
                    { label: 'Fabric', value: 'Jacquard Knit Technical Polyester' },
                    { label: 'Customization', value: '10p per character name/number print' },
                    { label: 'Origin', value: 'Crafted in EU' }
                ]
            },
            '6': {
                name: 'Product 006 | Ukraine Edition Kit',
                desc: 'Jacquard knit performance match jersey engineered with breathable moisture-wicking weave and custom national emblem detailing.',
                basePrice: 180,
                img: 'images/ukraine.png',
                specs: [
                    { label: 'Fabric', value: 'Jacquard Knit Technical Polyester' },
                    { label: 'Customization', value: '10p per character name/number print' },
                    { label: 'Origin', value: 'Crafted in EU' }
                ]
            }
        };

        this.selections = {
            '1': { size: 'S', variant: 'Charcoal Black', img: 'images/denim-charcoal.png', customName: '', customNum: '10' },
            '2': { size: 'S', variant: 'Black', img: 'images/hoodie-black.png', customName: '', customNum: '10' },
            '3': { size: 'S', variant: '', img: 'images/germany.png', customName: '', customNum: '10' },
            '4': { size: 'S', variant: '', img: 'images/spain.png', customName: '', customNum: '10' },
            '5': { size: 'S', variant: '', img: 'images/england.png', customName: '', customNum: '10' },
            '6': { size: 'S', variant: '', img: 'images/ukraine.png', customName: '', customNum: '10' }
        };
    }

    getDynamicPrice(id) {
        let price = this.database[id].basePrice;
        if (['3', '4', '5', '6'].includes(id)) {
            const len = (this.selections[id].customName || '').trim().length;
            price += len * 0.10;
        }
        return price;
    }

    openProduct(id) {
        this.activeId = id;
        const prod = this.database[id];
        const sel = this.selections[id];
        const symbol = this.symbols[this.currency];
        const rate = this.rates[this.currency];

        document.getElementById('pdpImg').src = sel.img || prod.img;
        document.getElementById('pdpTitle').innerText = prod.name;
        document.getElementById('pdpDesc').innerText = prod.desc;

        const currentPrice = this.getDynamicPrice(id);
        document.getElementById('pdpPrice').innerText = `${symbol}${(currentPrice * rate).toFixed(2)}`;

        // Customizer Box
        const customizer = document.getElementById('pdpCustomizer');
        if (['3', '4', '5', '6'].includes(id)) {
            customizer.style.display = 'block';
            document.getElementById('pdpCustomName').value = sel.customName;
            document.getElementById('pdpCustomNum').value = sel.customNum;
        } else {
            customizer.style.display = 'none';
        }

        // Color variants
        const colorGroup = document.getElementById('pdpColorGroup');
        if (prod.variants) {
            colorGroup.style.display = 'flex';
            let html = '';
            prod.variants.forEach(v => {
                const active = v.color === sel.variant ? 'active' : '';
                html += `<button class="opt-btn ${active}" onclick="thalmanApp.selectVariant('${id}', '${v.color}', '${v.img}', this)">${v.color}</button>`;
            });
            document.getElementById('pdpColorOptions').innerHTML = html;
        } else {
            colorGroup.style.display = 'none';
        }

        // Specs
        let specHtml = '';
        prod.specs.forEach(s => {
            specHtml += `<div class="spec-spec-row" style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.75rem;"><span style="color:var(--text-muted);">${s.label}</span><span>${s.value}</span></div>`;
        });
        document.getElementById('pdpSpecs').innerHTML = specHtml;

        document.getElementById('catalogView').style.display = 'none';
        document.getElementById('productDetailView').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showCatalog() {
        document.getElementById('productDetailView').style.display = 'none';
        document.getElementById('catalogView').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    selectSize(size, btn) {
        const sel = this.selections[this.activeId];
        sel.size = size;
        btn.parentElement.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    selectVariant(id, color, img, btn) {
        this.selections[id].variant = color;
        this.selections[id].img = img;
        document.getElementById('pdpImg').src = img;
        btn.parentElement.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    }

    updateCustomization() {
        const id = this.activeId;
        const nameVal = document.getElementById('pdpCustomName').value.toUpperCase();
        const numVal = document.getElementById('pdpCustomNum').value;

        this.selections[id].customName = nameVal;
        this.selections[id].customNum = numVal;

        const symbol = this.symbols[this.currency];
        const rate = this.rates[this.currency];
        const price = this.getDynamicPrice(id);
        document.getElementById('pdpPrice').innerText = `${symbol}${(price * rate).toFixed(2)}`;
    }

    addToBagFromPDP() {
        const id = this.activeId;
        const prod = this.database[id];
        const sel = this.selections[id];
        const price = this.getDynamicPrice(id);

        this.cart.push({
            id: id,
            title: prod.name,
            price: price,
            size: sel.size,
            variant: sel.variant,
            img: sel.img || prod.img,
            customName: sel.customName,
            customNum: sel.customNum,
            key: Date.now()
        });

        this.updateBagCount();
        this.renderCart();
        this.toggleBag();
    }

    quickAdd(id) {
        const prod = this.database[id];
        const sel = this.selections[id];
        const price = this.getDynamicPrice(id);

        this.cart.push({
            id: id,
            title: prod.name,
            price: price,
            size: sel.size,
            variant: sel.variant,
            img: sel.img || prod.img,
            customName: '',
            customNum: '10',
            key: Date.now()
        });

        this.updateBagCount();
        this.renderCart();
        this.toggleBag();
    }

    removeFromBag(key) {
        this.cart = this.cart.filter(item => item.key !== key);
        this.updateBagCount();
        this.renderCart();
    }

    updateBagCount() {
        document.getElementById('bagCount').innerText = this.cart.length;
    }

    renderCart() {
        const container = document.getElementById('drawerItems');
        const subtotalEl = document.getElementById('bagSubtotal');
        const symbol = this.symbols[this.currency];
        const rate = this.rates[this.currency];

        if (this.cart.length === 0) {
            container.innerHTML = `<p style="color: var(--text-muted); font-size: 0.8rem; text-align: center; margin-top: 40px;">Your bag is currently empty.</p>`;
            subtotalEl.innerText = `${symbol}0`;
            return;
        }

        let html = '';
        let subtotal = 0;

        this.cart.forEach(item => {
            subtotal += item.price;
            const convertedPrice = Math.round(item.price * rate);
            const printInfo = item.customName ? `<div class="bag-item-meta" style="color: #4caf50;">Print: ${item.customName} #${item.customNum}</div>` : '';

            html += `
                <div class="bag-item">
                    <img src="${item.img}" alt="${item.title}">
                    <div class="bag-item-details">
                        <div class="bag-item-title">${item.title}</div>
                        <div class="bag-item-meta">${item.variant ? item.variant + ' / ' : ''}Size ${item.size}</div>
                        ${printInfo}
                        <div class="bag-item-meta" style="color: var(--text-main); margin-top: 4px; font-size: 0.75rem;">${symbol}${convertedPrice}</div>
                        <button class="bag-item-remove" onclick="thalmanApp.removeFromBag(${item.key})">Remove</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
        subtotalEl.innerText = `${symbol}${Math.round(subtotal * rate)}`;
    }

    toggleBag() {
        document.getElementById('bagDrawer').classList.toggle('open');
        document.getElementById('drawerOverlay').classList.toggle('open');
    }

    updateCurrency() {
        this.currency = document.getElementById('currencySelector').value;
        const symbol = this.symbols[this.currency];
        const rate = this.rates[this.currency];

        document.querySelectorAll('.product-price').forEach(el => {
            const base = parseFloat(el.dataset.base);
            el.innerText = `${symbol}${Math.round(base * rate)}`;
        });

        if (this.activeId) {
            const price = this.getDynamicPrice(this.activeId);
            document.getElementById('pdpPrice').innerText = `${symbol}${(price * rate).toFixed(2)}`;
        }

        this.renderCart();
    }

    toggleTheme() {
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

    openLightbox(src) {
        document.getElementById('lightboxImg').src = src;
        document.getElementById('lightbox').classList.add('active');
    }

    closeLightbox() {
        document.getElementById('lightbox').classList.remove('active');
    }

    openSizeChart() {
        document.getElementById('sizeChartModal').classList.add('open');
        document.getElementById('sizeChartOverlay').classList.add('open');
        document.getElementById('sizeTable').innerHTML = `
            <tr><th>Size</th><th>Chest</th><th>Length</th></tr>
            <tr><td>XS</td><td>104 cm</td><td>68 cm</td></tr>
            <tr><td>S</td><td>110 cm</td><td>70 cm</td></tr>
            <tr><td>M</td><td>116 cm</td><td>72 cm</td></tr>
            <tr><td>L</td><td>122 cm</td><td>74 cm</td></tr>
        `;
    }

    closeSizeChart() {
        document.getElementById('sizeChartModal').classList.remove('open');
        document.getElementById('sizeChartOverlay').classList.remove('open');
    }

    openFitModal() {
        document.getElementById('fitModal').classList.add('open');
        document.getElementById('fitOverlay').classList.add('open');
    }

    closeFitModal() {
        document.getElementById('fitModal').classList.remove('open');
        document.getElementById('fitOverlay').classList.remove('open');
    }

    calculateFit() {
        const h = parseFloat(document.getElementById('fitHeight').value);
        const w = parseFloat(document.getElementById('fitWeight').value);
        let rec = 'S';
        if (h > 180 || w > 85) rec = 'L';
        else if (h > 172 || w > 72) rec = 'M';
        else if (h < 165) rec = 'XS';

        document.getElementById('fitOutput').innerText = rec;
        document.getElementById('fitResult').style.display = 'block';
    }

    openCheckout() {
        if (this.cart.length === 0) {
            alert('Your bag is empty.');
            return;
        }
        this.toggleBag();
        this.updateCheckoutTotal();
        document.getElementById('checkoutModal').classList.add('open');
        document.getElementById('checkoutOverlay').classList.add('open');
    }

    closeCheckout() {
        document.getElementById('checkoutModal').classList.remove('open');
        document.getElementById('checkoutOverlay').classList.remove('open');
    }

    updateCheckoutTotal() {
        const country = document.getElementById('checkoutCountry').value;
        const shipEUR = this.shippingRates[country] || 10;
        const symbol = this.symbols[this.currency];
        const rate = this.rates[this.currency];

        let subtotal = 0;
        this.cart.forEach(i => subtotal += i.price);

        const convSub = Math.round(subtotal * rate);
        const convShip = Math.round(shipEUR * rate);

        document.getElementById('summarySubtotal').innerText = `${symbol}${convSub}`;
        document.getElementById('summaryShipping').innerText = `${symbol}${convShip}`;
        document.getElementById('summaryTotal').innerText = `${symbol}${convSub + convShip}`;
    }

    processPayment(e) {
        e.preventDefault();
        document.getElementById('checkoutForm').style.display = 'none';
        document.getElementById('paymentSuccess').style.display = 'block';
        this.cart = [];
        this.updateBagCount();
        this.renderCart();
    }

    handleNewsletter(e) {
        e.preventDefault();
        const input = document.getElementById('subscriberEmail');
        if (input.value) {
            document.getElementById('newsletterSuccess').style.display = 'block';
            input.value = '';
            setTimeout(() => { document.getElementById('newsletterSuccess').style.display = 'none'; }, 5000);
        }
    }
}

const thalmanApp = new ThalmanApp();

document.addEventListener('DOMContentLoaded', () => {
    thalmanApp.updateBagCount();
});
