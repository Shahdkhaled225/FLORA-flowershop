function addToCart(name, price, image) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = cart.find(item => item.name === name);

    if (product) {
        product.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function viewDetails(name, price, image, description) {
    const selectedProduct = {
        name: name,
        price: price,
        image: image,
        description: description
    };
    localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
    window.location.href = "product-details.html";
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    let badge = document.querySelector(".badge-danger");
    if (badge) {
        badge.innerText = totalItems;
        badge.style.display = totalItems > 0 ? "inline-block" : "none";
    }
}

function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartTable = document.getElementById("cart-items");
    let subtotalElement = document.getElementById("subtotal");
    let totalPriceElement = document.getElementById("total-price");

    if (!cartTable) return;

    if (cart.length === 0) {
        cartTable.innerHTML = '<tr><td colspan="4" class="text-center py-4">Your cart is empty.</td></tr>';
        if (subtotalElement) subtotalElement.innerText = "0 LE";
        if (totalPriceElement) totalPriceElement.innerText = "0 LE";
        return;
    }

    cartTable.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        cartTable.innerHTML += `
            <tr>
                <td class="align-middle">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" width="70" height="70" class="rounded mr-3" style="object-fit:cover;">
                        <span class="font-weight-bold">${item.name}</span>
                    </div>
                </td>
                <td class="align-middle">${item.price} LE</td>
                <td class="align-middle">
                    <div class="input-group input-group-sm" style="max-width: 140px;">
                        <div class="input-group-prepend">
                            <button class="btn btn-outline-secondary" type="button" onclick="changeQuantity(${index}, -1)">-</button>
                        </div>
                        <input type="text" class="form-control text-center" value="${item.quantity}" readonly>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button" onclick="changeQuantity(${index}, 1)">+</button>
                        </div>
                    </div>
                </td>
                <td class="align-middle">
                    <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">Remove</button>
                </td>
            </tr>
        `;
    });

    if (subtotalElement) subtotalElement.innerText = total + " LE";
    if (totalPriceElement) totalPriceElement.innerText = total + " LE";
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function changeQuantity(index, delta) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart[index]) return;

    cart[index].quantity += delta;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

document.addEventListener("DOMContentLoaded", function () {
    updateCartCount();
    if (document.getElementById("cart-items")) {
        displayCart();
    }
});