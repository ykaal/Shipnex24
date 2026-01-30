import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Ship, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={{ width: '100%', maxWidth: '450px', padding: '40px' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                    <div style={{ background: 'var(--primary)', padding: '10px', borderRadius: '12px' }}>
                        <Ship size={24} color="white" />
                    </div>
                    <h1 className="card-title" style={{ margin: 0 }}>ShipNex24</h1>
                </div>

                <h2 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Willkommen zurück</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Loggen Sie sich ein, um Ihre Shops zu verwalten.</p>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '8px' }}>E-Mail Adresse</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                className="input-glass"
                                placeholder="name@beispiel.de"
                                style={{ paddingLeft: '44px' }}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Passwort</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                className="input-glass"
                                placeholder="••••••••"
                                style={{ paddingLeft: '44px' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: 'var(--error)', fontSize: '0.875rem', marginBottom: '20px' }}>{error}</p>}

                    <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} disabled={loading}>
                        {loading ? 'Anmeldung...' : 'Einloggen'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Noch kein Konto? Kontaktiere den Support.
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
