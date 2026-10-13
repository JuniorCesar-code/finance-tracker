
import { useCallback, useEffect, useState } from 'react'

import RegisterForm from './components/RegisterForm'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import Dashboard from './components/Dashboard'
import { API_URL } from './config/api'

import {
    getTransactions,
    createTransaction,
    deleteTransaction,
} from './services/transactionService'

import { getCategories } from './services/categoryService'

import './App.css'

function App() {
    const [token, setToken] = useState(
        () => localStorage.getItem('token')
    )
    const [page, setPage] = useState('dashboard')
    const [authPage, setAuthPage] = useState('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [authLoading, setAuthLoading] = useState(false)

    const [transactions, setTransactions] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const loadData = useCallback(async () => {
        if (!localStorage.getItem('token')) return

        setLoading(true)

        try {
            const [transactionData, categoryData] = await Promise.all([
                getTransactions(),
                getCategories(),
            ])

            setTransactions(transactionData)
            setCategories(categoryData)
            setError('')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        if (token) loadData()
    }, [token, loadData])

    async function handleLogin(event) {
        event.preventDefault()
        setError('')
        setAuthLoading(true)

        try {
            const response = await fetch(
                `${API_URL}/auth/login`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                }
            )

            if (!response.ok) {
                throw new Error('Invalid email or password.')
            }

            const jwt = await response.text()
            localStorage.setItem('token', jwt)
            setToken(jwt)
            setPassword('')
            setPage('dashboard')
        } catch (err) {
            setError(err.message)
        } finally {
            setAuthLoading(false)
        }
    }

    function logout() {
        localStorage.removeItem('token')
        setToken(null)
        setTransactions([])
        setCategories([])
        setError('')
        setPage('dashboard')
        setAuthPage('login')
    }

    async function addTransaction(transaction) {
        await createTransaction(transaction)
        await loadData()
    }

    async function removeTransaction(id) {
        try {
            await deleteTransaction(id)
            await loadData()
        } catch (err) {
            setError(err.message)
        }
    }

    if (!token) {
        return (
            <div className="auth-screen">
                <div className="auth-card">
                    <div className="auth-logo">FT</div>

                    <h1>Finance Tracker</h1>
                    <p className="muted">
                        Take control of your financial future.
                    </p>

                    <div className="auth-tabs">
                        <button
                            className={authPage === 'login' ? 'active' : ''}
                            onClick={() => {
                                setAuthPage('login')
                                setError('')
                            }}
                        >
                            Sign in
                        </button>
                        <button
                            className={authPage === 'register' ? 'active' : ''}
                            onClick={() => {
                                setAuthPage('register')
                                setError('')
                            }}
                        >
                            Register
                        </button>
                    </div>

                    {authPage === 'login' ? (
                        <form onSubmit={handleLogin} className="auth-form">
                            <label htmlFor="login-email">Email address</label>
                            <input
                                id="login-email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <label htmlFor="login-password">Password</label>
                            <input
                                id="login-password"
                                type="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="submit"
                                className="primary-btn"
                                disabled={authLoading}
                            >
                                {authLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>
                    ) : (
                        <div className="registration-panel">
                            <RegisterForm />
                            <p className="muted">
                                After registering, select Sign in to access your account.
                            </p>
                        </div>
                    )}

                    {error && <p className="error-message" role="alert">{error}</p>}
                </div>
            </div>
        )
    }

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand">
                    <span className="brand-icon">FT</span>
                    <div>
                        <strong>Finance Tracker</strong>
                        <small>Personal Finance</small>
                    </div>
                </div>

                <p className="nav-heading">WORKSPACE</p>


                <nav className="sidebar-nav" aria-label="Main navigation">
                    <button
                        type="button"
                        className={page === 'dashboard' ? 'active' : ''}
                        onClick={() => setPage('dashboard')}
                        aria-current={page === 'dashboard' ? 'page' : undefined}
                    >
                        <span className="nav-icon" aria-hidden="true">▦</span>
                        <span>Dashboard</span>
                    </button>

                    <button
                        type="button"
                        className={page === 'transactions' ? 'active' : ''}
                        onClick={() => setPage('transactions')}
                        aria-current={page === 'transactions' ? 'page' : undefined}
                    >
                        <span className="nav-icon" aria-hidden="true">⇄</span>
                        <span>Transactions</span>
                    </button>
                </nav>


                <div className="sidebar-bottom">
                    <div className="user-profile">
                        <div className="avatar">
                            {email ? email[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                            <strong>My Account</strong>
                            <small>Finance workspace</small>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={logout}>
                        Sign out
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div>
                        <span className="eyebrow">PERSONAL FINANCE</span>
                        <h1>
                            {page === 'dashboard'
                                ? 'Dashboard'
                                : 'Transactions'}
                        </h1>
                        <p className="muted">
                            {page === 'dashboard'
                                ? 'Here is your financial overview.'
                                : 'Manage your income and expenses.'}
                        </p>
                    </div>


                    <div className="topbar-actions">
                        <button
                            type="button"
                            className="secondary-btn refresh-btn"
                            onClick={loadData}
                            disabled={loading}
                        >
                            <span aria-hidden="true">↻</span>
                            {loading ? 'Loading...' : 'Refresh'}
                        </button>

                        <button
                            type="button"
                            className="primary-btn add-transaction-btn"
                            onClick={() => setPage('transactions')}
                        >
                            <span aria-hidden="true">+</span>
                            Add Transaction
                        </button>
                    </div>

                </header>

                {error && (
                    <p className="error-message" role="alert">
                        {error}
                    </p>
                )}

                {page === 'dashboard' && (
                    <div className="dashboard-view">
                        <Dashboard transactions={transactions} />

                        <section className="content-panel">
                            <div className="panel-header">
                                <h2>Recent Transactions</h2>
                                <button
                                    className="text-btn"
                                    onClick={() => setPage('transactions')}
                                >
                                    View all →
                                </button>
                            </div>

                            <TransactionList
                                transactions={[...transactions]
                                    .sort((a, b) => {
                                        const dateComparison = String(b.date).localeCompare(String(a.date))
                                        return dateComparison || Number(b.id) - Number(a.id)
                                    })
                                    .slice(0, 5)}
                                onDeleteTransaction={removeTransaction}
                            />
                        </section>
                    </div>
                )}

                {page === 'transactions' && (
                    <div className="transactions-layout">
                        <section className="content-panel">
                            <TransactionForm
                                onAddTransaction={addTransaction}
                                categories={categories}
                            />
                        </section>

                        <section className="content-panel">
                            <TransactionList
                                transactions={transactions}
                                onDeleteTransaction={removeTransaction}
                            />
                        </section>
                    </div>
                )}
            </main>
        </div>
    )
}

export default App

