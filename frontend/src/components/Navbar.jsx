import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';
import { Home, LogOut, User as UserIcon } from 'lucide-react';
import { useGoogleOneTapLogin } from '@react-oauth/google';

const Navbar = () => {
    const { user, login, logout } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const navigate = useNavigate();

    useGoogleOneTapLogin({
        onSuccess: async (credentialResponse) => {
            try {
                // Decode the JWT credential
                const base64Url = credentialResponse.credential.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
                const decodedToken = JSON.parse(jsonPayload);
                
                await login(decodedToken, 'GUEST');
            } catch (err) {
                console.error("Auto login failed", err);
            }
        },
        onError: () => {
            console.log('One Tap Login Failed');
        },
        disabled: user !== null // Disable if already logged in
    });

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <nav className="navbar glass">
                <div className="container nav-container">
                    <Link to="/" className="logo">
                        <Home size={28} /> Malnad Gold Homestay
                    </Link>
                    
                    <div className="nav-actions">
                        {user ? (
                            <>
                                {user.role === 'ADMIN' && (
                                    <Link to="/admin" className="btn btn-secondary">Admin Dashboard</Link>
                                )}
                                {user.role === 'GUEST' && (
                                    <Link to="/bookings" className="btn btn-primary">Our Bookings</Link>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem' }}>
                                    <img 
                                        src={user.picture || 'https://via.placeholder.com/40'} 
                                        alt={user.name} 
                                        style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                    />
                                    <span style={{ fontWeight: '500' }}>{user.name}</span>
                                </div>
                                <button className="btn" onClick={handleLogout} style={{ border: '1px solid var(--danger)', color: 'var(--danger)', marginLeft: '1rem' }}>
                                    <LogOut size={18} /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-primary" onClick={() => setIsAuthModalOpen(true)}>
                                    Login
                                </button>
                                <button className="btn btn-secondary" onClick={() => setIsAuthModalOpen(true)}>
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </>
    );
};

export default Navbar;
