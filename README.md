# 🏓 Table Tennis Score

A simple, mobile-friendly scoreboard for table tennis. Open it on your phone, pick the two players, and tap **+ POINT** as the match goes on. No account, no backend, no build step.

## Features

- **Best of 1, 3, 5 or 7** matches
- **Automatic serve tracking** with a light showing who is serving
- **Official scoring**: sets to 11, win by 2, with the serve changing every 2 points (and every point from 10-10)
- **First server alternates** each set
- **Undo** the last point, even across a set or match win
- **Swap sides** without losing the score or the undo history
- **Saved player list**: add and delete players, stored on your device
- **Works offline** after the first visit
- Works on any phone browser, and can be added to the iPhone home screen

## How to use

1. Add players with **+ Add Player** (the list is saved on your device).
2. Pick Player 1 and Player 2 from the dropdowns.
3. Choose the match length and who serves first.
4. Tap **+ POINT** under the player who won the rally.
5. Use **Undo** to fix a mistake, **Swap Sides** when the players change ends, and **New Match** to start over.

## Run it

It is plain HTML, CSS and JavaScript, so you can just open `index.html` in a browser.

To serve it locally:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

To use it as an app on iPhone, open the page in Safari, tap **Share**, then **Add to Home Screen**.

## Project structure

| File | Purpose |
| --- | --- |
| `index.html` | Page layout |
| `style.css` | Styling |
| `app.js` | Scoring, serving, undo and player list logic |
| `manifest.json` | Web app manifest |
| `sw.js` | Service worker that saves the app for offline use |
| `apple-touch-icon.png` | Home screen icon |

## Notes

- Player names are saved in your browser's `localStorage`, so they stay on the device you used.
- Offline mode needs the page to be served over HTTPS (or `localhost`); opening `index.html` straight from a file skips it.
- The service worker loads from the network first, so updates appear as soon as the device is online. If you ever need to force a full refresh, change the `CACHE_NAME` version in `sw.js`.
