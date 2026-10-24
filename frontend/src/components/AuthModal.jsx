import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { X, User, Home } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                // Fetch user info from Google using access token
                const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });
                
                await login(userInfo.data, window.selectedRole);
                onClose();
            } catch (err) {
                console.error('Error fetching google user info', err);
                alert("Login failed. Please try again.");
                setLoading(false);
            }
        },
        onError: () => {
            console.error('Login Failed');
            setLoading(false);
        }
    });

    const triggerLogin = (role) => {
        setLoading(true);
        window.selectedRole = role; // Temporary ugly hack to pass role to google onSuccess
        handleGoogleLogin();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content animate-fade-in p-6" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2>Login or Sign Up</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>
                
                <p style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Choose your account type to proceed.</p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button 
                        className="btn btn-primary" 
                        style={{ padding: '1rem', fontSize: '1.1rem' }}
                        onClick={() => triggerLogin('GUEST')}
                        disabled={loading}
                    >
                        <User size={24} /> Login as Guest
                    </button>
                    
                    <button 
                        className="btn btn-secondary" 
                        style={{ padding: '1rem', fontSize: '1.1rem' }}
                        onClick={() => triggerLogin('ADMIN')}
                        disabled={loading}
                    >
                        <Home size={24} /> Login as Homestay Admin
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
