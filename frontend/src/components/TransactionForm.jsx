
import { useState } from 'react'

function TransactionForm({ onAddTransaction, categories }) {
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [date, setDate] = useState('')
    const [type, setType] = useState('EXPENSE')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()
        setError('')

        if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
            setError('Please enter a positive amount.')
            return
        }

        setSaving(true)

        try {
            await onAddTransaction({
                amount: Number(amount),
                description: description.trim(),
                categoryId: Number(categoryId),
                date,
                type,
            })

            setAmount('')
            setDescription('')
            setCategoryId('')
            setDate('')
            setType('EXPENSE')
        } catch (err) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div>
            <h2>Add Transaction</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Amount</label>
                    <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        required
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                    />
                </div>

                <div>
                    <label>Description</label>
                    <input
                        type="text"
                        required
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>

                <div>
                    <label>Category</label>
                    <select
                        required
                        value={categoryId}
                        onChange={(event) => setCategoryId(event.target.value)}
                    >
                        <option value="">Select category</option>

                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Date</label>
                    <input
                        type="date"
                        required
                        value={date}
                        onChange={(event) => setDate(event.target.value)}
                    />
                </div>

                <div>
                    <label>Type</label>
                    <select
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                    >
                        <option value="EXPENSE">Expense</option>
                        <option value="INCOME">Income</option>
                    </select>
                </div>

                {error && <p role="alert">{error}</p>}

                <button type="submit" disabled={saving || categories.length === 0}>
                    {saving ? 'Saving...' : 'Add Transaction'}
                </button>
            </form>
        </div>
    )
}

export default TransactionForm
