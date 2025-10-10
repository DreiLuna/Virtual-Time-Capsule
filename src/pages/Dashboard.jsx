import { useAuth } from "../auth/AuthContext";

//^ importing assets
import photo1 from "../assets/temp/photo1.jpg"
import photo2 from"../assets/temp/photo2.jpg"
import photo3 from"../assets/temp/photo3.jpg"
import photo4 from"../assets/temp/photo4.jpg"
const images = [
      photo1,
      photo2,
      photo3,
      photo4
  ];
const capsuleName = "New Capsule"

//$ importing css
import "../css/dashboard.css"

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="main">
      <nav className = "navbar">

      {/* //title */}
      <ul className="title">

        <h1 className="topTitle">Welcome, {user?.name}!</h1>
        <i><h5 className="underTitle">
        This is a protected page. Only visible when authenticated.
        </h5></i>

      </ul>
      {/* //button */}
      <button onClick={logout} className="logoutbtn">Log out</button>

      </nav>


      <div className="content">
        <div className="capsuleDiv">
          {images.map((src, index) => (
            <div className="seperateCapsules">
              <img key={index} src={src} alt={`Image ${index}`}/>
              <h2>{capsuleName}</h2>
            </div>
        ))}
        </div>
      </div>
      
    </div>
  );
}

