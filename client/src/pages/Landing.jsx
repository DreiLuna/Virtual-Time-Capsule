import { useNavigate } from 'react-router-dom'
import VTC_logo from '../assets/VTC_logo.png'
import '../css/Landing.css'

export default function Landing() {
  const navigate = useNavigate();

  // Check cookie to see if user is logged in or not.
  

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
