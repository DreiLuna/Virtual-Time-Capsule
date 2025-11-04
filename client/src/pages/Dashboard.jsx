import { useAuth } from "../auth/AuthContext";
import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { createPortal } from 'react-dom';

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
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!title.trim() || !selectedFile) {
      alert('Please provide both a title and an image');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Image uploaded successfully!');
        handleClose();
        // refresh your image list here
      } else {
        alert('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTitle('');
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    // <div className="main">
    //   <nav className = "navbar">

    //   {/* //title */}
    //   <ul className="title">

    //     <h1 className="topTitle">Welcome, {user?.name}!</h1>
    //     <i><h5 className="underTitle">
    //     This is a protected page. Only visible when authenticated.
    //     </h5></i>

    //   </ul>
    //   {/* //button */}
    //   <button onClick={logout} className="logoutbtn">Log out</button>

    //   </nav>


    //   <div className="content">
    //     <div className="capsuleDiv">
    //       {images.map((src, index) => (
    //         <div className="seperateCapsules">
    //           <img key={index} src={src} alt={`Image ${index}`}/>
    //           <h2>{capsuleName}</h2>
    //         </div>
    //     ))}
    //     </div>
    //   </div>
      
    // </div>

    <>
      {isOpen && createPortal(
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Upload New Image</h2>
              <button onClick={handleClose} className="modal-close-btn">
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-field">
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter image title"
                  className="modal-input"
                />
              </div>

              <div className="modal-field">
                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="modal-file-input"
                />
              </div>

              {preview && (
                <div className="modal-preview">
                  <img src={preview} alt="Preview" />
                </div>
              )}

              <div className="modal-actions">
                <button onClick={handleClose} className="modal-btn-cancel">
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || !title.trim() || !selectedFile}
                  className="modal-btn-upload"
                >
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className="main">
        <nav className="navbar">
          <ul className="title">
            <h1 className="topTitle">Welcome, {user?.name}!</h1>
            <i><h5 className="underTitle">
              This is a protected page. Only visible when authenticated.
            </h5></i>
          </ul>

          <button onClick={() => setIsOpen(true)} className="upload-btn">
            <Upload size={20} />
            Upload New Image
          </button>
          
          <button onClick={logout} className="logoutbtn">Log out</button>
        </nav>

        <div className="content">
          <div className="capsuleDiv">
            {images.map((src, index) => (
              <div className="seperateCapsules" key={index}>
                <img src={src} alt={`Image ${index}`}/>
                <h2>{capsuleName}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>

    
  );
}

