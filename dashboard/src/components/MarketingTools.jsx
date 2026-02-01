import React, { useState } from 'react';
import { Users, Mail, Eye, Send, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const MarketingTools = () => {
    const [view, setView] = useState('leads'); // 'leads' | 'campaign' | 'spy'
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    // Inputs
    const [leadInput, setLeadInput] = useState({ industry: '', location: '', jobTitle: '' });
    const [campaignInput, setCampaignInput] = useState({ name: '', subject: '', body: '' });
    const [spyInput, setSpyInput] = useState('');

    const handleAction = async (endpoint, body) => {
        setLoading(true);
        setResult(null);
        try {
            const res = await fetch(`/api/marketing/${endpoint}`, {
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
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, background: 'linear-gradient(to right, #f59e0b, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
                    Growth Engine
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    Automatisieren Sie Ihr Marketing und gewinnen Sie neue Kunden.
                </p>
            </div>

            <div className="glass" style={{ padding: '8px', display: 'flex', gap: '8px', marginBottom: '32px', borderRadius: '16px', width: 'fit-content', margin: '0 auto 32px auto' }}>
                {[
                    { id: 'leads', icon: Users, label: 'B2B Leads' },
                    { id: 'campaign', icon: Mail, label: 'Campaigns' },
                    { id: 'competitor', icon: Eye, label: 'Competitor Spy' }
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

            <motion.div key={view} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass" style={{ padding: '40px' }}>

                {view === 'leads' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                        <input placeholder="Industry (e.g. SaaS)" className="input-field" value={leadInput.industry} onChange={e => setLeadInput({ ...leadInput, industry: e.target.value })} />
                        <input placeholder="Location (e.g. London)" className="input-field" value={leadInput.location} onChange={e => setLeadInput({ ...leadInput, location: e.target.value })} />
                        <input placeholder="Job Title (e.g. CEO)" className="input-field" value={leadInput.jobTitle} onChange={e => setLeadInput({ ...leadInput, jobTitle: e.target.value })} />
                        <button className="btn-primary" style={{ gridColumn: '1 / -1' }} disabled={loading} onClick={() => handleAction('leads', leadInput)}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Find Verified Leads'}
                        </button>
                    </div>
                )}

                {view === 'campaign' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <input placeholder="Campaign Name" className="input-field" value={campaignInput.name} onChange={e => setCampaignInput({ ...campaignInput, name: e.target.value })} />
                        <input placeholder="Email Subject" className="input-field" value={campaignInput.subject} onChange={e => setCampaignInput({ ...campaignInput, subject: e.target.value })} />
                        <textarea placeholder="Email Body" className="input-field" rows={5} value={campaignInput.body} onChange={e => setCampaignInput({ ...campaignInput, body: e.target.value })} />
                        <button className="btn-primary" disabled={loading} onClick={() => handleAction('campaign', { ...campaignInput, leads: [1, 2, 3] })}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Launch Campaign'}
                        </button>
                    </div>
                )}

                {view === 'competitor' && (
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <input placeholder="Competitor URL (e.g. competitorshop.com)" className="input-field" style={{ flex: 1 }} value={spyInput} onChange={e => setSpyInput(e.target.value)} />
                        <button className="btn-primary" disabled={loading} onClick={() => handleAction('competitor', { url: spyInput })}>
                            {loading ? <Loader2 className="animate-spin" /> : 'Analyze'}
                        </button>
                    </div>
                )}

                {/* Results Display */}
                {result && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: '32px' }}>
                        {result.leads ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {result.leads.map((lead, i) => (
                                    <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{lead.firstName} {lead.lastName}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{lead.company} • {lead.jobTitle}</div>
                                        </div>
                                        <div style={{ color: 'var(--success)' }}>{lead.email}</div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', color: 'var(--text-muted)', padding: '24px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                                {JSON.stringify(result, null, 2)}
                            </pre>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default MarketingTools;
