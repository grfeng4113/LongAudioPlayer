import React, { useContext, useState } from "react";
import AudioContext from "./AudioContext";
import { formatTime } from "./utils";

const AudioPlayer = () => {
    const { 
        audioRef, isPlaying, togglePlay, setPause, 
        handleTimeUpdate, handleLoadedMetadata, handleFileUpload, 
        audioSrc, currentTime, duration 
    } = useContext(AudioContext);
    
    const [uploadedFileName, setUploadedFileName] = useState("");

    // Handle file selection & update filename
    const onFileChange = (e) => {
        if (e.target.files[0]) {
            const file = e.target.files[0];
            handleFileUpload(file);
            setUploadedFileName(file.name);
            setPause();
        }
    };

    return (
        <div style={styles.container}>
            {/* Upload MP3 File */}
            <input
                type="file"
                accept="audio/*"
                onChange={onFileChange}
                style={styles.uploadInput}
            />

            {/* Display current file */}
            <p style={styles.fileName}>
                {audioSrc.includes("blob") ? `📁 ${uploadedFileName}` : "🎵 Default: audio.mp3"}
            </p>

            <audio 
                ref={audioRef} 
                src={audioSrc} 
                preload="auto" 
                onTimeUpdate={handleTimeUpdate} 
                onLoadedMetadata={handleLoadedMetadata} 
            />

            {/* Play/Pause Button */}
            <button onClick={togglePlay} style={styles.playButton}>
                {isPlaying ? "⏸️" : "▶️"}
            </button>

            {/* Progress Bar */}
            <div style={styles.progressContainer}>
                <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    step="0.1" 
                    value={duration > 0 ? (currentTime / duration) * 100 : 0} 
                    onChange={(e) => {
                        if (audioRef.current) {
                            audioRef.current.currentTime = (parseFloat(e.target.value) / 100) * duration;
                        }
                    }} 
                    style={styles.progressBar} 
                />
                <span style={styles.timeText}>{formatTime(currentTime)} / {formatTime(duration)}</span>
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        maxWidth: "400px",
        margin: "0 auto",
    },
    uploadInput: {
        marginBottom: "10px",
    },
    fileName: {
        fontSize: "14px",
        color: "#666",
    },
    playButton: {
        fontSize: "24px",
        cursor: "pointer",
        border: "none",
        background: "none",
    },
    progressContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "100%",
    },
    progressBar: {
        flex: 1,
        cursor: "pointer",
    },
    timeText: {
        fontSize: "14px",
        fontFamily: "monospace",
    },
};

export default AudioPlayer;
