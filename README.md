# Rodiora — website

A mobile-first, bilingual (Türkçe / English) marketing site for Rodiora: AI video,
social media, mobile apps, websites and design content.

Plain HTML, CSS and JavaScript — no build step, no dependencies. Open `index.html`
or host the folder on any static host (Netlify, Vercel, GitHub Pages, Cloudflare
Pages, cPanel, S3...).

## Files

```
index.html                 markup for every section
assets/css/styles.css      theme, layout and responsive breakpoints
assets/js/i18n.js          all Turkish + English copy
assets/js/main.js          language switcher, menu, animation, form, store links
assets/logo-placeholder.svg  logo placeholder (header + footer)
favicon.svg                site icon placeholder
```

## 1. Add your logo

`assets/logo-placeholder.svg` is a dashed placeholder. Replace its contents with
your logo (SVG, or edit the `<img src>` in `index.html` to point to a PNG). Keep
the file name to avoid touching the code. Update `favicon.svg` the same way.
The word "Rodiora" next to the mark is plain text in `.brand-word`.

## 2. Add the store links

Open `assets/js/main.js` and fill in:

```js
const STORE_LINKS = {
  google: "https://play.google.com/store/apps/details?id=...",
  apple: "https://apps.apple.com/app/id..."
};
```

Every "Google Play" and "App Store" button on the page (hero, apps section,
footer) uses these links. Empty values show a "coming soon" hint and go nowhere.

## 3. Change the email / social links

- Email: `assets/js/main.js` → `CONTACT_EMAIL`, plus the two `mailto:` links and
  the visible text in `index.html` (search `hello@rodiora.com`).
- Social links: `index.html`, the `.socials` block (`href="#"` placeholders).
- Turkish copy lives in `assets/js/i18n.js` under `tr`, English under `en`.
  Each `data-i18n="key"` element in the HTML is filled from that dictionary.
  `data-i18n-html` keys may contain markup (used for gradient headlines).

## 4. Contact form

The form has no backend. On submit it opens the visitor's email app with the
message pre-filled (mailto). To collect submissions server-side instead, point
the form at Formspree, Netlify Forms or your own endpoint and remove the mailto
handler in `assets/js/main.js`.

## 5. Language behaviour

- Default language follows the browser (`tr` → Turkish, otherwise English).
- The TR / EN switch is in the header and footer.
- The choice is stored in `localStorage` and `<html lang>` is updated for
  accessibility and SEO.

## 6. Deploy

Upload the whole folder. Relative paths mean it works from a subdirectory too.
For local preview only:

```bash
python3 -m http.server 3000
```
