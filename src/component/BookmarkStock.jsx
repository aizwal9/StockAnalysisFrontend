import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete';

const lightTheme = {
  card: '#fff',
  cardAlt: '#f7f9fc',
  text: '#222',
  textSecondary: '#888',
  accent: '#1976d2',
  inputBg: '#f7f9fc',
  inputText: '#222',
  border: '#b0b0b0',
  error: '#d32f2f',
  shadow: '0 4px 24px rgba(0,0,0,0.08)',
};
const darkTheme = {
  card: '#23272f',
  cardAlt: '#2c313a',
  text: '#f1f1f1',
  textSecondary: '#b0b0b0',
  accent: '#90caf9',
  inputBg: '#23272f',
  inputText: '#f1f1f1',
  border: '#444',
  error: '#ef5350',
  shadow: '0 4px 24px rgba(0,0,0,0.32)',
};

function BookmarkStock({ theme = 'light' }) {
    const themeObj = theme === 'dark' ? darkTheme : lightTheme;
    const [stock, setStock] = useState('');
    const [operator, setOperator] = useState('');
    const [amount, setAmount] = useState(0);
    const [bookmarks, setBookmarks] = useState([]);
    const [saving, setSaving] = useState(false);
    const fontSize = 'clamp(1rem, 2vw, 1.1rem)';

    useEffect(() => {
        axios.get('http://localhost:8090/api/v1/bookmark/list')
            .then((response) => setBookmarks(response.data));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!stock || !operator || !amount) return;
        setSaving(true);
        const bookmark = { stock, operator, amount };
        const response = await fetch('http://localhost:8090/api/v1/bookmark/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookmark),
        });
        const savedBookmark = await response.json();
        setBookmarks([...bookmarks, savedBookmark]);
        setStock('');
        setOperator('');
        setAmount(0);
        setSaving(false);
    };

    const handleRemove = async (stock) => {
        axios.delete(`http://localhost:8090/api/v1/bookmark/remove/${stock}`);
        setBookmarks(bookmarks.filter((bookmark) => bookmark.stock !== stock));
    };

    return (
        <div style={{ width: '100%' }}>
            <div style={{
                background: themeObj.card,
                borderRadius: '12px',
                boxShadow: themeObj.shadow,
                padding: '20px 18px 18px 18px',
                marginBottom: 18,
                width: '100%',
                minWidth: 220,
                maxWidth: 380,
                margin: '0 auto',
                transition: 'background 0.3s',
            }}>
                <h3 style={{ color: themeObj.accent, marginBottom: 16, textAlign: 'center', letterSpacing: 1, fontSize }}>Add Bookmark</h3>
                <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={handleSave}>
                    <input
                        type="text"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="Stock Symbol"
                        style={{
                            height: 38,
                            borderRadius: 8,
                            border: `1px solid ${themeObj.border}`,
                            padding: '8px 12px',
                            fontSize,
                            background: themeObj.inputBg,
                            color: themeObj.inputText,
                            transition: 'border 0.2s, background 0.3s, color 0.3s',
                        }}
                        disabled={saving}
                    />
                    <select
                        value={operator}
                        onChange={(e) => setOperator(e.target.value)}
                        style={{
                            height: 38,
                            borderRadius: 8,
                            border: `1px solid ${themeObj.border}`,
                            padding: '8px 12px',
                            fontSize,
                            background: themeObj.inputBg,
                            color: themeObj.inputText,
                            transition: 'border 0.2s, background 0.3s, color 0.3s',
                        }}
                        disabled={saving}
                    >
                        <option value="">Select Operator</option>
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value="=">=</option>
                    </select>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount"
                        style={{
                            height: 38,
                            borderRadius: 8,
                            border: `1px solid ${themeObj.border}`,
                            padding: '8px 12px',
                            fontSize,
                            background: themeObj.inputBg,
                            color: themeObj.inputText,
                            transition: 'border 0.2s, background 0.3s, color 0.3s',
                        }}
                        disabled={saving}
                    />
                    <button
                        type="submit"
                        style={{
                            height: 42,
                            borderRadius: 8,
                            background: saving ? themeObj.border : themeObj.accent,
                            color: '#fff',
                            fontWeight: 600,
                            fontSize,
                            border: 'none',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            marginTop: 4,
                            transition: 'background 0.2s',
                        }}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                </form>
            </div>
            <div style={{
                background: themeObj.cardAlt,
                borderRadius: '12px',
                boxShadow: themeObj.shadow,
                padding: '16px 12px',
                width: '100%',
                minHeight: 120,
                maxHeight: 260,
                overflowY: 'auto',
                transition: 'background 0.3s',
            }}>
                <h4 style={{ color: themeObj.accent, marginBottom: 10, letterSpacing: 1, textAlign: 'center', fontSize }}>Bookmarks</h4>
                {bookmarks && bookmarks.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {bookmarks.map((bookmark) => (
                            <li key={bookmark.stock} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 0',
                                borderBottom: `1px solid ${themeObj.card}`,
                                transition: 'background 0.2s',
                                color: themeObj.text,
                                fontSize,
                            }}>
                                <span style={{ fontWeight: 500, color: themeObj.text, fontSize }}>
                                    <span role="img" aria-label="stock" style={{ marginRight: 6 }}>⭐</span>
                                    {bookmark.stock} {bookmark.operator} {bookmark.amount}
                                </span>
                                <button
                                    onClick={() => handleRemove(bookmark.stock)}
                                    style={{
                                        padding: '2px 8px',
                                        fontSize: '20px',
                                        borderRadius: '4px',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: themeObj.error,
                                        display: 'flex',
                                        alignItems: 'center',
                                        transition: 'background 0.2s',
                                    }}
                                    title="Remove bookmark"
                                >
                                    <DeleteIcon sx={{ fontSize: 18 }} />
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div style={{ color: themeObj.textSecondary, textAlign: 'center', marginTop: 24, fontSize }}>
                        No bookmarks yet.
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookmarkStock