# Mediastack News Website

A modern, responsive news website that fetches the latest news from the [Mediastack API](https://mediastack.com/), inspired by Google News. Features include category filtering, Google Translate integration, dark mode, and a mobile-friendly navigation menu.

## Features

- **Live News Feed:** Fetches news from the Mediastack API.
- **Category Filter:** Filter news by category (General, Business, Entertainment, Health, Science, Sports, Technology).
- **Google Translate:** Instantly translate the site into any language using Google Translate.
- **Dark Mode:** Toggle between light and dark themes. Preference is saved.
- **Mobile Menu:** On mobile, a 3-dot menu provides access to all options with icons and labels.
- **Modern UI:** Google News-inspired card layout, hover effects, and responsive design.

## Setup & Usage

1. **Clone or Download** this repository to your computer.
2. **Open `index.html`** in your web browser. No build step or server is required.

## File Structure

- `index.html` — Main HTML file
- `styles.css` — All styles (light/dark mode, responsive, etc.)
- `app.js` — Handles fetching news and UI logic
- `README.md` — This file

## API Reference

- Uses [Mediastack News API](https://mediastack.com/)
- Example endpoint:  
  `http://api.mediastack.com/v1/news?access_key=YOUR_ACCESS_KEY&languages=en&limit=10`
- Replace `YOUR_ACCESS_KEY` with your own if you fork the project.

## Customization

- **Change Categories:** Edit the `<select>` options in `index.html`.
- **Change Theme Colors:** Edit variables and classes in `styles.css`.
- **Add More Features:** Extend `app.js` for search, pagination, etc.

## Credits

- News API: [Mediastack](https://mediastack.com/)
- Translate Icon: [Flaticon](https://cdn-icons-png.flaticon.com/512/281/281776.png)
- Category & Dark Mode Icons: [Flaticon](https://flaticon.com/)

---

Enjoy your modern news site! 🚀 