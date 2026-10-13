import { useState } from 'react'

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })

            if (!response.ok) {
                console.error('Login failed. Status:', response.status)
                return
            }

            const token = await response.text()

            localStorage.setItem('token', token)

            console.log('Login successful')
        } catch (error) {
            console.error('Login failed:', error)
        }
    }

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default LoginForm