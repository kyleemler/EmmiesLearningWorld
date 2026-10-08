# Emmie's Learning World

A cheerful, browser-based learning game for letters, counting, and colors. It is built with HTML, CSS, and vanilla JavaScript, with Vite for local development.

## Run it locally

1. Install [Node.js](https://nodejs.org/) (the LTS version is recommended).
2. Open this folder in a terminal and install the development dependency:

   ```sh
   npm install
   ```

3. Start the local server:

   ```sh
   npm run dev
   ```

4. Open the local URL printed by Vite (usually `http://localhost:5173`).

To make a production build, run `npm run build`. To preview that build locally, run `npm run preview`.

## Push to GitHub and deploy to GitHub Pages

1. Sign in to [GitHub](https://github.com/) and create a new, empty repository. Do not initialize it with a README, license, or `.gitignore`.
2. Open PowerShell in this project folder. Initialize Git, make the first commit, and connect the new repository. Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your GitHub details:

   ```powershell
   git init
   git add .
   git commit -m "Build Emmie's Learning World"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

   GitHub may ask you to sign in the first time you push.

3. On GitHub, open the repository's **Settings → Pages**. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Open the repository's **Actions** tab and wait for the **Deploy to GitHub Pages** workflow to finish successfully.
5. Visit the Pages URL shown in **Settings → Pages**. For a standard repository, it looks like `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`. Open that URL on the other device (and bookmark it or add it to the iPad Home Screen).

The included `.github/workflows/deploy.yml` builds and deploys the site automatically whenever you push a change to `main`. The Vite configuration uses relative asset paths, so the game works from the repository subpath without additional configuration.

Stars and sound settings are stored locally in each browser. The game itself can be opened on other devices from the Pages URL, but star totals do not sync between devices.

## Project map

- `index.html` — the app entry point and page metadata.
- `src/main.js` — starts the game and connects the modules.
- `src/navigation.js` — screen transitions and shared screen controls.
- `src/game.js` — reusable five-question activity flow and feedback.
- `src/activities/` — the three activity definitions.
- `src/data/questions.js` — activity content and question generation.
- `src/state.js` — locally saved sound and star settings.
- `src/audio.js` — optional generated sounds and spoken instructions.
- `src/styles.css` — responsive storybook scene, characters, and interactions.
- `src/assets/` — original local SVG artwork.

## Adding learning content

Each activity in `src/activities/` supplies a title, visual style, question generator, and spoken prompt. Add or edit reusable question choices in `src/data/questions.js`; the shared game flow takes care of shuffling choices, retries, progress, and rewards.

Stars and the sound preference are stored in the browser's `localStorage` on the current device. No account or backend is used. Sound starts only after a player interaction and can be turned off at any time.
