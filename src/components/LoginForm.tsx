import React, { useState } from 'react'
import { FileText } from 'lucide-react'

interface LoginFormProps {
  onLogin: (email: string, password: string, rememberMe: boolean, role: string) => void
  onRegister: (email: string, password: string, role: string) => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onRegister }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [role, setRole] = useState('team')
  const [error, setError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (isRegistering) {
        await onRegister(email, password, role)
      } else {
        await onLogin(email, password, rememberMe, role)
      }
    } catch (err) {
      setError(isRegistering ? 'Registration failed' : 'Invalid email or password')
    }
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <FileText className="w-16 h-16 mx-auto text-green-500 mb-4" />
      <h2 className="text-2xl font-bold text-center mb-2">{isRegistering ? 'Create Account' : 'Login'}</h2>
      <p className="text-center text-gray-600 mb-6">
        {isRegistering ? 'Sign up for a new account' : 'Sign in to your account to continue'}
      </p>
      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="your.email@example.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
            {!isRegistering && (
              <a href="#" className="float-right text-sm text-green-600 hover:text-green-500">
                Forgot Password?
              </a>
            )}
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="form-input"
          >
            <option value="team">Team Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {!isRegistering && (
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
              Remember Me
            </label>
          </div>
        )}
        <button
          type="submit"
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {isRegistering ? 'Create Account' : 'Login'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {isRegistering ? 'Already have an account?' : 'Not registered?'} {' '}
          <button 
            onClick={() => setIsRegistering(!isRegistering)} 
            className="font-medium text-green-600 hover:text-green-500"
          >
            {isRegistering ? 'Login' : 'Create account'}
          </button>
        </p>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500">
          Copyright © 2024 COCCINELLE SARL. All Rights Reserved.
        </p>
      </div>
    </div>
  )
}

export default LoginForm