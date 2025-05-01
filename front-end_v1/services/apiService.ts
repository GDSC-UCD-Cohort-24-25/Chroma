const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'; // Default to localhost if not set
console.log('VITE_BASE_URL:', API_BASE_URL);

export const registerUser = async (email: string, password: string) => {
    console.log('Registering'); //debug
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    //console.log('Response status:', response.status);//debug
    //console.log('Response headers:', response.headers);//debug
    
    const res = await response.json();
    
    if (!res.success) {
        throw new Error(res.message);
    }

    return res; 
};

export const loginUser = async (email: string, password: string) => {
    
    console.log('Logging in'); //debug
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    //console.log('Response status:', response.status);//debug
    //console.log('Response headers:', response.headers);//debug
    const res = await response.json();
    if (!res.success) {
        throw new Error(res.message);
    }

    return res;
    
};

export const logoutUser = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include', // Include cookies for session-based logout
        });

        if (!response.ok) {
            throw new Error('Failed to log out.');
        }

        // redirect to login page
        window.location.href = "/";
    } catch (error: any) {
        alert(error.message || 'An error occurred during logout.');
    }
};

/// Authenticated fetch requests for token expiration handling and logout
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
    let response = await fetch(url, { ...options, credentials: "include" });
    
    console.log('fetching with auth'); //debug
    console.log('Response status:', response.status);//debug
    console.log('Response headers:', response.headers);//debug
    if (response.status === 403) { // Token expired
        const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, 
            { 
                method: "POST", 
                credentials: "include" 
            });
        
        if (refreshResponse.ok) {
            // retry
            response = await fetch(url, { ...options, credentials: "include" });
        } else {
            // if refresh fails, force logout
            alert("Session expired, please log in again.");
            //await logoutUser(); // Call logout function
            window.location.href = "/"; // Redirect to login page
            return;
        }
    }
    return response.json();
}

// user data fetch
export const fetchUserBudget = async ()  => {
    try{
        console.log('Fetching user budget'); //debug
        const response = await fetch(`${API_BASE_URL}/api/budgets`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', 
        });
        console.log('body budget:', response.body);
        console.log('Response status:', response.status);//debug
        console.log('Response headers:', response.headers);//debug
        if (!response.ok) {
            throw new Error('Failed to fetch user budget.');
        }
        const data = await response.json(); // Parse the response as JSON
        return data;

    } catch (error: any) {
        console.error('Error fetching user budget:', error.message); // Debug
        throw new Error(error.message || 'An error occurred while fetching user budget.');
    }
};

export const saveBudget = async (
        budget: { totalBudget: number; 
        Categories: Array<{ id: string; name: string; amount: number; percentage: number; icon: string; recommendations: Array<string>; color: string }> }
) => {
    try {
        console.log('Saving budget:', budget.totalBudget); //debug
        console.log('Categories:', budget.Categories); //debug
        
        const response = await fetch(`${API_BASE_URL}/api/budgets/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(budget),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || 'Failed to save budget.');
        }

        return await response.json();
    } catch (error: any) {
        throw new Error(error.message || 'An error occurred while saving the budget.');
    }
};