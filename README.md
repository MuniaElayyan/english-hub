# English for Palestine — Mrs Rana · Deer AL-Ghusoon School

Bilingual (English / العربية) educational website. React + Vite + Framer Motion, plain CSS with design tokens.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build → dist/
```

## How the site is organised

The website mirrors the teacher's own folders. **Every folder is a card; every file or link inside is an item.**

```
Grade 4
├── Semester 1
│   ├── Student Book            (PDF reader)
│   ├── Book Solutions          (PDF reader)
│   ├── Unit 1 — A New Friend
│   │   ├── Student Assessment  (GRASPS docx + PDF preview)
│   │   ├── Interactive Games   (Wordwall — plays in the site or opens in a new tab)
│   │   ├── Posters             (images + PDF posters, lightbox)
│   │   └── Videos              (local MP4, YouTube embed, Facebook → new tab)
│   └── Unit 2 — Our House
│       ├── Student Assessment
│       ├── Videos
│       ├── Worksheets
│       └── Posters
├── Grade 4 English Club  → Facebook group (new tab)
└── Audio Materials       → Google Drive folder (new tab)
```

Routes: `/`, `/classes`, `/classes/grade-4/semester-1/unit-1/posters` (any folder path), `/resources` (search), `/about`.

## Adding material — from the website (teacher mode)

No programmer needed. Footer → **Teacher sign-in** (on phones: inside the menu).
After signing in, the Home and Classes pages show an **Add a grade** card (new classes for the future), and every section shows **Add material** and **Add folder** (in the page header, as a "+" tile at the end of every card grid, and inside empty sections).

- **Upload a file** (drag & drop): image, PDF, Word, PowerPoint, audio, MP4/WebM.
- **Paste a link**: YouTube, Facebook, Wordwall, Google Drive, a direct file link, or any web page / game.
- The **card picture is read from the source automatically**: first PDF page (white margins trimmed), the first lines of a Word file drawn as a page, a frame of the video, the YouTube / Drive / Wordwall picture, or the page's share image / a screenshot for other links. "Use another picture" overrides it.
- Cards open in a pop-up (PDF, Word, image, video, audio, YouTube, Wordwall, Drive) with **Open in new tab** and **Download**.
- The bin icon deletes anything the teacher added (folders must be empty first). Built-in material from `resources.js` is permanent.

Code: `src/library/` (`index.jsx` merges built-in + added material, `detect.js`, `thumbs.js`, `backend-local.js`, `backend-supabase.js`).

### Where uploads are stored — IMPORTANT

| | Without `.env` (default) | With Supabase connected |
|---|---|---|
| Storage | this browser only (IndexedDB) | cloud — **every visitor sees it** |
| Sign-in | passcode in `src/data/site.js` → `teacherAccess.passcode` (default `2026`) | teacher's e-mail + password |

The site is static, so **students only see uploads once Supabase is connected**:

1. Create a free project at supabase.com.
2. SQL Editor → paste and run `supabase-setup.sql`.
3. Authentication → Sign In / Providers → turn **off** "Allow new users to sign up"; then Users → **Add user** (the teacher's e-mail + password).
4. Project Settings → API → copy the URL and the `anon` key into a new `.env` file (see `.env.example`). On Netlify / Vercel add the same two variables in the site settings.
5. `npm run build` and deploy again.

Free-tier limits: 50 MB per file, 1 GB total — put long videos on YouTube / Drive and paste the link.
SPA hosting note: make sure every route falls back to `index.html`.

## Adding material — in code (built-in, permanent)

1. Put the file in `public/resources/<grade>/<semester>/<unit>/<folder>/` (same tree as above).
2. Open **`src/data/resources.js`** and add an item to that folder's `items` array — or a new folder to `children`.
   Names are bilingual: `name: { en: 'Posters', ar: 'بوسترات' }`.

Item types: `pdf`, `docx` (+ optional `preview` PDF), `image`, `video` (mp4), `youtube` (`youtubeId`), `facebook` (`url`), `wordwall` (`url`), `link` (`url`).
External items always open in a new tab; YouTube and Wordwall can also play inside the site.

Optional thumbnails for PDFs/videos: any image path in `thumbnail`.
Tip: a PDF first page → PNG with `pdftoppm -png -r 60 -f 1 -l 1 file.pdf out`; a video frame with `ffmpeg -ss 2 -i v.mp4 -frames:v 1 thumb.jpg`.

Grades 6 and 7 currently contain an empty "Semester 1" folder waiting for material.

## Text, teacher info, translations

- `src/data/site.js` — name, school, photo, bio, philosophy (each `{ en, ar }`)
- `src/i18n/strings.js` — every interface label in both languages
- Language and theme toggles are in the navbar; both are remembered in localStorage.

## Images

- `public/hero-classroom.jpg` — hero illustration
- `public/teacher.jpg` — profile photo (About page)
