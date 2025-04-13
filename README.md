# 🧩 Teleparty Extension Challenge – Take Home Assignment

This is a real-time chat application built as part of the Teleparty full-stack interview process (frontend app). The app enables users to create or join chat rooms, set nicknames and user icons, and send/receive live messages using Teleparty WebSocket tools.

## 🚀 Live Demo

🌐 [View the deployed app on GitHub Pages](https://https://sachins0023.github.io/teleparty-extension)

---

## 📦 Features

✅ Create and join chat rooms using a unique ID  (Buttons will be disabled if connection closed).\n
✅ Set your nickname and upload a user icon (base64 support).\n
✅ Send and receive chat messages in real-time (Lookout for the green/red icon next to the user name in chat to know connection status. If red, reload the page as connection is closed).\n
✅ Display system messages (user joined/left, room created).\n
✅ Handle connection lifecycle (connected, closed) - Lookout for toaster informing connection status. Reload if connection closed.\n
✅ Deployed via GitHub Pages.

---

## ⚙️ Tech Stack

- React (Vite setup)
- TypeScript
- Teleparty WebSocket Library
- WebSockets
- GitHub Pages
- Shadcn UI Library
- Tailwind CSS

---

## 🛠 Setup Instructions

- Make sure you have latest versions of Node (20+) and npm (10+) as we are using React 19 and Tailwind 4.

```bash
# Clone the repo
https://github.com/sachins0023/teleparty-extension

# Install dependencies
cd teleparty-extension
npm install

# Start development server
npm run dev
