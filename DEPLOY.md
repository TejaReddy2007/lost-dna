# Put LOST DNA online (free, ~10 minutes)

You'll get a public link like `https://lost-dna.onrender.com` that judges can open on their phones.

## 1. Put the code on GitHub
**Option A: website (no Git needed)**
1. Sign in at https://github.com → **New repository** → name it `lost-dna` → **Public** → **Create repository**.
2. On the new repo page click **uploading an existing file**.
3. Open your unzipped `lost-dna` folder, select **everything inside it except `node_modules`, `data` and `.env`**, drag it into the page → **Commit changes**.
   (If GitHub complains about too many files, upload the folders in two batches.)

**Option B: Git in PowerShell**
```powershell
cd C:\Users\<you>\Downloads\lost-dna\lost-dna
git init
git add .
git commit -m "LOST DNA"
git branch -M main
git remote add origin https://github.com/<your-username>/lost-dna.git
git push -u origin main
```
(`.gitignore` already keeps `node_modules`, `data` and `.env` out.)

## 2. Deploy on Render
1. Sign up at https://render.com with your GitHub account (free, no card).
2. **New +** → **Blueprint** → choose your `lost-dna` repo → **Apply**.
   Render reads `render.yaml`, which already sets everything: build command, start command, secure random secrets, HTTPS cookies and proxy settings.
3. Wait for the first build (~3–5 minutes). When the status is **Live**, open the URL at the top of the page.

## 3. Before the demo
- **Wake it up 2 minutes early.** Free Render services sleep after ~15 minutes idle; the first visit takes up to a minute.
- Demo accounts are the same as locally (password `LostDNA@demo1`).
- On the free plan the disk is temporary: every restart or redeploy **resets to fresh demo data**. That's perfect for demos. For permanent data, add a Render Disk (paid) and set `DATABASE_PATH=/var/data/lostdna.db` and `UPLOAD_DIR=/var/data/uploads`.
- Want a clean slate right before presenting? Admin → **Reset demo data**.

## Deploy the website on Netlify (optional)
Netlify only hosts static websites and short serverless functions. It can't keep a database
or uploaded photos, so LOST DNA's back end has to run somewhere else. The setup is:

```
Browser ──> Netlify (website)  ──/api, /uploads──>  Render (Express + SQLite)
```

Netlify forwards `/api` and `/uploads` to Render, so the browser only ever talks to
your Netlify address. Sign-in cookies work normally and no CORS setup is needed.

1. **Deploy the back end on Render first** (steps 1–2 above). Copy its URL, e.g. `https://lost-dna.onrender.com`.
2. In Render, open the service → **Environment** → change `TRUST_PROXY` from `1` to `2` → **Save**.
   (Traffic now passes through two proxies, Netlify and Render. With `2`, each visitor keeps their own login rate limit.)
3. Sign up at https://netlify.com with GitHub → **Add new project** → **Import an existing project** → GitHub → choose `lost-dna`.
4. Netlify reads `netlify.toml`, which fills in the build command (`npm run build:netlify`) and the publish folder (`dist`). Don't change them.
5. Before deploying, open **Environment variables** (**Site configuration → Environment variables** later on) and add:
   `API_URL` = `https://lost-dna.onrender.com` (your Render URL, **no** trailing slash).
6. Click **Deploy**. You get a URL like `https://lost-dna.netlify.app`. Rename it under **Site configuration → Change site name**.

Netlify notes
- If the build stops with "API_URL is missing", add the variable (step 5), then go to **Deploys → Trigger deploy**.
- **Wake Render before the demo** by opening the Render URL once. While Render is asleep, the first API request from Netlify can time out ("502"). Refresh after about a minute.
- After changing `API_URL`, redeploy on Netlify. The proxy rules are written at build time.

## Other hosts
A `Dockerfile` is included (Railway, Fly.io, Koyeb, any VPS). Set `JWT_SECRET` and `DATA_ENCRYPTION_KEY` to long random strings, and `COOKIE_SECURE=true` when served over HTTPS.

## Troubleshooting
- **Build fails with "vite: not found"** → the build command must be `npm install --include=dev && npm run build` (already in `render.yaml`).
- **Can't stay signed in** → the site must be opened over `https://` (Render does this automatically).
- **Blank page after a deploy** → hard refresh (Ctrl+Shift+R); the offline cache updates on the next load.
