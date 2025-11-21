import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AccountCreation from "./pages/AccountCreation";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path = '/' element = {<Landing/>} />
                    <Route path = 'login' element = {<Login/>} />
                    <Route path = 'signup' element = {<AccountCreation/>} />
                    <Route path = 'dashboard' 
                        element = {
                        <ProtectedRoute>
                            <Dashboard/>
                        </ProtectedRoute>
                        } 
                    />
                    <Route path = '*' element = {<Landing/>} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;