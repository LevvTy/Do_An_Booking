
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    // Check if user is logged in on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    // Load registered users from localStorage
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      setRegisteredUsers(JSON.parse(storedUsers));
    }
  }, []);

  const login = (email, password) => {
    // Check if the email exists in registered users
    const userExists = registeredUsers.find(user => user.email === email);
    
    if (!userExists) {
      return { success: false, message: "Tài khoản chưa được đăng ký" };
    }
    
    // In a real app, we would validate the password here
    // For demo purposes, we're just checking if the email exists
    
    const user = { email, name: userExists.name };
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    setIsAuthenticated(true);
    return { success: true };
  };

  const register = (email, name, password) => {
    // Check if user already exists
    const userExists = registeredUsers.find(user => user.email === email);
    if (userExists) {
      return { success: false, message: "Email đã được sử dụng" };
    }
    
    // Register new user
    const newUser = { email, name, password };
    const updatedUsers = [...registeredUsers, newUser];
    
    // Save to localStorage
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    setRegisteredUsers(updatedUsers);
    
    // Auto login after registration
    localStorage.setItem('user', JSON.stringify({ email, name }));
    setUser({ email, name });
    setIsAuthenticated(true);
    
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
