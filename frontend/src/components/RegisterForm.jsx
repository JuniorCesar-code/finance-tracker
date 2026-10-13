import { useState } from 'react'
import { API_URL } from '../config/api'


function RegisterForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    async function handleSubmit(event) {
        event.preventDefault()

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            })

            const message = await response.text()

            if (!response.ok) {
                console.error('Registration failed. Status:', response.status)
                return
            }

            console.log('Registration successful:', message)

            setEmail('')
            setPassword('')
        } catch (error) {
            console.error('Registration failed:', error)
        }
    }

    return (
        <div>
            <h2>Register</h2>

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

                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default RegisterForm