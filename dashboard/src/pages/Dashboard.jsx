import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Globe, ExternalLink, Mail, CreditCard, LogOut, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import AIAssistant from '../components/AIAssistant';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) {
                navigate('/login');
            } else {
                setUser(currentUser);
                fetchShops(currentUser.id);
            }
        };
        checkUser();
    }, [navigate]);

    const fetchShops = async (userId) => {
        const { data, error } = await supabase
            .from('client_shops')
            .select('*')
            .eq('user_id', userId);

        if (!error) setShops(data);
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const openStripePortal = async () => {
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('stripe_customer_id')
                .eq('id', user.id)
                .single();

            if (profile?.stripe_customer_id) {
                const response = await fetch('/api/billing/portal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ customerId: profile.stripe_customer_id })
                });
                const data = await response.json();
                if (data.url) window.location.href = data.url;
            } else {
                alert('Keine Stripe-Daten gefunden.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex' }}>
            {/* Sidebar */}
            <div className="glass" style={{ width: '280px', margin: '20px', borderRadius: '24px', display: 'flex', flexDirection: 'column', padding: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
                    <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '10px' }}>
                        <LayoutDashboard size={20} color="white" />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>ShipNex24</span>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', fontWeight: 600 }}>
                        <Globe size={18} /> Meine Shops
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: 'var(--text-muted)' }}>
                        <Mail size={18} /> Postfächer
                    </div>
                    <div onClick={openStripePortal} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        <CreditCard size={18} /> Abrechnung
                    </div>
                </nav>

                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', cursor: 'pointer' }}>
                    <LogOut size={18} /> Abmelden
                </button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px 40px 40px 10px', overflowY: 'auto' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div>
                        <h1 className="card-title">Willkommen, {user?.email}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Hier ist der Überblick über Ihre aktuellen Projekte.</p>
                    </div>
                    <button onClick={() => window.location.href = 'https://shipnex24.com'} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Neuen Shop buchen
                    </button>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
                    {shops.length > 0 ? shops.map((shop) => (
                        <motion.div key={shop.id} whileHover={{ y: -5 }} className="glass" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', marginBottom: '4px' }}>{shop.domain || shop.shop_name}</h3>
                                    <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', fontWeight: 600 }}>
                                        {(shop.status || 'ACTIVE').toUpperCase()}
                                    </span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '50%' }}>
                                    <Globe size={20} color="var(--primary)" />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>WordPress:</span>
                                    <a href={shop.admin_url || `${shop.wp_url || '#'}/wp-admin`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        Admin öffnen <ExternalLink size={14} />
                                    </a>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>Postfächer:</span>
                                    <span>{shop.mailbox_count || 0} / 5</span>
                                </div>
                            </div>

                            <button style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'white', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>
                                Details ansehen
                            </button>
                        </motion.div>
                    )) : (
                        <div className="glass" style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Bisher wurden noch keine Shops erstellt.</p>
                            <button onClick={() => window.location.href = 'https://shipnex24.com'} className="btn-primary">Jetzt starten</button>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Assistant Widget */}
            <AIAssistant />
        </div>
    );
};

export default Dashboard;
