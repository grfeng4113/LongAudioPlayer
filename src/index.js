import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AudioProvider } from "./components/AudioContext"; 

const root = createRoot(document.getElementById("root"));

document.title = "Long Audio Player";

root.render(
    <React.StrictMode>
        <AudioProvider>
            <App />
        </AudioProvider>
    </React.StrictMode>
);
