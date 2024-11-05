let cart = [];
let totalPrice = 0;

function addToCart(price, item) {
    cart.push({ item, price });
    totalPrice += price;
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    cart.forEach(({ item, price }, index) => {
        cartItems.innerHTML += `<p>${item} - $${price.toFixed(2)} <button onclick="removeFromCart(${index})">Quitar</button></p>`;
    });
    document.getElementById('total-price').innerText = `Total: $${totalPrice.toFixed(2)}`;
}

function removeFromCart(index) {
    totalPrice -= cart[index].price;
    cart.splice(index, 1);
    updateCartDisplay();
}

// Integrar PayPal con modal de confirmación
paypal.Buttons({
    createOrder: function(data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: totalPrice.toFixed(2)
                }
            }]
        });
    },
    onApprove: function(data, actions) {
        return actions.order.capture().then(function(details) {
            // Mostrar modal de pago completado
            showPaymentSuccessModal(details.payer.name.given_name);
            cart = [];
            totalPrice = 0;
            updateCartDisplay();
        });
    }
}).render('#paypal-button-container');

// Función para mostrar un modal de confirmación
function showPaymentSuccessModal(name) {
    const modal = document.createElement('div');
    modal.id = 'payment-success-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>¡Pago Completado!</h2>
            <p>Gracias, ${name}, por tu compra.</p>
            <button onclick="closeModal()">Cerrar</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById('payment-success-modal');
    if (modal) {
        modal.remove();
    }
}



