import React, { useState, useEffect } from 'react'
import axios from 'axios'
import DeleteIcon from '@mui/icons-material/Delete';


function BookmarkStock() {
    const [stock, setStock] = useState('');
    const [operator, setOperator] = useState('');
    const [amount, setAmount] = useState(0);
    const [bookmarks, setBookmarks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8090/api/v1/bookmark/list')
            // .then((response) => response))
            .then((response) => setBookmarks(response.data))
            .then(console.log(bookmarks));
    }, []);

    const handleSave = async () => {
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
    };

    const handleRemove = async (stock) => {
        axios.delete(`http://localhost:8090/api/v1/bookmark/remove/${stock}`);
        setBookmarks(bookmarks.filter((bookmark) => bookmark.stock !== stock));
    };

    return (
        <div>
            <h2>Bookmark Stock</h2>
            <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ width: '150px' }}>Stock Symbol</span>
                    <input
                        type="text"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        style={{ width: '150px', height: '30px', marginBottom: '10px' }}
                    />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ width: '150px' }}>Operator</span>
                    <select
                        value={operator}
                        onChange={(e) => setOperator(e.target.value)}
                        style={{ width: '150px', height: '30px', marginBottom: '10px' }}
                    >
                        <option value="">Select Operator</option>
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value="=">&eq;</option>
                    </select>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ width: '150px' }}>Amount</span>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ width: '150px', height: '30px', marginBottom: '10px' }}
                    />
                </label>
                <button onClick={handleSave} style={{ width: '150px', height: '40px', alignItems: 'center' }}>
                    Save
                </button>
            </form>
            <h2>Bookmarks</h2>
            <ul style={{ display: 'flex', alignItems: 'center' }}>
                {bookmarks && bookmarks.map((bookmark) => (
                    <ul key={bookmark.stock}>
                        <span style={{ marginRight: '20px' }}>
                            {bookmark.stock} {bookmark.operator} {bookmark.amount}
                        </span>
                        <button onClick={() => handleRemove(bookmark.stock)}
                            style={{
                                padding: '2px 8px',
                                fontSize: '20px',
                                borderRadius: '4px',
                            }}>
                            <DeleteIcon sx={{ fontSize: 18 }} />
                        </button>
                    </ul>
                ))}
            </ul>
        </div>
    );
}

export default BookmarkStock