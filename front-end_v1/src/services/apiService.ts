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

        const res = await response.json();
        if (!res.success) {
            throw new Error('Failed to log out.');
        }

    } catch (error: any) {
        alert(error.message || 'An error occurred during logout.');
        console.log(error.message || 'Failed to log out');
    }
};

export const refreshPage = async () => {
    try {
        console.log('Refreshing'); //debug
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const res = await response.json();
        if (!res.success) {
            throw new Error('Failed to refersh.');
        }
        return res;

    } catch (error: any) {
        alert(error.message || 'An error occurred during refreshing.');
        console.log(error.message || 'Failed to refresh');
    }
};


export const getBudgets = async ()  => {
    console.log('Getting user budget'); //debug
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
        //console.log('Fetched budget data:', res.data); //debug
        //console.log('Fetched user id:', res.userId); //debug
        return res;

    } catch (error: any) {
        console.error('Error fetching user budget: 123456 +', error.message); // Debug
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
    }
};


export const updateBudget = async (
    budget: { 
        Id: string;
        name: string; 
        amount: number; 
        percentage: number;
        expense: number;
        icon: string; 
        recommendations: Array<string>; 
        color: string 
    }
) => {
    console.log('Updating budget:', budget.Id); // Debug
    try {        
        const response = await fetch(`${API_BASE_URL}/api/budgets/${budget.Id}`, {
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
        console.log('Budget updated successfully:'); // Debug
        return res;
    } catch (error: any) {
        console.error('Error updating budget:', error.message); // Debug
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
        console.log('Budget deleted successfully:'); // Debug
        return res;
    } catch (error: any) {
        console.error('Error deleting budget:', error.message); // Debug
    }
}

