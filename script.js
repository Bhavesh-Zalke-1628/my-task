document.addEventListener('DOMContentLoaded', function () {
    const products = [
        {
            id: 1,
            title: "Wireless Earbuds",
            currentPrice: 59.99,
            originalPrice: 79.99,
            options: {
                color: ["Black", "White", "Blue"],
                warranty: ["1 Year", "2 Years"]
            }
        },
        {
            id: 2,
            title: "Smart Watch",
            currentPrice: 99.99,
            originalPrice: 129.99,
            options: {
                size: ["Small", "Medium", "Large"],
                color: ["Black", "Silver", "Rose Gold"]
            }
        },
        {
            id: 3,
            title: "Bluetooth Speaker",
            currentPrice: 39.99,
            originalPrice: 49.99,
            options: {
                color: ["Red", "Blue", "Green"],
                version: ["Standard", "Pro"]
            }
        }
    ];

    const productContainer = document.getElementById('product-container');
    const cartSection = document.getElementById('cart-section');
    const totalPriceElement = document.getElementById('total-price');
    const addToCartButton = document.getElementById('add-to-cart');

    let selectedProducts = [];
    let totalPrice = 0;

    function renderProducts() {
        productContainer.innerHTML = '';

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.dataset.id = product.id;

            if (selectedProducts.some(p => p.id === product.id)) {
                productCard.classList.add('selected');
            }

            const checkboxContainer = document.createElement('label');
            checkboxContainer.className = 'checkbox-container';
            checkboxContainer.innerHTML = `
                <input type="checkbox" id="product-${product.id}" ${selectedProducts.some(p => p.id === product.id) ? 'checked' : ''}>
                <span class="checkmark"></span>
            `;

            const productHeader = document.createElement('div');
            productHeader.className = 'product-header';
            productHeader.innerHTML = `
                <div class="product-title">${product.title}</div>
                <div class="offer-badge">BOGO</div>
            `;

            const priceContainer = document.createElement('div');
            priceContainer.className = 'price-container';
            priceContainer.innerHTML = `
                <div class="current-price">$${product.currentPrice.toFixed(2)}</div>
                <div class="original-price">$${product.originalPrice.toFixed(2)}</div>
            `;

            const productOptions = document.createElement('div');
            productOptions.className = 'product-options';

            for (const [optionName, values] of Object.entries(product.options)) {
                const optionGroup = document.createElement('div');
                optionGroup.className = 'option-group';

                const optionLabel = document.createElement('div');
                optionLabel.className = 'option-label';
                optionLabel.textContent = optionName;

                const select = document.createElement('select');
                select.name = `${product.id}-${optionName}`;

                values.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = value;
                    select.appendChild(option);
                });

                optionGroup.appendChild(optionLabel);
                optionGroup.appendChild(select);
                productOptions.appendChild(optionGroup);
            }

            productCard.appendChild(checkboxContainer);
            productCard.appendChild(productHeader);
            productCard.appendChild(priceContainer);
            productCard.appendChild(productOptions);

            productContainer.appendChild(productCard);
        });

        document.querySelectorAll('.checkbox-container input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', function (e) {
                e.stopPropagation();
                const productId = parseInt(this.id.split('-')[1]);
                const product = products.find(p => p.id === productId);
                const productCard = this.closest('.product-card');

                if (this.checked) {
                    if (selectedProducts.length < 2) {
                        selectedProducts.push(product);
                        productCard.classList.add('selected');
                    } else {
                        this.checked = false;
                    }
                } else {
                    selectedProducts = selectedProducts.filter(p => p.id !== productId);
                    productCard.classList.remove('selected');
                }

                updateCart();
            });
        });

        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', function (e) {
                if (e.target.tagName === 'SELECT' || e.target.tagName === 'INPUT') return;
                const checkbox = this.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                const event = new Event('change');
                checkbox.dispatchEvent(event);
            });
        });
    }

    function updateCart() {
        if (selectedProducts.length > 0) {
            cartSection.classList.remove('hidden');
            if (selectedProducts.length === 2) {
                totalPrice = Math.max(selectedProducts[0].currentPrice, selectedProducts[1].currentPrice);
            } else {
                totalPrice = selectedProducts[0].currentPrice;
            }
            totalPriceElement.textContent = `Total: $${totalPrice.toFixed(2)}`;
        } else {
            cartSection.classList.add('hidden');
        }
    }

    addToCartButton.addEventListener('click', function () {
        if (selectedProducts.length === 0) return;

        let message = "Added to cart: ";

        if (selectedProducts.length === 2) {
            const cheaperProduct = selectedProducts[0].currentPrice < selectedProducts[1].currentPrice ?
                selectedProducts[0] : selectedProducts[1];
            const expensiveProduct = selectedProducts[0].currentPrice >= selectedProducts[1].currentPrice ?
                selectedProducts[0] : selectedProducts[1];

            message += `BOGO deal! You pay for ${expensiveProduct.title} ($${expensiveProduct.currentPrice.toFixed(2)}) `;
            message += `and get ${cheaperProduct.title} free!`;
        } else {
            message += `${selectedProducts[0].title} for $${selectedProducts[0].currentPrice.toFixed(2)}`;
        }

        alert(message);
        console.log("Products added to cart:", selectedProducts);
    });

    renderProducts();
});
