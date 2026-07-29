# Ask With Heart

A very small mobile-friendly web app that lets anyone create a personalized question and share it as a link.

## What it does

- Generates a personalized link from a name, sender name, and question
- Opens a clean Yes/No page on a phone
- Celebrates a Yes response
- Responds respectfully to a No response
- Does not collect, transmit, or store answers
- Includes a web-app manifest and service worker so it can be installed as a PWA

## Run locally

Because the app uses a service worker, run it through a local web server instead of double-clicking the HTML file.

### Python

```bash
cd ask-with-heart
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Publish it as a link

Upload the folder to any static host, including:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

After deployment, open the public URL, create the personalized link, copy it, and send it by text.

## Example link structure

```text
https://your-domain.com/?to=Alex&from=Jordan&q=Would%20you%20like%20to%20be%20my%20girlfriend%3F
```

## App Store path later

For an App Store release, this web app can be wrapped with Capacitor or rebuilt in React Native/Expo. A public app should add moderation-safe wording, a privacy policy, app-store screenshots, and a clear explanation that no answer is forced or secretly collected.
