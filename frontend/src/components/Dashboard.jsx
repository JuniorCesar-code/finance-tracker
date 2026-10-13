

import { useMemo } from 'react'
import './Dashboard.css'

function Dashboard({ transactions = [] }) {
    const summary = useMemo(() => {
        let income = 0
        let expenses = 0
        const categories = {}
        const months = {}

        for (const transaction of transactions) {
            const amount = Number(transaction.amount) || 0
            const type = transaction.type
            const month = String(transaction.date || '').slice(0, 7)

            if (month && !months[month]) {
                months[month] = { income: 0, expenses: 0 }
            }

            if (type === 'INCOME') {
                income += amount
                if (month) months[month].income += amount
            }

            if (type === 'EXPENSE') {
                expenses += amount
                if (month) months[month].expenses += amount

                const category =
                    transaction.categoryName ||
                    transaction.category?.name ||
                    (typeof transaction.category === 'string'
                        ? transaction.category
                        : 'Other')

                categories[category] =
                    (categories[category] || 0) + amount
            }
        }

        return {
            income,
            expenses,
            balance: income - expenses,
            categories: Object.entries(categories)
                .sort((a, b) => b[1] - a[1]),
            months: Object.entries(months)
                .sort(([a], [b]) => a.localeCompare(b))
                .slice(-6),
        }
    }, [transactions])

    const money = (value) =>
        new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
        }).format(value)

    const maxMonthly = Math.max(
        1,
        ...summary.months.flatMap(([, values]) => [
            values.income,
            values.expenses,
        ])
    )

    const categoryColors = [
        '#8b9dff',
        '#54d6a1',
        '#ff8e94',
        '#f6c76a',
        '#c084fc',
    ]

    return (
        <section className="dashboard">
            <div className="dashboard-cards">
                <div className="dashboard-card balance-card">
                    <div className="card-top">
                        <span>Current Balance</span>
                        <span className="card-icon">◈</span>
                    </div>
                    <strong>{money(summary.balance)}</strong>
                    <small>Income minus expenses</small>
                </div>

                <div className="dashboard-card income-card">
                    <div className="card-top">
                        <span>Total Income</span>
                        <span className="card-icon">↗</span>
                    </div>
                    <strong>{money(summary.income)}</strong>
                    <small>All recorded income</small>
                </div>

                <div className="dashboard-card expense-card">
                    <div className="card-top">
                        <span>Total Expenses</span>
                        <span className="card-icon">↘</span>
                    </div>
                    <strong>{money(summary.expenses)}</strong>
                    <small>All recorded expenses</small>
                </div>
            </div>

            <div className="dashboard-analytics">
                <div className="dashboard-section">
                    <div className="section-heading">
                        <div>
                            <h3>Income vs Expenses</h3>
                            <p>Monthly financial activity</p>
                        </div>
                        <div className="chart-legend">
                            <span className="legend-income">Income</span>
                            <span className="legend-expense">Expenses</span>
                        </div>
                    </div>

                    {summary.months.length === 0 ? (
                        <p className="dashboard-empty">
                            No monthly data available yet.
                        </p>
                    ) : (
                        <div className="monthly-chart">
                            {summary.months.map(([month, values]) => (
                                <div className="month-column" key={month}>
                                    <div className="month-bars">
                                        <div
                                            className="month-bar income-bar"
                                            title={`Income: ${money(values.income)}`}
                                            style={{
                                                height: `${values.income / maxMonthly * 100}%`,
                                            }}
                                        />
                                        <div
                                            className="month-bar expense-bar"
                                            title={`Expenses: ${money(values.expenses)}`}
                                            style={{
                                                height: `${values.expenses / maxMonthly * 100}%`,
                                            }}
                                        />
                                    </div>
                                    <span>{month}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dashboard-section">
                    <div className="section-heading">
                        <div>
                            <h3>Expenses by Category</h3>
                            <p>Your spending breakdown</p>
                        </div>
                    </div>

                    {summary.categories.length === 0 ? (
                        <p className="dashboard-empty">
                            No expenses available yet.
                        </p>
                    ) : (
                        <>
                            <div className="expense-total">
                                <small>Total Spending</small>
                                <strong>{money(summary.expenses)}</strong>
                            </div>

                            {summary.categories.map(([category, amount], index) => (
                                <div className="category-item" key={category}>
                                    <div className="category-label">
                                        <span>
                                            <i
                                                className="category-dot"
                                                style={{
                                                    background: categoryColors[
                                                    index % categoryColors.length
                                                        ],
                                                }}
                                            />
                                            {category}
                                        </span>
                                        <strong>{money(amount)}</strong>
                                    </div>

                                    <div className="category-track">
                                        <div
                                            className="category-fill"
                                            style={{
                                                width: `${Math.min(
                                                    100,
                                                    amount / Math.max(summary.expenses, 1) * 100
                                                )}%`,
                                                background: categoryColors[
                                                index % categoryColors.length
                                                    ],
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </section>
    )
}

export default Dashboard
