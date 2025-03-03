import React, { createContext, useRef, useState, useEffect } from "react";
import { formatTime } from "./utils";

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
    const audioRef = useRef(null);
    const defaultAudio = "/assets/audio.mp3"; // Default audio file
    const [audioSrc, setAudioSrc] = useState(defaultAudio);
    const [fileInfo, setFileInfo] = useState({ name: "audio.mp3", size: 0 });
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [bookmarks, setBookmarks] = useState([]);

    // ✅ Load bookmarks & last played time based on file
    useEffect(() => {
        // ✅ Always use the current fileInfo state instead of reloading from localStorage
        const savedBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${fileInfo.name}_${fileInfo.size}`)) || [];
        const savedTime = parseFloat(localStorage.getItem(`lastPlayedTime_${fileInfo.name}_${fileInfo.size}`)) || 0;
    
        setBookmarks(savedBookmarks);
        setCurrentTime(savedTime);
    
        if (audioRef.current) {
            audioRef.current.src = audioSrc;
            audioRef.current.currentTime = savedTime;
        }
    }, [audioSrc, fileInfo]);
    
    // ✅ Handle play/pause
    const togglePlay = () => {
        if (audioRef.current) {
            isPlaying ? audioRef.current.pause() : audioRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    // ✅ Handle play/pause
    const setPause = () => {
        setIsPlaying(false);
    };

    // ✅ Track progress & save last played time
    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
            localStorage.setItem(`lastPlayedTime_${fileInfo.name}_${fileInfo.size}`, audioRef.current.currentTime);
        }
    };

    // ✅ Save duration when metadata is loaded
    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    // ✅ Handle file upload
    const handleFileUpload = (file) => {
        const newSrc = URL.createObjectURL(file);
        const newFileInfo = { name: file.name, size: file.size };

        if (newFileInfo.name !== fileInfo.name || newFileInfo.size !== fileInfo.size) {
            setAudioSrc(newSrc);
            setFileInfo(newFileInfo);
            localStorage.setItem("lastFileInfo", JSON.stringify(newFileInfo));

            // Load new file's bookmarks
            const savedBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${newFileInfo.name}_${newFileInfo.size}`)) || [];
            setBookmarks(savedBookmarks);

            if (audioRef.current) {
                audioRef.current.src = newSrc;
                audioRef.current.currentTime = 0;
                audioRef.current.load();
            }
        }
    };

    // ✅ Add a bookmark linked to filename & size
    const addBookmark = () => {
        if (audioRef.current && duration > 0) {
            const current = audioRef.current.currentTime;
            const defaultName = `bookmarks_${formatTime(current)}`;

            if (!bookmarks.some(bm => bm.time === current)) {
                const newBookmarks = [...bookmarks, { time: current, name: defaultName }];
                setBookmarks(newBookmarks);
                localStorage.setItem(`bookmarks_${fileInfo.name}_${fileInfo.size}`, JSON.stringify(newBookmarks));
            }
        }
    };

    // ✅ Rename bookmark
    const renameBookmark = (time, newName) => {
        const updatedBookmarks = bookmarks.map(bm => bm.time === time ? { ...bm, name: newName } : bm);
        setBookmarks(updatedBookmarks);
        localStorage.setItem(`bookmarks_${fileInfo.name}_${fileInfo.size}`, JSON.stringify(updatedBookmarks));
    };

    // ✅ Remove bookmark
    const removeBookmark = (time) => {
        const newBookmarks = bookmarks.filter(bm => bm.time !== time);
        setBookmarks(newBookmarks);
        localStorage.setItem(`bookmarks_${fileInfo.name}_${fileInfo.size}`, JSON.stringify(newBookmarks));
    };

    // ✅ Play from a bookmark
    const playBookmark = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    };

    return (
        <AudioContext.Provider value={{
            audioRef, isPlaying, togglePlay, currentTime, duration, audioSrc, bookmarks,
            handleTimeUpdate, handleLoadedMetadata, handleFileUpload, setPause,
            addBookmark, renameBookmark, playBookmark, removeBookmark
        }}>
            {children}
        </AudioContext.Provider>
    );
};

export default AudioContext;
