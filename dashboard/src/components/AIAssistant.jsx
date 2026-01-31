import React, { useState } from 'react';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: 'Hallo! Ich bin dein ShipNex KI-Helfer. Wie kann ich dir heute zur Seite stehen?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });
            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', text: data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', text: 'Ups, ich habe gerade eine kurze Verbindungspause. Kannst du das bitte wiederholen?' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div
                onClick={() => setIsOpen(true)}
                style={{ position: 'fixed', bottom: '40px', right: '40px', background: 'var(--primary)', color: 'white', padding: '16px', borderRadius: '50%', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.5)', cursor: 'pointer', zIndex: 1000 }}
            >
                <MessageSquare size={24} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass"
                        style={{ position: 'fixed', bottom: '110px', right: '40px', width: '380px', height: '500px', zIndex: 1001, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
                    >
                        <div style={{ background: 'var(--primary)', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MessageSquare size={20} />
                                <span style={{ fontWeight: 600 }}>ShipNex AI Assistent</span>
                            </div>
                            <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
                        </div>

                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {messages.map((m, i) => (
                                <div key={i} style={{
                                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                    background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    padding: '12px 16px',
                                    borderRadius: '16px',
                                    borderBottomRightRadius: m.role === 'user' ? '4px' : '16px',
                                    borderBottomLeftRadius: m.role === 'assistant' ? '4px' : '16px',
                                    maxWidth: '85%',
                                    fontSize: '0.9rem'
                                }}>
                                    {m.text}
                                </div>
                            ))}
                            {loading && <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '16px' }}><Loader2 size={16} className="animate-spin" /></div>}
                        </div>

                        <form onSubmit={sendMessage} style={{ padding: '20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '10px' }}>
                            <input
                                className="input-glass"
                                placeholder="Schreibe eine Nachricht..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                style={{ height: '44px' }}
                            />
                            <button type="submit" className="btn-primary" style={{ padding: '0 16px' }}>
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIAssistant;
