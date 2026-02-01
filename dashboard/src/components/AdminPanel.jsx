import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, Play, Search, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPanel = () => {
    const [allShops, setAllShops] = useState([]);
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [simulating, setSimulating] = useState(false);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [shopsRes, healthRes] = await Promise.all([
                fetch('/api/admin/shops'),
                fetch('/api/admin/health')
            ]);

            const shopsData = await shopsRes.json();
            const healthData = await healthRes.json();

            // Ensure shopsData is an array to avoid crashes
            setAllShops(Array.isArray(shopsData) ? shopsData : []);
            setHealth(healthData);
            console.log('Admin Data loaded:', { shopsData, healthData });
        } catch (err) {
            console.error('Admin Fetch Error:', err);
            setAllShops([]); // Reset to empty array on error
        }
        setLoading(false);
    };

    const runSimulation = async () => {
        setSimulating(true);
        try {
            const res = await fetch('/api/admin/simulate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'admin-test@shipnex24.com',
                    domain: `admin-test-${Math.floor(Math.random() * 1000)}.shipnex24.com`,
                    packageType: 'business'
                })
            });
            const data = await res.json();
            if (data && data.success) {
                alert('Simulation erfolgreich gestartet!');
                fetchData();
            } else {
                alert('Fehler: ' + (data?.details || 'Unbekannter Fehler'));
            }
        } catch (err) {
            alert('Simulation fehlgeschlagen: ' + err.message);
        }
        setSimulating(false);
    };

    const filteredShops = Array.isArray(allShops) ? allShops.filter(shop =>
        shop?.domain?.toLowerCase().includes(filter.toLowerCase()) ||
        shop?.user_id?.toLowerCase().includes(filter.toLowerCase())
    ) : [];

    if (loading && allShops.length === 0) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px', gap: '20px' }}>
                <RefreshCw className="animate-spin" size={48} color="var(--primary)" />
                <p style={{ color: 'var(--text-muted)' }}>Lade Admin-Daten...</p>
            </div>
        );
    }

    return (
        <div style={{ color: 'var(--text)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Shield color="var(--primary)" size={32} /> Admin Kontrollzentrum
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>Überwache alle Projekte und teste Systemfunktionen.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={fetchData} className="glass" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', border: '1px solid var(--border)' }}>
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Aktualisieren
                    </button>
                    <button
                        onClick={runSimulation}
                        disabled={simulating}
                        className="btn-primary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: simulating ? 0.7 : 1 }}
                    >
                        <Play size={18} fill="currentColor" /> Zahlung simulieren
                    </button>
                </div>
            </div>

            {/* Health Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: health?.database === 'connected' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '12px' }}>
                        {health?.database === 'connected' ? <CheckCircle color="var(--success)" size={24} /> : <AlertCircle color="var(--error)" size={24} />}
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Datenbank Status</div>
                        <div style={{ fontWeight: 600 }}>{health?.database === 'connected' ? 'Verbunden' : 'Fehler / Wartend'}</div>
                    </div>
                </div>
                <div className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '10px', borderRadius: '12px' }}>
                        <Shield color="var(--primary)" size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>System Version</div>
                        <div style={{ fontWeight: 600 }}>ShipNex24 v1.2 (Admin Alpha)</div>
                    </div>
                </div>
            </div>

            {/* Shop List */}
            <div className="glass" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Alle Kunden-Shops ({allShops.length})</h3>
                    <div style={{ position: 'relative' }}>
                        <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={16} />
                        <input
                            type="text"
                            placeholder="Suchen..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="input-glass"
                            style={{ paddingLeft: '40px', width: '250px', background: 'var(--input-bg)' }}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left' }}>
                                <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Domain</th>
                                <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
                                <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Erstellt am</th>
                                <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Aktionen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredShops.map(shop => (
                                <tr key={shop.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '16px 12px' }}>{shop.domain}</td>
                                    <td style={{ padding: '16px 12px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 600,
                                            background: shop.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                            color: shop.status === 'active' ? 'var(--success)' : 'var(--text-muted)'
                                        }}>
                                            {shop.status?.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px 12px', fontSize: '0.875rem' }}>{new Date(shop.created_at).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px 12px' }}>
                                        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.875rem' }}>Einsicht</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
