// Utility functions for the application

// Show loading spinner
export function showLoading(element, text = 'Loading...') {
    element.innerHTML = `
        <div class="loading">
            <div>
                <div class="loading-spinner"></div>
                <p class="loading-text">${text}</p>
            </div>
        </div>
    `;
}

// Show toast notification
export function showToast(message, type = 'success') {
    const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;

    const container = document.querySelector('.toast-container') || createToastContainer();
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
        if (container.children.length === 0) {
            container.remove();
        }
    }, 5000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Error handling wrapper
export async function handleAsync(promise, errorMessage) {
    try {
        return await promise;
    } catch (error) {
        console.error(error);
        showToast(errorMessage || 'Something went wrong', 'error');
        throw error;
    }
}
