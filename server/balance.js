class BalanceManager {
    static async getBalance() {
        try {
            const response = await fetch('/auth/get-balance', {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) throw new Error('Failed to fetch balance');

            const data = await response.json();
            return data.balance;
        } catch (error) {
            console.error('Error getting balance:', error);
            // Fallback to localStorage for guests
            const guestData = JSON.parse(localStorage.getItem('guestUser')) || { balance: 1000.00 };
            return guestData.balance;
        }
    }

    static async updateBalance(amount) {
        try {
            const response = await fetch('/auth/update-balance', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount })
            });

            if (!response.ok) throw new Error('Failed to update balance');

            const data = await response.json();
            return data.newBalance;
        } catch (error) {
            console.error('Error updating balance:', error);
            // Fallback to localStorage for guests
            const guestData = JSON.parse(localStorage.getItem('guestUser')) || { balance: 1000.00 };
            guestData.balance += amount;
            localStorage.setItem('guestUser', JSON.stringify(guestData));
            return guestData.balance;
        }
    }

    static async updateDisplay() {
        const balance = await this.getBalance();
        document.querySelectorAll('.balance-display').forEach(el => {
            el.textContent = balance.toFixed(2);
        });
        return balance;
    }
}