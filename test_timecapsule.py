import os           
import pytest         
from timecapsule import TimeCapsuleApp  
from dotenv import load_dotenv

load_dotenv()

@pytest.fixture
def app():
    timecapsule_app = TimeCapsuleApp()
    app, _ = timecapsule_app.initialize_app()
    return app

def test_environment_variables_load():
    secret_key = os.getenv("SECRET_KEY")
    jwt_secret = os.getenv("JWT_SECRET_KEY")

    assert secret_key is not None
    assert jwt_secret is not None

def test_app_initialization(app):
    configuration = app.config
    assert "SQLALCHEMY_DATABASE_URI" in configuration
    assert "UPLOAD_FOLDER" in configuration
  

def test_upload_folder_created(app):
    path = app.config["UPLOAD_FOLDER"]
    assert "uploads" in path 
    assert os.path.exists(path)