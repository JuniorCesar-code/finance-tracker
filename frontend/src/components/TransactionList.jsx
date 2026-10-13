
import './TransactionList.css'

function TransactionList({ transactions = [], onDeleteTransaction }) {
    const money = (amount) =>
        new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(Number(amount) || 0)

    const sortedTransactions = [...transactions].sort(
        (a, b) => String(b.date).localeCompare(String(a.date))
    )

    if (sortedTransactions.length === 0) {
        return <p className="transaction-empty">No transactions found.</p>
    }

    return (
        <div className="transaction-table-wrapper">
            <table className="transaction-table">
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {sortedTransactions.map((transaction) => {
                    const isIncome = transaction.type === 'INCOME'
                    const category =
                        transaction.categoryName ||
                        transaction.category?.name ||
                        'Uncategorized'

                    return (
                        <tr key={transaction.id}>
                            <td>{transaction.date}</td>
                            <td className="transaction-description">
                                {transaction.description || 'Transaction'}
                            </td>
                            <td>
                                    <span className="transaction-category">
                                        {category}
                                    </span>
                            </td>
                            <td>
                                    <span className={`transaction-type ${isIncome ? 'income' : 'expense'}`}>
                                        {transaction.type}
                                    </span>
                            </td>
                            <td className={`transaction-amount ${isIncome ? 'income' : 'expense'}`}>
                                {isIncome ? '+' : '−'}{money(transaction.amount)}
                            </td>
                            <td>
                                <button
                                    type="button"
                                    className="transaction-delete"
                                    onClick={() => onDeleteTransaction(transaction.id)}
                                    aria-label={`Delete ${transaction.description || 'transaction'}`}
                                    title="Delete transaction"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}

export default TransactionList
