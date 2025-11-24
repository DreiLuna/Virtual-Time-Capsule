import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { createPortal } from "react-dom";
import "../css/dashboard.css";

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  //fetch images from backend, only images belonging to token will be fetched
  const fetchImages = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/images", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setImages(data.images); // array of { url, filename }
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };


  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
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
      alert("Please provide both a title and an image");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://localhost:3001/api/images/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        alert("Image uploaded successfully!");
        handleClose();
        // Optionally, fetch images again if you implement listing
      } else {
        const data = await response.json();
        alert(data.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTitle("");
    setSelectedFile(null);
    setPreview(null);
  };

  return (
    <>
      {isOpen &&
        createPortal(
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
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      <div className="main">
        <nav className="navbar">
          <ul className="title">
            <h1 className="topTitle">Welcome, {user?.email}!</h1>
            <i>
              <h5 className="underTitle">Your Virtual Time Capsule</h5>
            </i>
          </ul>

          <button onClick={() => setIsOpen(true)} className="upload-btn">
            <Upload size={20} />
            Upload New Image
          </button>

          <button onClick={logout} className="logoutbtn">
            Log out
          </button>
        </nav>

        <div className="content">
          <div className="capsuleDiv">
            {images.length == 0 ? (
              <p
                style={{ textAlign: "center", color: "#999", padding: "40px" }}
              >
                No images uploaded yet. Click "Upload New Image" to add to your
                time capsule!
              </p>
            ) : (
              images.map((image, index) => (
                <div className="seperateCapsules" key={index}>
<img
                     src={`http://localhost:3001${image.url}`}
                     alt={image.title || `Image ${index}`}
                   />
                  <h2>{image.title}</h2>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
