
// ParcelTrack - All Parcels page interactions

document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('parcelFilterForm');

    if (!filterForm) {
        return;
    }

    const filterSelects = filterForm.querySelectorAll(
        '#status, #deliveryType, #staffId'
    );

    // Apply filters immediately when a dropdown changes.
    filterSelects.forEach((select) => {
        select.addEventListener('change', () => {
            const pageInput = filterForm.querySelector(
                'input[name="page"]'
            );

            if (pageInput) {
                pageInput.remove();
            }

            filterForm.requestSubmit();
        });
    });

    // A new search should always start from page 1.
    filterForm.addEventListener('submit', () => {
        const pageInput = filterForm.querySelector(
            'input[name="page"]'
        );

        if (pageInput) {
            pageInput.remove();
        }
    });
});
