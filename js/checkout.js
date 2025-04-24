document.addEventListener("DOMContentLoaded", function () {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderTableBody = document.querySelector("#order-summary tbody");
    const orderTotal = document.getElementById("order-total");

    let total = 0;

    cart.forEach(item => {
        const itemSubtotal = item.price * item.quantity;
        total += itemSubtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.quantity}</td>
            <td>LKR ${item.price.toLocaleString()}</td>
            <td>LKR ${itemSubtotal.toLocaleString()}</td>
        `;
        orderTableBody.appendChild(row);
    });

    orderTotal.textContent = `LKR ${total.toLocaleString()}`;

    const checkoutForm = document.getElementById("checkout-form");
    checkoutForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const address = document.getElementById("address").value;
        const cardNumber = document.getElementById("card-number").value;
        const expiryDate = document.getElementById("expiry-date").value;
        const cvv = document.getElementById("cvv").value;

        // to get the correct gmail like it should be a real gmail
        if (!email.endsWith("@gmail.com")) {
            alert("Please enter a valid Gmail address (must end with @gmail.com).");
            return;
        }

        if (cardNumber.length !== 16 || cvv.length !== 3) {
            alert("Please enter valid card details.");
            return;
        }

        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 2);
        const formattedDate = deliveryDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        localStorage.setItem("deliveryDate", formattedDate);

        alert(`Order placed successfully!\nTotal: LKR ${total.toLocaleString()}\nDelivery to: ${address}\nExpected Delivery Date: ${formattedDate}`);

        localStorage.removeItem("cart");
        window.location.href = "thank-you.html";
    });
});
