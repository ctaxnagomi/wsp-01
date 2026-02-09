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

## 🛠️ Bug Fixes

- Fixed syntax errors and type mismatches in the main Dashboard component.
- Removed redundant tutorial modal implementation to keep the UI lean and focused.
- Ensured proper cleanup of terminal logs and temporary states during content switching.

---

### Meta

Date: February 10, 2026
