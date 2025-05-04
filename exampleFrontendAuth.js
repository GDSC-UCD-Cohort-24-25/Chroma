// This is for Frontend: Handle Token Expiry

async function fetchWithAuth(url, options = {}) {
    let response = await fetch(url, { ...options, credentials: "include" });

    if (response.status === 403) { // Token expired
        const refreshResponse = await fetch('/auth/refresh', { method: "POST", credentials: "include" });

        if (refreshResponse.ok) {
            // Retry original request
            response = await fetch(url, { ...options, credentials: "include" });
        } else {
            // Refresh failed, force logout
            alert("Session expired, please log in again.");
            window.location.href = "/auth/login";
            return;
        }
    }

    return response.json();
}
