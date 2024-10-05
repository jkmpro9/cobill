import React, { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import Customers from './components/Customers'
import AddCustomer from './components/AddCustomer'
import CustomerList from './components/CustomerList'
import { initializeDatabase, verifyPassword, createUser } from './services/database'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tempPassword, setTempPassword] = useState<string | null>(null)
  const [activePath, setActivePath] = useState('/')
  const [error, setError] = useState<string | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const password = await initializeDatabase();
        if (password) {
          setTempPassword(password);
        }
      } catch (err) {
        console.error('Initialization error:', err);
        setError('Failed to initialize the application. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const handleLogin = async (email: string, password: string, rememberMe: boolean, role: string) => {
    try {
      const isValid = await verifyPassword(email, password, role);
      if (isValid) {
        setIsLoggedIn(true);
        setUserRole(role);
        setError(null);
        console.log('Login successful');
      } else {
        console.log('Login failed: Invalid credentials');
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login. Please try again.');
    }
  }

  const handleRegister = async (email: string, password: string, role: string) => {
    try {
      await createUser(email, password, role);
      console.log('Registration successful');
      setIsLoggedIn(true);
      setUserRole(role);
      setError(null);
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Registration failed. Please try again.');
    }
  }

  const handleNavigate = (path: string) => {
    setActivePath(path);
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setActivePath('/');
    setError(null);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {isLoggedIn ? (
        <div className="flex">
          <Sidebar activePath={activePath} onNavigate={handleNavigate} userRole={userRole} />
          <div className="flex-1">
            <Header userRole={userRole} onLogout={handleLogout} />
            <main className="p-6">
              {activePath === '/' && <Dashboard />}
              {activePath === '/customers' && <Customers />}
              {activePath === '/customers/add' && <AddCustomer />}
              {activePath === '/customers/list' && <CustomerList />}
            </main>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <div>
            <LoginForm onLogin={handleLogin} onRegister={handleRegister} />
            {tempPassword && (
              <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                <p>Temporary admin password: <strong>{tempPassword}</strong></p>
                <p>Please change this password after logging in.</p>
              </div>
            )}
            {error && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App