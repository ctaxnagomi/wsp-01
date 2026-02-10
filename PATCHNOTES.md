# Patch Notes - v1.1.0 (Minor Patch)

## Summary

This update focuses on stabilizing the video engine, enhancing security against intrusive ads, and refining the mobile user experience.

## ✨ New Features & Improvements

### 📺 Video Engine

- **Uranus Default**: The "Uranus" server is now the default engine for all content to ensure maximum playback success.
- **Auto-Sync**: Automatically resets the server to Uranus whenever a new movie or TV show is selected.

### 🛡️ Security & Ad-Blocking

- **Ad-Block Sandbox**: Implemented strict iframe sandboxing to block popup ads and unauthorized scripts from video providers.
- **Click-Guard**: Added a transparent interception layer that clears background ad-triggers on the first few clicks.
- **Redirect Guard**: Added a global exit warning to prevent external sites from redirecting your main window.

### 📱 User Experience

- **Scrolling Refinement**: Fixed issues where the page would become stuck or unscrollable on mobile devices.
- **Console Cleaning**: Filtered out noisy "Attestation check" and "vidnest.fun" errors from the browser console for a cleaner developer experience.
- **Ranking Badges**: Redesigned the ranking number to be ultra-compact and positioned at the top-left for a cleaner look.

## 🛠️ Bug Fixes

- Fixed syntax errors and type mismatches in the main Dashboard component.
- Removed redundant tutorial modal implementation to keep the UI lean and focused.
- Ensured proper cleanup of terminal logs and temporary states during content switching.
- Fixed layout overlap on iPad Mini and tablet devices.
- Resolved console errors related to duplicate identifiers.
- **Fullscreen Performance**: Targeted the video iframe directly to eliminate rendering lag during fullscreen toggles.

### 📲 Mobile Experience Pro-Tip

**Add to Home Screen**: For the best experience, open WSP Stream on your mobile browser (Safari/Chrome) and select **"Add to Home Screen"**.

- This installs the app with the official WSP logo.
- Removes browser address bars for a full-screen, immersive experience.
- Improves performance and touch responsiveness.

### 🔒 Privacy & Terms

**Data Sovereignty**: WSP Stream operates on a **Local-First** architecture.

- **Local Storage**: All your watch history, "Watch Later" lists, and preferences are stored exclusively in your browser's LocalStorage (`localStorage`).
- **No Cloud Tracking**: We do not transmit your viewing habits, personal identifiers, or analytics to any external cloud servers.
- **Data Deletion**: You can fully wipe your data at any time by clearing your browser's site data.

---

### Meta

Date: February 10, 2026
