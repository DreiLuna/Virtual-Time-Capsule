import {render, screen, fireEvent} from '@testing-library/react'
import {describe, it, expect} from 'vitest'
import {BrowserRouter} from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext'
import AccountCreation from '../pages/AccountCreation.jsx'

//helper function for to render with providers
function renderWithProviders(ui) {
    return render(
        <AuthProvider>
            <BrowserRouter>
                {ui}
            </BrowserRouter>
        </AuthProvider>
    )
}

describe('Creation Page', () => {
    it('renders creation form', () => {
        renderWithProviders(<AccountCreation />)
        const heading = screen.getAllByText('Create Account')
        expect(heading[1]).toBeInTheDocument()
    })

    it ('shows email and password inputs', () => {
        renderWithProviders(<AccountCreation />)
        const passwordInputs = screen.getAllByPlaceholderText('••••••••');
        expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
        expect(passwordInputs[0]).toBeInTheDocument();
        expect(passwordInputs[1]).toBeInTheDocument();
    })

    it ('allow user input in email and password', () => {
        renderWithProviders(<AccountCreation />)
            const emailInput = screen.getByPlaceholderText('you@example.com');
            const passwordInputs = screen.getAllByPlaceholderText('••••••••');
            const passwordInput= passwordInputs[0];
            const confirmPasswordInput= passwordInputs[1];

            fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
            fireEvent.change(passwordInput, { target: { value: 'password' } })
            fireEvent.change(confirmPasswordInput, { target: { value: 'password' } })

            expect(emailInput.value).toBe('test@example.com');
            expect(passwordInput.value).toBe('password');
            expect(confirmPasswordInput.value).toBe('password');
    })
})
