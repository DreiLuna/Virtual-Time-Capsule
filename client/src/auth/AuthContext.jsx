import { createContext, useContext, useMemo, useState, useEffect} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  //stores user info
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  //Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    const storedToken = localStorage.getItem('auth_token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading  (false);
  }, []);

  //send data to backend
  const register = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST', 
        headers: {'Context-Type': 'application/json'},
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.message || 'Registration failed' };
      }

      //auto-login after registration
      const { token: accessToken, user: userData} = data;
      setToken(accessToken);
      setUser(userData);
      localStorage.setItem('auth_token', accessToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));

      return {success: true};

  } catch (error) {
      return { error: 'Network error' };
    }
  };
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('test');
      console.log(data);
      if (!response.ok) {
        return { error: data.message || 'Login failed' };
      }

      //if successful, store token and user data in state and localStorage
      const { token: accessToken, user: userData } = data;
      setToken(accessToken);
      setUser(userData);
      localStorage.setItem('auth_token', accessToken);
      localStorage.setItem('auth_user', JSON.stringify(userData));
      return { success: true };

    } catch (error) {
      return { error: 'Network error' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const value = useMemo(
    () => ({user, token, register, login, logout, isAuthed: !!token }),
    [user, token]
  );

  if (loading) {
    return (
      <div style ={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        Loading...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
