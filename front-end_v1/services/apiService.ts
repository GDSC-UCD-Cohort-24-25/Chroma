const API_BASE_URL = import.meta.env.VITE_API_BASE_URL|| 'http://localhost:3000';
console.log('VITE_BASE_URL:', API_BASE_URL);

export const registerUser = async (email: string, password: string, name: string) => {
    console.log('Registering'); //debug
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
    });
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
        credentials: 'include',
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
        console.log('Logging out'); //debug
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
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

export const getBudgets = async ()  => {
    //console.log('Fetching user budget'); //debug
    try{
        const response = await fetch(`${API_BASE_URL}/api/budgets`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            
        });
        const res = await response.json();
        if (!res.success) {
            throw new Error(res.message || 'Failed to fetch user budget.');
        }
        console.log('Fetched budget data:', res); //debug
        console.log('Fetched budget data:', res.data); //debug
        console.log('Fetched user id:', res.userId); //debug
        return res;

    } catch (error: any) {
        console.error('Error fetching user budget: 123456 +', error.message); // Debug
        throw new Error(error.message || 'An error occurred while fetching user budget. 32r4r 3re');
    }
};

export const createBudget = async (
    budget: { 
        userId: string;
        name: string; 
        amount: number; 
        percentage: number; 
        expense: number;
        icon: string;
        recommendations: Array<string>; 
        color: string 
    }
) => {
    console.log('Creating budget:', budget.name);    
    try {
        const response = await fetch(`${API_BASE_URL}/api/budgets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(budget)
        });
        const res = await response.json();
        if (!res.success) {
            console.error('Error succes false creating budget', res); // Debug
            throw new Error(res.message || 'Failed to create budget.');
        }
        return res;
    } catch (error: any) {        
        console.error('Error creating budget:', error.message); // Debug
        throw new Error(error.message || 'An error occurred while creating the budget.');
    }
};


export const updateBudget = async (
    budget: { 
        userId: string;
        name: string; 
        amount: number; 
        percentage: number;
        expense: number;
        icon: string; 
        recommendations: Array<string>; 
        color: string 
    }
) => {
    console.log('Updating budget:', budget.userId); // Debug
    
    try {
        
        const response = await fetch(`${API_BASE_URL}/api/budgets/${budget.userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(budget),
        });
        const res = await response.json();
        if (!res.success) {
            throw new Error(res.message || 'Failed to update budget.');
        }
        console.log('Budget updated successfully:', res); // Debug
        return res;
    } catch (error: any) {
        console.error('Error updating budget:', error.message); // Debug
        throw new Error(error.message || 'An error occurred while updating the budget.');
    }
};


export const getTotalBudget = async () => {
    console.log('Fetching total budget'); // Debug
    try{
        
        const response = await fetch(`${API_BASE_URL}/api/gettotal/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const res = await response.json();
        if (!res.success) {
            throw new Error(res.message || 'Failed to fetch total budget.');
        }

        return res.total;
    } catch (error: any) {
        console.error('Error fetching total budget:', error.message); // Debug
        throw new Error(error.message || 'An error occurred while fetching total budget.');
    }
}

export const setTotalBudget = async (total: number) => {
    console.log('Setting total budget:', total); // Debug
    try{
        
        const response = await fetch(`${API_BASE_URL}/api/settotal/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ total }),
        });
        const res = await response.json();
        if (!res.success) {
            throw new Error(res.message || 'Failed to set total budget.');
        }
    
        return res;
    }
    catch (error: any) {
            console.error('Error setting total budget:', error.message); // Debug
            throw new Error(error.message || 'An error occurred while setting total budget.');
        }
    
}

export const deleteBudget = async (budgetId: string) => {
    console.log('Deleting budget with budgetID:', budgetId); // Debug
    
    try {
        
        const response = await fetch(`${API_BASE_URL}/api/budgets/${budgetId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        const res = await response.json();
        if (!res.success) {
            throw new Error(res.message || 'Failed to delete budget.');
        }
        console.log('Budget deleted successfully:', res); // Debug
        return res;
    } catch (error: any) {
        console.error('Error deleting budget:', error.message); // Debug
        throw new Error(error.message || 'An error occurred while deleting the budget.');
    }
}