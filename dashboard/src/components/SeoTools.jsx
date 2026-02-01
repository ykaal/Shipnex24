import React, { useState } from 'react';
import { Search, FileText, Tag, BarChart2, Loader2, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const SeoTools = () => {
    const [view, setView] = useState('meta'); // 'meta' | 'audit' | 'keywords'
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Inputs
    const [metaInput, setMetaInput] = useState({ title: '', description: '', niche: '' });
    const [auditInput, setAuditInput] = useState({ content: '', mainKeyword: '' });
    const [keywordInput, setKeywordInput] = useState('');

    const handleAction = async (endpoint, body) => {
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch(`/api/seo/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            setResult(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #10b981, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
                    SEO Master Suite
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    Ranken Sie #1 mit AI-optimierten Inhalten und Keywords.
                </p>
            </div>

            <div className="glass" style={{ padding: '8px', display: 'flex', gap: '8px', marginBottom: '32px', borderRadius: '16px', width: 'fit-content', margin: '0 auto 32px auto' }}>
                {[
                    { id: 'meta', icon: Tag, label: 'Meta Tags' },
                    { id: 'audit', icon: FileText, label: 'Content Audit' },
                    { id: 'keywords', icon: BarChart2, label: 'Keywords' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setView(tab.id); setResult(null); }}
                        style={{ padding: '10px 24px', borderRadius: '12px', border: 'none', background: view === tab.id ? 'var(--primary)' : 'transparent', color: view === tab.id ? 'white' : 'var(--text-muted)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <tab.icon size={16} /> {tab.label}
                    </button>
                ))}
            </div>

            <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: '40px' }}>

                {view === 'meta' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input placeholder="Product Name / Page Title" className="input-field" value={metaInput.title} onChange={e => setMetaInput({ ...metaInput, title: e.target.value })} />
                        <textarea placeholder="Description / Context" className="input-field" rows={3} value={metaInput.description} onChange={e => setMetaInput({ ...metaInput, description: e.target.value })} />
                        <input placeholder="Niche (e.g. Shoes)" className="input-field" value={metaInput.niche} onChange={e => setMetaInput({ ...metaInput, niche: e.target.value })} />
                        <button className="btn-primary" disabled={loading} onClick={() => handleAction('generate', metaInput)}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Generate Meta Tags'}
                        </button>
                    </div>
                )}

                {view === 'audit' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <textarea placeholder="Paste your content here..." className="input-field" rows={6} value={auditInput.content} onChange={e => setAuditInput({ ...auditInput, content: e.target.value })} />
                        <input placeholder="Target Keyword" className="input-field" value={auditInput.mainKeyword} onChange={e => setAuditInput({ ...auditInput, mainKeyword: e.target.value })} />
                        <button className="btn-primary" disabled={loading} onClick={() => handleAction('audit', auditInput)}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Audit Content'}
                        </button>
                    </div>
                )}

                {view === 'keywords' && (
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <input placeholder="Topic (e.g. Coffee)" className="input-field" style={{ flex: 1 }} value={keywordInput} onChange={e => setKeywordInput(e.target.value)} />
                        <button className="btn-primary" disabled={loading} onClick={() => handleAction('keywords', { topic: keywordInput })}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Find Keywords'}
                        </button>
                    </div>
                )}

                {/* Results Display */}
                {result && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '32px', padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '16px' }}>
                        <h3 style={{ marginBottom: '16px' }}>Result:</h3>
                        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                            {JSON.stringify(result, null, 2)}
                        </pre>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default SeoTools;
