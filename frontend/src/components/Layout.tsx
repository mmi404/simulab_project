import { Outlet, Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    // const isWorkspace = location.pathname.includes('/simulation/');
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Navbar */}
            <nav className="border-b bg-white px-6 py-3 flex items-center justify-between z-10">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <Zap className="w-6 h-6 fill-current" />
                    SimuLab
                </Link>

                <div className="flex items-center gap-6">
                    <Link to="/explore" className="text-gray-600 hover:text-primary transition-colors font-medium">Explore</Link>
                    {user && (
                        <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors font-medium">Dashboard</Link>
                    )}

                    <div className="flex items-center gap-2 ml-4">
                        {user ? (
                            <div className="relative group">
                                <button className="flex items-center gap-2 focus:outline-none">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </button>
                                {/* Invisible bridge to prevent hover loss */}
                                <div className="absolute top-full right-0 h-2 w-full bg-transparent" />
                                <div className="absolute top-[calc(100%+8px)] right-0 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto border border-gray-100">
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 text-sm font-medium text-primary border border-primary rounded-lg hover:bg-blue-50">Log In</Link>
                                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600 shadow-sm shadow-blue-200">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-gray-50">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
