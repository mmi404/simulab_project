import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../services/authService';

interface User {
    name: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedName = localStorage.getItem('userName');
        if (storedToken && storedName) {
            setUser({ name: storedName, token: storedToken });
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const data = await loginApi(email, password);
        const userData = { name: data.name, token: data.token };
        setUser(userData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);
    };

    const register = async (name: string, email: string, password: string) => {
        const data = await registerApi(name, email, password);
        const userData = { name: data.name, token: data.token };
        setUser(userData);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userName', data.name);
    };

    const logout = () => {
        logoutApi();
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
