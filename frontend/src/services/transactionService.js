import { API_URL } from '../config/api'

const BASE_URL = API_URL

function authHeaders() {
    const token = localStorage.getItem('token')

    if (!token) {
        throw new Error('Please log in first.')
    }

    return {
        Authorization: `Bearer ${token}`,
    }
}

export async function getTransactions() {
    const response = await fetch(`${BASE_URL}/transactions`, {
        headers: authHeaders(),
    })

    if (!response.ok) {
        throw new Error(`Failed to load transactions: ${response.status}`)
    }

    return await response.json()
}

export async function createTransaction(transaction) {
    const response = await fetch(`${BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
            ...authHeaders(),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction),
    })

    if (!response.ok) {
        const errorDetails = await response.text()

        console.error('Transaction rejected:', {
            status: response.status,
            details: errorDetails,
            transaction,
        })

        throw new Error(
            `Failed to create transaction: ${response.status} - ${errorDetails}`
        )
    }

    // We reload the transaction list after saving,
    // so we do not need to parse the POST response.
}

export async function deleteTransaction(id) {
    const response = await fetch(`${BASE_URL}/transactions/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
    })

    if (!response.ok) {
        throw new Error(`Failed to delete transaction: ${response.status}`)
    }
}

