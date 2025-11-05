import {render, screen} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import {BrowserRouter} from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext'
import Login from '../pages/Login.jsx'

describe('Login Page', () => {
    it('renders login form', () => {
        render(
            <AuthProvider>
                <BrowserRouter>
                    <Login />
                </BrowserRouter>
            </AuthProvider>
        )
        const heading = screen.getByText('Sign In')
        expect(heading).toBeInTheDocument()
    })
})
