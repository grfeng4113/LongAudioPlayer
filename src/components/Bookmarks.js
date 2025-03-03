import React, { useContext, useState } from "react";
import AudioContext from "./AudioContext";
import { formatTime } from "./utils";

const Bookmarks = () => {
    const { bookmarks, addBookmark, renameBookmark, playBookmark, removeBookmark } = useContext(AudioContext);
    const [collapsed, setCollapsed] = useState(false);
    const [editing, setEditing] = useState(null);
    const [editValue, setEditValue] = useState("");

    const handleRename = (time) => {
        if (editValue.trim() !== "") {
            renameBookmark(time, editValue.trim());
        }
        setEditing(null);
    };

    return (
        <div style={styles.container}>
            <h3>📌 Bookmarks</h3>

            {/* Expand/Collapse Bookmarks */}
            <button onClick={() => setCollapsed(!collapsed)} style={styles.toggleButton}>
                {collapsed ? "📂 Expand Bookmarks" : "📁 Hide Bookmarks"}
            </button>

            {!collapsed && (
                <>
                    {/* Add Bookmark Button */}
                    <button onClick={addBookmark} style={styles.addButton}>➕ Add Bookmark</button>

                    {/* Bookmark List */}
                    <ul style={styles.bookmarkList}>
                        {bookmarks.length === 0 ? (
                            <li style={styles.emptyText}>No bookmarks available</li>
                        ) : (
                            bookmarks.map(({ time, name }, index) => (
                                <li key={index} style={styles.bookmarkItem}>
                                    
                                    {/* Display Time */}
                                    <span style={styles.timeText}>{formatTime(time)}</span>

                                    {/* Click to Play */}
                                    {editing === time ? (
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            style={styles.nameInput}
                                            autoFocus
                                        />
                                    ) : (
                                        <span onClick={() => playBookmark(time)} style={styles.bookmarkText}>
                                            🎵 {name}
                                        </span>
                                    )}

                                    {/* Edit & Confirm Buttons */}
                                    {editing === time ? (
                                        <button onClick={() => handleRename(time)} style={styles.confirmButton}>
                                            ✔️
                                        </button>
                                    ) : (
                                        <button onClick={() => { setEditing(time); setEditValue(name); }} style={styles.renameButton}>
                                            ✏️
                                        </button>
                                    )}

                                    {/* Delete Bookmark */}
                                    <button onClick={() => removeBookmark(time)} style={styles.deleteButton}>❌</button>
                                </li>
                            ))
                        )}
                    </ul>
                </>
            )}
        </div>
    );
};

const styles = {
    container: {
        marginTop: "20px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        width: "90%", 
        maxWidth: "400px", 
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        marginLeft: "auto",
        marginRight: "auto",
    },
    toggleButton: {
        width: "100%",
        marginBottom: "10px",
        padding: "10px",
        fontSize: "14px",
        cursor: "pointer",
        borderRadius: "5px",
        border: "1px solid #333",
        background: "#ddd",
    },
    addButton: {
        width: "100%",
        padding: "10px",
        fontSize: "14px",
        cursor: "pointer",
        borderRadius: "5px",
        border: "1px solid #333",
        background: "#eee",
        marginBottom: "10px",
    },
    bookmarkList: {
        listStyle: "none",
        padding: "0",
        marginTop: "10px",
        textAlign: "center",
    },
    bookmarkItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px",
        borderBottom: "1px solid #ddd",
        flexWrap: "wrap",
    },
    timeText: {
        fontSize: "14px",
        color: "#666",
        marginRight: "10px",
        minWidth: "50px",
    },
    bookmarkText: {
        cursor: "pointer",
        color: "blue",
        flex: "1",
        textAlign: "left",
        wordBreak: "break-word",
    },
    nameInput: {
        flex: "1",
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "14px",
        marginRight: "5px",
        minWidth: "100px",
    },
    renameButton: {
        border: "none",
        background: "none",
        cursor: "pointer",
        color: "#333",
        fontSize: "14px",
        marginRight: "5px",
    },
    confirmButton: {
        border: "none",
        background: "none",
        cursor: "pointer",
        color: "green",
        fontSize: "14px",
        marginRight: "5px",
    },
    deleteButton: {
        border: "none",
        background: "none",
        cursor: "pointer",
        color: "red",
        fontSize: "14px",
    },
    emptyText: {
        fontSize: "14px",
        color: "#888",
    },
};

export default Bookmarks;
