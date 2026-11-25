
document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.getElementById('togglePassword');

    if (!passwordInput || !toggleButton) {
        return;
    }

    toggleButton.addEventListener('click', () => {
        const isPasswordHidden = passwordInput.type === 'password';

        passwordInput.type = isPasswordHidden ? 'text' : 'password';

        toggleButton.textContent = isPasswordHidden ? 'Hide' : 'Show';

        toggleButton.setAttribute(
            'aria-label',
            isPasswordHidden ? 'Hide password' : 'Show password'
        );
    });
});
