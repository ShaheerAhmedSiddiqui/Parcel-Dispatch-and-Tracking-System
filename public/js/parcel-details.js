
document.addEventListener('DOMContentLoaded', () => {
    const assignmentForm = document.getElementById('assignStaffForm');
    const returnForm = document.getElementById('returnParcelForm');

    async function submitAction(url, data) {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data),
            credentials: 'same-origin'
        });

        let result;

        try {
            result = await response.json();
        } catch {
            throw new Error(
                'The server returned an unexpected response. Please try again.'
            );
        }

        if (!response.ok || !result.success) {
            throw new Error(
                result.message || 'The requested action could not be completed.'
            );
        }

        return result;
    }

    function showMessage(element, message, type) {
        if (!element) return;

        element.textContent = message;
        element.className = `detail-action-message ${type}`;
    }

    // Assign delivery staff.
    if (assignmentForm) {
        assignmentForm.addEventListener('submit', async event => {
            event.preventDefault();

            const button = document.getElementById('assignStaffButton');
            const message = document.getElementById('assignmentMessage');
            const staffId = document.getElementById('staffId').value;
            const parcelId = assignmentForm.elements.parcelId.value;

            if (!staffId) {
                showMessage(
                    message,
                    'Please select a delivery staff member.',
                    'error'
                );
                return;
            }

            button.disabled = true;
            button.textContent = 'Assigning...';

            try {
                const result = await submitAction(
                    `/parcels/${encodeURIComponent(parcelId)}/assign`,
                    { staffId }
                );

                showMessage(message, result.message, 'success');

                // Reload to show the updated status, staff member and history.
                window.setTimeout(() => window.location.reload(), 700);

            } catch (error) {
                showMessage(message, error.message, 'error');
                button.disabled = false;
                button.textContent = 'Assign Staff';
            }
        });
    }

    // Initiate parcel return.
    if (returnForm) {
        returnForm.addEventListener('submit', async event => {
            event.preventDefault();

            const button = document.getElementById('returnParcelButton');
            const message = document.getElementById('returnMessage');
            const reason = document.getElementById('returnReason').value.trim();
            const parcelId = returnForm.elements.parcelId.value;

            if (!reason) {
                showMessage(
                    message,
                    'Please enter a reason for the return.',
                    'error'
                );
                return;
            }

            const confirmed = window.confirm(
                'Are you sure you want to initiate the return of this parcel?'
            );

            if (!confirmed) return;

            button.disabled = true;
            button.textContent = 'Processing...';

            try {
                const result = await submitAction(
                    `/parcels/${encodeURIComponent(parcelId)}/return`,
                    { reason }
                );

                showMessage(message, result.message, 'success');

                // Reload to display the updated return status and history.
                window.setTimeout(() => window.location.reload(), 700);

            } catch (error) {
                showMessage(message, error.message, 'error');
                button.disabled = false;
                button.textContent = 'Initiate Parcel Return';
            }
        });
    }
});
