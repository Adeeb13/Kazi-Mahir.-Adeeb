# Kazi Mahir Adeeb — Portfolio

> Ethical AI Architect · Independent Researcher · Builder · Dhaka, Bangladesh

---

## 📁 File Structure

```
Kazi-Mahir-Adeeb/          ← This is your GitHub repo name
│
├── index.html             ← PORTFOLIO website (main page)
├── cv.html                ← STANDALONE CV (print to PDF from here)
│
├── css/
│   ├── reset.css
│   ├── vars.css
│   ├── base.css
│   ├── nav.css
│   ├── hero.css
│   ├── sections.css
│   ├── cards.css
│   ├── animations.css
│   └── responsive.css
│
├── js/
│   ├── webgl.js           ← Three.js 3D starfield
│   ├── particles.js       ← 2D floating particle canvas
│   ├── cursor.js          ← Custom gold cursor
│   ├── nav.js             ← Navigation behaviour
│   ├── reveal.js          ← Scroll reveal animations
│   ├── hero.js            ← Hero counters, ticker, glitch
│   └── main.js            ← Preloader, parallax, orchestration
│
└── README.md
```

**Two files, two purposes:**
- `index.html` → Your live portfolio website
- `cv.html` → Open in browser → Print → Save as PDF → done

---

## 🚀 Deploy to GitHub Pages — Step by Step

### Step 1 — Create the repository

1. Go to [github.com](https://github.com) and sign in as `Adeeb13`
2. Click the **+** icon → **New repository**
3. Name it exactly: `Kazi-Mahir-Adeeb`
4. Set it to **Public**
5. Do NOT initialise with README (you already have one)
6. Click **Create repository**

---

### Step 2 — Upload your files

**Option A — Via GitHub website (easiest):**

1. Open your new empty repo
2. Click **uploading an existing file** or **Add file → Upload files**
3. Drag and drop the ENTIRE folder contents (not the folder itself — the files inside)
4. Make sure the structure looks like this in GitHub:
   ```
   index.html
   cv.html
   README.md
   css/reset.css
   css/vars.css
   ... (all css files)
   js/webgl.js
   ... (all js files)
   ```
5. Scroll down, write commit message: `Initial deploy`
6. Click **Commit changes**

**Option B — Via Git terminal (faster for updates):**

```bash
# On your computer, open terminal in the folder containing all files
git init
git add .
git commit -m "Initial deploy"
git branch -M main
git remote add origin https://github.com/Adeeb13/Kazi-Mahir-Adeeb.git
git push -u origin main
```

---

### Step 3 — Enable GitHub Pages

1. In your repo, click **Settings** (top menu)
2. Scroll down to **Pages** in the left sidebar
3. Under **Source**, select:
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **Save**
5. Wait ~2 minutes
6. GitHub will show: `Your site is live at https://adeeb13.github.io/Kazi-Mahir-Adeeb/`

---

### Step 4 — Visit your live site

- **Portfolio:** `https://adeeb13.github.io/Kazi-Mahir-Adeeb/`
- **CV:** `https://adeeb13.github.io/Kazi-Mahir-Adeeb/cv.html`

---

## 📄 Generate Your PDF CV

1. Open `https://adeeb13.github.io/Kazi-Mahir-Adeeb/cv.html` in **Chrome** or **Edge**
2. Click the **"Print / Save PDF"** button at the top, OR press `Ctrl+P` (Windows) / `Cmd+P` (Mac)
3. In the print dialog:
   - Destination: **Save as PDF**
   - Paper size: **A4**
   - Margins: **None** or **Minimum**
   - Background graphics: **ON** ✓
4. Click **Save**

You now have a pixel-perfect PDF CV.

---

## 🔄 Updating the Site Later

**Via GitHub website:**
1. Go to the file you want to edit in your repo
2. Click the pencil icon ✏️ (Edit)
3. Make changes
4. Commit → your live site updates in ~30 seconds

**Via Git terminal:**
```bash
git add .
git commit -m "Update: description of what you changed"
git push
```

---

## 🌐 Custom Domain (Optional — looks more pro)

If you have a domain like `kazimahiradeeb.com`:

1. Go to repo **Settings → Pages**
2. Under **Custom domain**, type your domain
3. Click Save
4. At your domain registrar, add a CNAME record:
   - Name: `www`
   - Value: `adeeb13.github.io`
5. Wait up to 24h for DNS to propagate

---

## ⚡ Performance Notes

- The 3D starfield uses **Three.js r128** loaded from Cloudflare CDN
- Falls back gracefully if Three.js fails to load
- Fonts loaded from Google Fonts (requires internet connection)
- All animations are GPU-accelerated CSS transforms
- Mobile: cursor hidden, 3D reduced, layout collapses cleanly

---

*Built with intent. Pure HTML/CSS/JS. No frameworks. No build tools.*
*Just push and it works.*
