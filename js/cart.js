let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favouriteCart = JSON.parse(localStorage.getItem("favouriteCart")) || null;

// Update cart counter
function updateCartCounter() {
    const cartCounter = document.querySelector(".badge");
    if (cartCounter) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCounter.textContent = totalItems;
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Add item to cart
function addToCart(event) {
    const button = event.target;
    const productCard = button.closest(".product-card");
    const title = productCard.querySelector(".product-title").textContent;
    const priceText = productCard.querySelector(".product-price").textContent.replace("LKR ", "").replace(",", "");
    const price = parseFloat(priceText) || 0;
    const image = productCard.querySelector(".product-image").src;

    const existingItem = cart.find(item => item.title === title);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ title, price, image, quantity: 1 });
    }

    saveCart();
    updateCartCounter();
}

// Render cart items
function renderCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart">Your cart is empty</p>`;
    } else {
        cart.forEach((item, index) => {
            const itemPrice = item.price * item.quantity;
            total += itemPrice;

            const cartItem = document.createElement("li");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="item-details">
                    <p class="item-title">${item.title}</p>
                    <p class="item-price">LKR ${itemPrice.toLocaleString()}</p>
                    <div class="quantity-controls">
                        <input type="number" class="item-quantity-input" data-index="${index}" value="${item.quantity}" min="1">
                    </div>
                </div>
                <button class="remove-item" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    totalPriceElement.textContent = `LKR ${total.toLocaleString()}`;
}

// Save cart as favourite
function saveFavourite() {
    if (cart.length === 0) {
        alert("Your cart is empty! Add items before saving as favourite.");
        return;
    }
    localStorage.setItem("favouriteCart", JSON.stringify(cart));
    alert("Your cart has been saved as a favourite!");
}

// Apply favourite cart
function applyFavourite() {
    const savedFavourite = JSON.parse(localStorage.getItem("favouriteCart"));
    if (!savedFavourite) {
        alert("No favourite cart found!");
        return;
    }
    cart = savedFavourite;
    saveCart();
    renderCart();
    updateCartCounter();
    alert("Favourite cart applied!");
}

document.addEventListener("DOMContentLoaded", () => {
    // Add to cart buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", addToCart);
    });

    updateCartCounter();

    if (document.getElementById("cart-items")) {
        renderCart();

        // Handle quantity input (only save, don’t re-render yet)
        document.getElementById("cart-items").addEventListener("input", event => {
            if (event.target.classList.contains("item-quantity-input")) {
                const index = event.target.dataset.index;
                let newQty = parseInt(event.target.value);

                if (!isNaN(newQty) && newQty >= 1) {
                    cart[index].quantity = newQty;
                    saveCart();
                    updateCartCounter();
                }
            }
        });

        // Re-render cart when input is blurred
        document.getElementById("cart-items").addEventListener("blur", event => {
            if (event.target.classList.contains("item-quantity-input")) {
                renderCart();
            }
        }, true);

        // Also re-render on Enter key press
        document.getElementById("cart-items").addEventListener("keydown", event => {
            if (
                event.target.classList.contains("item-quantity-input") &&
                event.key === "Enter"
            ) {
                event.preventDefault();
                event.target.blur();
            }
        });

        // Remove item
        document.getElementById("cart-items").addEventListener("click", event => {
            const index = event.target.dataset.index;
            if (event.target.classList.contains("remove-item")) {
                cart.splice(index, 1);
                saveCart();
                renderCart();
                updateCartCounter();
            }
        });

        document.getElementById("save-favourite")?.addEventListener("click", saveFavourite);
        document.getElementById("apply-favourite")?.addEventListener("click", applyFavourite);
    }

    // Checkout button
    document.getElementById("proceed-to-checkout")?.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Your cart is empty! Please add items before checking out.");
        } else {
            window.location.href = "checkout.html";
        }
    });
});
