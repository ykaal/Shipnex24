import React, { useState } from 'react';
import { Search, Globe, CheckCircle, XCircle, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const DomainTools = () => {
    const [view, setView] = useState('check'); // 'check' | 'generator'
    const [domain, setDomain] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [aiCriterias, setAiCriterias] = useState({ niche: '', keyword: '' });
    const [suggestions, setSuggestions] = useState([]);

    const checkDomain = async () => {
        if (!domain) return;
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch(`/api/domain/check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain })
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const generateIdeas = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/domain/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(aiCriterias)
            });
            const data = await res.json();
            setSuggestions(data.suggestions || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
                    Domain Intelligence
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    Finden Sie die perfekte Domain für Ihr nächstes Business.
                </p>
            </div>

            <div className="glass" style={{ padding: '8px', display: 'flex', gap: '8px', marginBottom: '32px', borderRadius: '16px', width: 'fit-content', margin: '0 auto 32px auto' }}>
                <button
                    onClick={() => setView('check')}
                    style={{ flex: 1, padding: '10px 24px', borderRadius: '12px', border: 'none', background: view === 'check' ? 'var(--primary)' : 'transparent', color: view === 'check' ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                >
                    <Search size={16} style={{ display: 'inline', marginRight: '8px' }} /> Availability
                </button>
                <button
                    onClick={() => setView('generator')}
                    style={{ flex: 1, padding: '10px 24px', borderRadius: '12px', border: 'none', background: view === 'generator' ? 'var(--primary)' : 'transparent', color: view === 'generator' ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}
                >
                    <Sparkles size={16} style={{ display: 'inline', marginRight: '8px' }} /> AI Generator
                </button>
            </div>

            {view === 'check' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: '40px' }}>
                    <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                        <input
                            type="text"
                            placeholder="shipnex.com"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1.1rem', outline: 'none' }}
                        />
                        <button
                            onClick={checkDomain}
                            disabled={loading}
                            className="btn-primary"
                            style={{ padding: '0 32px', fontSize: '1.1rem' }}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Check'}
                        </button>
                    </div>

                    {result && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '32px', background: result.available ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '16px', border: `1px solid ${result.available ? 'var(--success)' : 'var(--error)'}` }}>
                            {result.available ? (
                                <>
                                    <CheckCircle size={48} color="var(--success)" style={{ marginBottom: '16px' }} />
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{result.domain} ist verfügbar!</h2>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Preis: <span style={{ color: 'white', fontWeight: 'bold' }}>{result.price}</span></p>
                                    <button className="btn-primary">Jetzt registrieren</button>
                                </>
                            ) : (
                                <>
                                    <XCircle size={48} color="var(--error)" style={{ marginBottom: '16px' }} />
                                    <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{result.domain} ist vergeben.</h2>
                                    <p style={{ color: 'var(--text-muted)' }}>Versuchen Sie eine andere Endung oder Variation.</p>
                                </>
                            )}
                        </motion.div>
                    )}
                </motion.div>
            )}

            {view === 'generator' && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: '40px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                        <input
                            type="text"
                            placeholder="Niche (e.g. Fashion, Tech)"
                            value={aiCriterias.niche}
                            onChange={(e) => setAiCriterias({ ...aiCriterias, niche: e.target.value })}
                            style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', outline: 'none' }}
                        />
                        <input
                            type="text"
                            placeholder="Keyword (optional)"
                            value={aiCriterias.keyword}
                            onChange={(e) => setAiCriterias({ ...aiCriterias, keyword: e.target.value })}
                            style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '1rem', outline: 'none' }}
                        />
                    </div>
                    <button
                        onClick={generateIdeas}
                        disabled={loading}
                        className="btn-primary"
                        style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginBottom: '40px' }}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : ' ✨ Domains generieren'}
                    </button>

                    {suggestions.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                            {suggestions.map((idea, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="glass"
                                    style={{ padding: '16px', textAlign: 'center', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }}
                                    whileHover={{ scale: 1.05, borderColor: 'var(--primary)' }}
                                >
                                    <Globe size={24} color="var(--primary)" style={{ marginBottom: '8px' }} />
                                    <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>{idea}</p>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default DomainTools;
