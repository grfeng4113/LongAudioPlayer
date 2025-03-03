# **Long Audio Player 🎵**

A **React-based Long Audio Player** that supports **bookmarking, progress visualization, file uploads, and last stop saving**. Users can seamlessly navigate long audio files with an **interactive progress bar**, manage **custom bookmarks**, and **upload their own MP3 files**.

---

## **📌 Features**
- **📂 Upload MP3 Files** – Allows users to upload and play their own audio files.
- **🎵 Resume Playback** – Saves the last played position for each file.
- **🔖 Bookmarking System** – Users can add, rename, and delete bookmarks for easy navigation.
- **📊 Interactive Progress Bar** – A **custom SVG progress bar** for accurate playback navigation.
- **💾 Persistent Storage** – Uses **localStorage** to retain progress and bookmarks across sessions.
- **🔁 Auto Resume** – If the same file is played again, it resumes from the last stop.
- **📱 Responsive Design** – Works across desktop and mobile devices.

---

## **🚀 Installation & Setup**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/grfeng4113/LongAudioPlayer.git
cd long-audio-player
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Start the Application**
```sh
npm start
```
The app will be available at **`http://localhost:3000/`**.

---

## **📁 Project Structure**
```
long-audio-player/
│── public/                # Static files (default audio)
│── src/                   # Main source code
│   ├── components/        # React components
│   │   ├── AudioPlayer.js # Audio player with upload feature
│   │   ├── ProgressBar.js # Custom interactive progress bar
│   │   ├── Bookmarks.js   # Bookmark management system
│   │   ├── AudioContext.js    # Global audio state using React Context
│   ├── App.js             # Main application layout
│   ├── index.js           # Entry point
│── package.json           # Project dependencies
│── README.md              # Project documentation
```

---

## **🛠 How to Use**
### **🎧 Playing Audio**
1. **By Default:** The app plays the built-in `audio.mp3` from `/public/assets/`.
2. **Upload Your Own File:** Click the **upload button** and select an MP3 file.
3. **Play/Pause Control:** Click the **▶️ Play / ⏸ Pause** button.

### **🔖 Managing Bookmarks**
1. **Add Bookmark:** Click **"➕ Add Bookmark"** to save the current time.
2. **Play a Bookmark:** Click on a saved bookmark to jump to that time.
3. **Rename Bookmark:** Click the **✏️ Rename** button, type a new name, and confirm.
4. **Delete Bookmark:** Click the **❌ Delete** button to remove it.

### **📊 Navigating with the Progress Bar**
- **Click** anywhere on the progress bar to jump to a specific part.
- The progress bar follows a **custom path** with precise navigation.

### **💾 Saving Progress**
- **Each file has its own bookmarks and last stop.**
- **Progress is saved automatically** and restored when you re-open the same file.

---

## **📌 Future Enhancements**
- 🎭 **More Customizable UI**
- 🎼 **Waveform Visualization**
- 📱 **PWA Support for Offline Use**
- 🚀 **Cloud Sync for Bookmarks & Progress**

---

## **🤝 Contributing**
Feel free to **fork this project** and submit pull requests! Contributions are welcome. 🎉

---

Enjoy seamless long-audio playback with bookmarking & progress tracking! 🚀🎶
