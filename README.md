# Flappy FPV

A Flappy Bird–style browser game where you fly a fiber-optic one-way attack drone through a course of anti-drone nets. Tap to flap, thread the gaps, don't snag the fiber.

**Play it:** https://fl0ridaman.github.io/flappy-FPV/

Works in any modern browser. On a phone, add it to your home screen and it runs full-screen like an app, and it keeps working with no signal once it has loaded once.

## How to play

- **Phone:** tap the screen to flap.
- **Desktop:** `space` (or click) to flap, `p` to pause, `m` to toggle sound.
- Every net you clear is a point. The course speeds up and the gaps tighten as you go.
- Your best score is saved on the device.
- Rumor has it the start screen is hiding something. Try poking at the title.
- Whatever you find back there scrolls through one long loop of Tampa Bay and Miami. Every run drops you in somewhere different — see how many landmarks you can spot.

## Add it to your home screen

- **iPhone:** open the link in Safari → tap the Share button → **Add to Home Screen**.
- **Android:** open the link in Chrome → tap the ⋮ menu → **Add to Home screen** (or **Install app**).

## What's in this repo

| File | What it does |
| --- | --- |
| `index.html` | The whole game: page, styles, and all the JavaScript in one file. |
| `manifest.webmanifest` | Tells phones how to install the game as an app (name, icon, full-screen, portrait). |
| `sw.js` | Service worker: keeps a cached copy of the files so the game opens offline. |
| `icon.png` | 180×180 pixel-art icon iPhones use for the home screen. |
| `icon-192.png`, `icon-512.png` | Icons Android uses. |
| `icon-maskable-512.png` | Android "maskable" icon, with padding so it can be cropped to a circle. |

## Making changes

Edit `index.html`, commit, and push. GitHub Pages republishes automatically, usually within a minute or two. The game's service worker re-checks GitHub for changes every time it opens, so on a phone: close the game fully, reopen it (that fetches the update in the background), then close and reopen once more to run it.

The game is plain HTML, CSS, and JavaScript with no build step and no dependencies, so you can also just open `index.html` straight from your computer to try changes before pushing.
