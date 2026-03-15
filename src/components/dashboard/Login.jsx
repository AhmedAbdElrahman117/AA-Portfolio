import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Swal from 'sweetalert2';
import { initFirebase } from '../../lib/firebase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please enter both email and password.',
                background: '#1a1a1a',
                color: '#fff',
                confirmButtonColor: '#2196F3'
            });
            return;
        }

        // Domain validation from original code
        if (!email.endsWith('@aa.com')) {
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'Only authorized administrators can access the dashboard.',
                background: '#1a1a1a',
                color: '#fff',
                confirmButtonColor: '#2196F3'
            });
            return;
        }

        setLoading(true);
        const { auth } = await initFirebase();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'Welcome back to the dashboard!',
                background: '#1a1a1a',
                color: '#fff',
                confirmButtonColor: '#2196F3',
                timer: 1500,
                showConfirmButton: false
            });
            // State will be handled by the parent App component (onAuthStateChanged)
        } catch (error) {
            console.error("Login mapping error", error);
            let message = error.message || 'Invalid email or password.';

            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: message,
                footer: `Error code: ${error.code || 'Unknown'}`,
                background: '#1a1a1a',
                color: '#fff',
                confirmButtonColor: '#2196F3'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-md relative overflow-hidden">
            {/* Background elements simulating original login design */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[400px] h-[400px] bg-brand-light/20 rounded-full blur-[80px] top-[-100px] right-[-100px] animate-pulse-slow"></div>
                <div className="absolute w-[300px] h-[300px] bg-brand-dark/20 rounded-full blur-[60px] bottom-[-50px] left-[-50px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="glass-effect w-full max-w-[420px] p-2xl rounded-2xl relative z-10 shadow-2xl border-t border-white/10">
                <div className="text-center mb-xl">
                    <div className="w-[80px] h-[80px] mx-auto bg-gradient-to-br from-brand-light to-brand-dark rounded-full flex items-center justify-center relative mb-md shadow-glow">
                        <span className="text-3xl font-bold text-white tracking-wider">AA</span>
                        <div className="absolute w-full h-full border border-brand-light/50 rounded-full animate-ping"></div>
                    </div>
                    <h2 className="text-2xl font-bold text-text-primary mb-xs font-sans">Admin Portal</h2>
                    <p className="text-sm text-text-muted">Enter your credentials to continue</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-lg">
                    <div className="relative group">
                        <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-brand-light"></i>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/40 border border-border text-text-primary rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-light transition-colors"
                            placeholder="Admin Email"
                            required
                        />
                    </div>

                    <div className="relative group">
                        <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-brand-light"></i>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-border text-text-primary rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-brand-light transition-colors"
                            placeholder="Password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-brand-light to-brand-dark text-white font-medium py-3 rounded-xl shadow-md hover:shadow-glow hover:-translate-y-[2px] transition-all duration-300 disabled:opacity-70 disabled:pointer-events-none mt-2 flex justify-center items-center gap-2"
                    >
                        {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sign-in-alt"></i>}
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>

                <div className="mt-xl text-center">
                    <a href="/" className="text-sm text-text-muted hover:text-brand-light transition-colors flex items-center justify-center gap-2">
                        <i className="fas fa-arrow-left"></i> Back to Portfolio
                    </a>
                </div>
            </div>
        </div>
    );
}
