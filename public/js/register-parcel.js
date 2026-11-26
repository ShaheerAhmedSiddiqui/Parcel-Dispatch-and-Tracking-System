
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerParcelForm');
    const quoteButton = document.getElementById('calculateQuoteButton');
    const registerButton = document.getElementById('registerParcelButton');
    const chargeResult = document.getElementById('chargeResult');
    const chargeMessage = document.getElementById('chargeMessage');

    if (!form || !quoteButton || !registerButton) return;

    let quoteIsCurrent = false;

    function showMessage(message, type) {
        chargeMessage.textContent = message;
        chargeMessage.className = `charge-message ${type}`;
    }

    function resetQuote() {
        quoteIsCurrent = false;
        chargeResult.innerHTML =
            '<span class="charge-placeholder">Not calculated yet</span>';
        chargeMessage.textContent = '';
        chargeMessage.className = 'charge-message';
    }

    function getFormData() {
        const formData = new FormData(form);
        return new URLSearchParams(formData);
    }

    // Calculate estimated delivery charge.
    quoteButton.addEventListener('click', async () => {
        const weight = document.getElementById('weight');
        const deliveryType = document.getElementById('deliveryType');
        const distance = document.getElementById('distance');

        if (!weight.value || Number(weight.value) <= 0) {
            weight.setCustomValidity('Enter a weight greater than zero.');
            weight.reportValidity();
            weight.setCustomValidity('');
            return;
        }

        if (!deliveryType.value) {
            deliveryType.reportValidity();
            return;
        }

        if (distance.value !== '' && Number(distance.value) < 0) {
            distance.setCustomValidity('Distance cannot be negative.');
            distance.reportValidity();
            distance.setCustomValidity('');
            return;
        }

        quoteButton.disabled = true;
        quoteButton.textContent = 'Calculating...';
        showMessage('', '');

        try {
            const response = await fetch('/parcels/quote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: getFormData(),
                credentials: 'same-origin'
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                resetQuote();
                showMessage(
                    result.message || 'Unable to calculate delivery charge.',
                    'error'
                );
                return;
            }

            const charge = Number(result.data.deliveryCharge);

            if (!Number.isFinite(charge)) {
                resetQuote();
                showMessage('The server returned an invalid charge.', 'error');
                return;
            }

            chargeResult.innerHTML = '';

            const amount = document.createElement('span');
            amount.className = 'charge-amount';
            amount.textContent = `Rs. ${charge.toFixed(2)}`;

            chargeResult.appendChild(amount);

            quoteIsCurrent = true;
            showMessage('Estimated delivery charge calculated successfully.', 'success');

        } catch (error) {
            resetQuote();
            showMessage(
                'Unable to connect to the server. Please try again.',
                'error'
            );
        } finally {
            quoteButton.disabled = false;
            quoteButton.textContent = 'Calculate Delivery Charge';
        }
    });

    // Any change to the pricing inputs makes the previous quote outdated.
    [
        'weight',
        'distance',
        'deliveryType'
    ].forEach(id => {
        document.getElementById(id).addEventListener('input', resetQuote);
        document.getElementById(id).addEventListener('change', resetQuote);
    });

    // Validate before submitting the registration form.
    form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
            event.preventDefault();
            form.reportValidity();
            return;
        }

        registerButton.disabled = true;
        registerButton.textContent = 'Registering...';
    });
});
