import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import VTC_logo from './assets/VTC_logo.png'
import './App.css'
import Login from './Login'

function Home() {
  const [count, setCount] = useState(0)
  const navigate = useNavigate()

  return (
    <>
      <div>
        <img
          src={VTC_logo}
          className="logo VTC"
          alt="logo"
          onClick={() => navigate('/login')}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <h2>Are you ready to create your own virtual time capsule?</h2>
      <p className="read-the-docs">
        Click on the envelope to login or create an account!
      </p>
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}

export default App
