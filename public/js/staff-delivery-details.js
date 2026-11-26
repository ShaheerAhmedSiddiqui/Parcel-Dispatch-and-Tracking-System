
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('staffStatusForm');

    if (!form) return;

    const statusSelect = document.getElementById('nextStatus');
    const failureGroup = document.getElementById('failureReasonGroup');
    const failureReason = document.getElementById('failureReason');
    const remarks = document.getElementById('statusRemarks');
    const button = document.getElementById('updateStatusButton');
    const message = document.getElementById('staffStatusMessage');

    function showMessage(text, type) {
        message.textContent = text;
        message.className = `detail-action-message ${type}`;
    }

    function updateFailureField() {
        const isFailed = statusSelect.value === 'Delivery Failed';

        failureGroup.hidden = !isFailed;
        failureReason.required = isFailed;

        if (!isFailed) {
            failureReason.value = '';
        }
    }

    statusSelect.addEventListener('change', updateFailureField);

    form.addEventListener('submit', async event => {
        event.preventDefault();

        const parcelId = form.dataset.parcelId;
        const status = statusSelect.value;
        const reason = failureReason.value.trim();

        if (!status) {
            showMessage('Please select a delivery status.', 'error');
            return;
        }

        if (status === 'Delivery Failed' && !reason) {
            showMessage('Please provide a reason for the failed delivery.', 'error');
            failureReason.focus();
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to update this parcel to "${status}"?`
        );

        if (!confirmed) return;

        button.disabled = true;
        button.textContent = 'Updating...';

        const data = {
            status,
            remarks: remarks.value.trim(),
            failureReason: reason
        };

        try {
            const response = await fetch(
                `/staff/parcels/${encodeURIComponent(parcelId)}/status`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify(data)
                }
            );

            let result;

            try {
                result = await response.json();
            } catch {
                throw new Error(
                    'The server returned an unexpected response.'
                );
            }

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'Unable to update delivery status.'
                );
            }

            showMessage(result.message, 'success');

            // Reload to display the updated status and history.
            window.setTimeout(() => {
                window.location.href =
                    `/staff/parcels/${encodeURIComponent(parcelId)}?success=updated`;
            }, 700);

        } catch (error) {
            showMessage(error.message, 'error');

            button.disabled = false;
            button.textContent = 'Update Delivery Status';
        }
    });
});
