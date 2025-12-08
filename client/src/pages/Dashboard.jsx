import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { createPortal } from "react-dom";
import "../css/dashboard.css";

export default function Dashboard() {
  const { user, logout, token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLockOpen, setIsLockOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [lockedUntil, setLockedUntil] = useState(null);
  const [lockValue, setLockValue] = useState(10); // default 10 minutes
  const [lockUnit, setLockUnit] = useState("minutes");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    // load lock state from localStorage
    try {
      const stored = localStorage.getItem("vtc_lock_until");
      if (stored) {
        const ts = parseInt(stored, 10);
        if (!isNaN(ts) && ts > Date.now()) {
          setLockedUntil(ts);
        } else {
          localStorage.removeItem("vtc_lock_until");
        }
      }
    } catch (e) {
      console.warn("Could not read lock state", e);
    }
  }, []);

  useEffect(() => {
    // heartbeat to update remaining time
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // clear lock if expired
    if (lockedUntil && lockedUntil <= Date.now()) {
      setLockedUntil(null);
      try {
        localStorage.removeItem("vtc_lock_until");
      } catch (e) {}
    }
  }, [now, lockedUntil]);

  const formatRemaining = (ms) => {
    if (!ms || ms <= 0) return "0s";
    const sec = Math.floor(ms / 1000);
    const days = Math.floor(sec / (24 * 3600));
    const hours = Math.floor((sec % (24 * 3600)) / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

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
    if (lockedUntil && lockedUntil > Date.now()) {
      alert("Capsule is locked. You cannot upload until the lock expires.");
      return;
    }
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
        const data = await response.json();
        // Add the newly uploaded image to the UI immediately
        if (data && data.image) {
          // cache-bust the immediate image URL so browser doesn't reuse a 404 cached response
          const img = { ...data.image, url: `${data.image.url}?t=${Date.now()}` };
          setImages(prev => [img, ...prev]);
        } else {
          // fallback: re-fetch images from server
          fetchImages();
        }
        alert("Image uploaded successfully!");
        handleClose();
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
  const handleDownloadAll = async () => {
    if (images.length === 0) {
      alert("No images to download!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/images/download-all", {
        credentials: "include",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `time-capsule-${Date.now()}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to download images");
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download images");
    }
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

      {/* Lock modal */}
      {isLockOpen &&
        createPortal(
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Lock Time Capsule</h2>
                <button onClick={() => setIsLockOpen(false)} className="modal-close-btn">
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                <div className="modal-field">
                  <label>Duration</label>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="number"
                      min={1}
                      value={lockValue}
                      onChange={(e) => setLockValue(parseInt(e.target.value || "0", 10))}
                      className="modal-input"
                    />
                    <select value={lockUnit} onChange={(e) => setLockUnit(e.target.value)} className="modal-input">
                      <option value="minutes">minutes</option>
                      <option value="hours">hours</option>
                      <option value="days">days</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                  <button onClick={() => setIsLockOpen(false)} className="modal-btn-cancel">Cancel</button>
                  <button
                    onClick={() => {
                      let ms = 0;
                      if (lockUnit === "minutes") ms = lockValue * 60 * 1000;
                      else if (lockUnit === "hours") ms = lockValue * 60 * 60 * 1000;
                      else if (lockUnit === "days") ms = lockValue * 24 * 60 * 60 * 1000;
                      const until = Date.now() + Math.max(1, ms);
                      setLockedUntil(until);
                      try {
                        localStorage.setItem("vtc_lock_until", String(until));
                      } catch (e) {}
                      setIsLockOpen(false);
                    }}
                    className="modal-btn-upload"
                  >
                    Lock
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

          <button onClick={() => setIsLockOpen(true)} className="upload-btn" style={{ marginLeft: 8 }}>
            🔒 Lock Capsule
          </button>

          <button onClick={handleDownloadAll} className="upload-btn" style={{ marginLeft: 8 }}>
            📥 Download All
          </button>

          <button onClick={logout} className="logoutbtn">
            Log out
          </button>
        </nav>

        <div className="content" style={{ paddingTop: "150px" }}>
          <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>    
            {lockedUntil && lockedUntil > now ? (
              <div style={{     
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  justifyContent: "center",
                  padding: 40,
                  minHeight: "400px",
                  textAlign: "center"}}>
                <div style={{ fontSize: "80px", marginBottom: "20px" }}>🔒</div>
                <h2 style={{ margin: "0 0 16px 0" }}>Time Capsule Locked</h2>
                <p style={{ color: "#666", fontSize: "18px", margin: "0 0 24px 0" }}>
                  Remaining: {formatRemaining(lockedUntil - now)}
                </p>
                <button
                  onClick={() => {
                    if (confirm("Unlock the capsule now?")) {
                      setLockedUntil(null);
                      try {
                        localStorage.removeItem("vtc_lock_until");
                      } catch (e) {}
                    }
                  }}
                  className="modal-btn-cancel"
                >
                  Unlock Now
                </button>
              </div>
            ) : images.length == 0 ? (
              <div style={{ 
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                justifyContent: "center",
                padding: "40px",
                minHeight: "400px",
                textAlign: "center"
              }}>
                <p style={{ 
                  color: "#999", 
                  fontSize: "18px",
                  margin: 0
                }}>
                  No images uploaded yet. Click "Upload New Image" to add to your
                  time capsule!
                </p>
              </div>
            ) : (
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "20px",
                padding: "20px",
                width: "100%"
              }}>
                {images.map((image, index) => (
                  <div key={index} style={{
                    backgroundColor: "#2a2a2a",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)"
                  }}>
                    <img
                      src={`http://localhost:3001${image.url}`}
                      alt={image.title || `Image ${index}`}
                      style={{
                        width: "100%",
                        height: "250px",
                        objectFit: "cover"
                      }}
                    />
                    <div style={{ padding: "16px" }}>
                      <h2 style={{ margin: 0, fontSize: "18px" }}>{image.title}</h2>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
