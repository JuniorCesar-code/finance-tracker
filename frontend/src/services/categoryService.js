
export async function getCategories() {
    const token = localStorage.getItem('token')

    if (!token) {
        throw new Error('Please log in first.')
    }

    const response = await fetch('http://localhost:8080/categories', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error(`Failed to load categories: ${response.status}`)
    }

    return await response.json()
}
