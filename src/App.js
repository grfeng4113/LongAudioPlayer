import React from "react";
import AudioPlayer from "./components/AudioPlayer";
import ProgressBar from "./components/ProgressBar";
import Bookmarks from "./components/Bookmarks";

const App = () => {
    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Long Audio Player</h2>
            <ProgressBar />
            <AudioPlayer />
            <Bookmarks />
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
    },
    title: {
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "20px",
    }
};

export default App;
