# Wombat-Assistant
#### Description

Wombat-Assistant is a Chrome extension paired with a local Flask server. It helps users analyze selected webpage text with generative AI and encourages more mindful browsing on short-form video feeds. The server connects to Groq’s API and uses the `openai/gpt-oss-20b` model.

## Features

- **Animated Wombat avatar:** Blinks every four seconds and animates its mouth while responding.
- **Movable widget:** Drag the Wombat to reposition it on the page.
- **Fullscreen behavior:** Hides the widget when a video or page enters fullscreen, so it doesn’t obstruct the view.
- **Ask Wombat:** Select text, right-click, and choose **Ask Wombat** to receive an AI-generated response.
- **Focus guard:** Tracks navigation changes on YouTube Shorts, TikTok, and Instagram Reels. After 10 clips, the Wombat displays a reminder to stop scrolling.
- **Settings popup:** Provides a Bootstrap-styled dashboard. Toggle preferences are saved with `chrome.storage.local` and persist across browser restarts.
- **Local database:** Stores interaction data in SQLite. Database queries use parameterized statements to help prevent SQL injection.

## Project Structure

```text
wombat-assistant/
├── images/
│   ├── wombat-idle.png       # Idle avatar
│   ├── wombat-talk.png       # Talking animation frame
│   └── wombat-blink.png      # Blinking animation frame
├── manifest.json             # Extension configuration and permissions
├── content.js                # Page interactions and avatar behavior
├── content.css               # Avatar and speech-bubble styles
├── background.js             # Context-menu setup and message handling
├── bootstrap.min.css         # Bootstrap styles
├── backend/
│   ├── app.py                # Flask API, Groq requests, and database operations
│   └── database.db           # Local SQLite database (Wombat Q&A)
└── README.md
```

## Permissions

The extension uses Manifest V3 and requests the following permissions in `manifest.json`:

- `contextMenus` adds **Ask Wombat** to the browser’s right-click menu.
- `storage` saves settings with `chrome.storage.local`.
- `activeTab` lets the extension interact with the current tab when the user invokes it.
- `host_permissions` allows communication with the local Flask server. For a server running on port `5000`, use the matching pattern `http://127.0.0.1:5000/*`.

## Setup

### Requirements

- Python 3
- Google Chrome
- A Groq API key, configured as expected by `backend/app.py`

### 1. Start the Flask server

Open a terminal and run:

```bash
cd backend
python -m pip install flask flask-cors groq cs50
touch database.db
python app.py
```

Wait until the terminal reports that the server is running at `http://127.0.0.1:5000`. (Don't forget to paste your Free Groq API key in app.py)

### 2. Load the Chrome extension

1. Open `chrome://extensions/`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select the `wombat-assistant/` project folder.
5. Pin the Wombat-Assistant icon to the toolbar for quick access to its settings.

## Usage

1. Open a webpage where text can be selected.
2. Highlight a phrase or passage.
3. Right-click the selection and choose **Ask Wombat**.
4. The Wombat displays an AI-generated response.
5. Visit a supported short-form video feed to try the focus guard.

