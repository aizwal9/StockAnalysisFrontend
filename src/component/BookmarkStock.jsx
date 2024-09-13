import React, { useState, useEffect } from 'react'
import axios from 'axios'

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
            <form>
                <label>
                    Stock Symbol:
                    <input
                        type="text"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                </label>
                <label>
                    Operator:
                    <input
                        type="text"
                        value={operator}
                        onChange={(e) => setOperator(e.target.value)}
                    />
                </label>
                <label>
                    Amount:
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </label>
                <button onClick={handleSave}>Save</button>
            </form>
            <h2>Bookmarks</h2>
            <ul>
                {bookmarks && bookmarks.map((bookmark) => (
                    <ul key={bookmark.stock}>
                        {bookmark.stock} {bookmark.operator} {bookmark.amount}
                        <button onClick={() => handleRemove(bookmark.stock)}>x</button>
                    </ul>
                ))}
            </ul>
        </div>
    );
}

export default BookmarkStock