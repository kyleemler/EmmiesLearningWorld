import { audio } from "./audio.js";
import { activities } from "./activities/index.js";
import { MiniGame } from "./game.js";
import { Navigation } from "./navigation.js";
import { gameState } from "./state.js";
import mascotUrl from "./assets/mascot.svg";
import "./styles.css";

const root = document.querySelector("#app");
const navigation = new Navigation(root);
let game;
let moving = false;
let hopTimer;

function showMenu() {
  navigation.show(`
    ${navigation.soundButton()}
    <div class="menu-sky">
      <div class="sun">☀</div><div class="cloud cloud-a"></div><div class="cloud cloud-b"></div>
      <div class="menu-hill hill-back"></div><div class="menu-hill hill-front"></div>
      <div class="menu-title">
        <span class="title-eyebrow">A little place to play and learn</span>
        <h1>Emmie's <span>Learning</span> World</h1>
        <p>Come explore with me!</p>
        <button class="big-button play-button" type="button"><span>Play</span><span aria-hidden="true">▶</span></button>
      </div>
      <img class="menu-mascot" src="${mascotUrl}" alt="A smiling bunny friend" />
      <div class="menu-flowers" aria-hidden="true">🌷　🌼　🌸　🌻　🌷　🌼</div>
    </div>
  `, "menu");
  root.querySelector(".play-button").addEventListener("click", () => {
    audio.button();
    audio.setEnabled(gameState.soundEnabled);
    showVillage();
  });
}

function buildingArt(id) {
  if (id === "letters") {
    return `<svg class="building-art cottage-art" viewBox="0 0 230 180" aria-hidden="true">
      <path d="M30 83 115 20l85 63v80H30z" fill="#f5a7c4" stroke="#9b6486" stroke-width="5" stroke-linejoin="round"/>
      <path d="M18 84 115 10l97 74-12 14-85-65-85 65z" fill="#985cb2" stroke="#764889" stroke-width="5" stroke-linejoin="round"/>
      <path d="M94 108h42v55H94z" fill="#a36d9b" stroke="#764889" stroke-width="4"/><circle cx="128" cy="136" r="3" fill="#ffdf83"/>
      <path d="M48 108h32v30H48zM151 108h32v30h-32z" fill="#c6f3f1" stroke="#fff6e8" stroke-width="6"/>
      <path d="M64 108v30m-16-15h32m87-15v30m-16-15h32" stroke="#fff6e8" stroke-width="3"/>
      <path d="M62 75h33V43H62z" fill="#fff4c7" stroke="#9b6486" stroke-width="3"/><text x="78" y="69" text-anchor="middle" fill="#8d51ab" font-size="23" font-family="Georgia" font-weight="bold">A</text>
      <path d="M140 75h33V43h-33z" fill="#fff4c7" stroke="#9b6486" stroke-width="3"/><text x="156" y="69" text-anchor="middle" fill="#ef7193" font-size="23" font-family="Georgia" font-weight="bold">B</text>
      <path d="M81 27h33V9H81z" fill="#fff4c7" stroke="#9b6486" stroke-width="3"/><text x="97" y="23" text-anchor="middle" fill="#68a6b5" font-size="18" font-family="Georgia" font-weight="bold">C</text>
    </svg>`;
  }
  if (id === "numbers") {
    return `<svg class="building-art bakery-art" viewBox="0 0 230 180" aria-hidden="true">
      <path d="M29 83h172v80H29z" fill="#ffd88b" stroke="#ad774d" stroke-width="5"/>
      <path d="M20 83q0-17 19-17t19 17q0-17 19-17t19 17q0-17 19-17t19 17q0-17 19-17t19 17q0-17 19-17t19 17z" fill="#fff2cf" stroke="#ad774d" stroke-width="4"/>
      <path d="M18 85h194v17H18z" fill="#f28c75" stroke="#ad774d" stroke-width="4"/>
      <path d="M54 114h39v49H54zM140 117h39v46h-39z" fill="#fff7dd" stroke="#ad774d" stroke-width="4"/>
      <path d="M99 163v-36q0-19 16-19t16 19v36z" fill="#ad6c43" stroke="#865337" stroke-width="4"/>
      <path d="M61 111q0-20 12-20t12 20z" fill="#e986ac"/><path d="M147 114q0-20 12-20t12 20z" fill="#9a82d5"/>
      <circle cx="72" cy="103" r="3" fill="#fff1b7"/><circle cx="82" cy="99" r="3" fill="#fff1b7"/>
      <path d="M70 42c-9-13 7-18 0-30m67 32c-9-13 7-18 0-30" fill="none" stroke="#aee8e4" stroke-width="5" stroke-linecap="round"/>
      <text x="115" y="88" text-anchor="middle" fill="#a4653d" font-size="20" font-family="Georgia" font-weight="bold">BAKE</text>
    </svg>`;
  }
  return `<svg class="building-art garden-art" viewBox="0 0 230 180" aria-hidden="true">
    <path d="M43 86a72 72 0 0 1 144 0" fill="none" stroke="#e87981" stroke-width="13"/>
    <path d="M55 86a60 60 0 0 1 120 0" fill="none" stroke="#ffba68" stroke-width="12"/>
    <path d="M67 86a48 48 0 0 1 96 0" fill="none" stroke="#f5df79" stroke-width="12"/>
    <path d="M79 86a36 36 0 0 1 72 0" fill="none" stroke="#81c98e" stroke-width="12"/>
    <path d="M91 86a24 24 0 0 1 48 0" fill="none" stroke="#73bde0" stroke-width="12"/>
    <path d="M27 113h176v50H27z" fill="#8ccf9a" stroke="#5c9f70" stroke-width="4"/>
    <path d="M55 145v-24m0 10q-16-15-19-2 4 12 19 8m0-7q15-16 20-3-3 13-20 10" fill="#74b976"/>
    <path d="M114 151v-36m0 19q-21-19-24-3 5 15 24 10m0-13q20-21 25-4-4 17-25 13" fill="#6fb77a"/>
    <path d="M171 145v-26m0 11q-15-14-19-2 4 13 19 9m0-7q16-17 21-3-4 14-21 10" fill="#74b976"/>
    <g fill="#f7b6ca" stroke="#fff0cc" stroke-width="3"><circle cx="55" cy="116" r="9"/><circle cx="114" cy="111" r="9"/><circle cx="171" cy="114" r="9"/></g>
    <g fill="#ffdb72"><circle cx="55" cy="116" r="3"/><circle cx="114" cy="111" r="3"/><circle cx="171" cy="114" r="3"/></g>
  </svg>`;
}

function showVillage() {
  navigation.show(`
    <div class="village-header">
      <div class="welcome-pill"><img src="${mascotUrl}" alt="" /><span>Where shall we go?</span></div>
      <div class="village-tools">
        <div class="star-total" aria-label="${gameState.stars} stars earned">⭐ <span>${gameState.stars}</span></div>
        ${navigation.soundButton()}
      </div>
    </div>
    <div class="village-scene">
      <div class="village-sky">
        <div class="sun">☀</div><div class="cloud cloud-a"></div><div class="cloud cloud-b"></div><div class="cloud cloud-c"></div>
        <div class="distant-hills"></div>
      </div>
      <div class="village-grass"></div>
      <div class="village-path"></div>
      <div class="trees tree-left"><span>🌳</span></div><div class="trees tree-right"><span>🌲</span></div>
      <div class="bush bush-left"></div><div class="bush bush-right"></div>
      <div class="village-buildings">
        ${Object.values(activities).map((activity) => `<button class="location location-${activity.id}" type="button" data-location="${activity.id}" aria-label="Visit ${activity.title}">
          <span class="building-label">${activity.title}</span>
          ${buildingArt(activity.id)}
          <span class="location-glow">${activity.emoji}</span>
        </button>`).join("")}
      </div>
      <div class="path-flowers flowers-left" aria-hidden="true">🌼　🌷　🌼</div>
      <div class="path-flowers flowers-right" aria-hidden="true">🌷　🌼　🌸</div>
      <div class="village-sign">A cozy place to learn <span>✦</span></div>
      <img class="village-mascot" src="${mascotUrl}" alt="Your bunny friend in the village" />
      <div class="tap-hint">Tap a place to play!</div>
    </div>
  `, "village");
  root.querySelectorAll(".location").forEach((building) => {
    building.addEventListener("click", () => enterLocation(building));
  });
}

function enterLocation(building) {
  if (moving) return;
  moving = true;
  const mascot = root.querySelector(".village-mascot");
  const bounds = building.getBoundingClientRect();
  const sceneBounds = root.querySelector(".village-scene").getBoundingClientRect();
  const destination = Math.max(13, Math.min(83, ((bounds.left + bounds.width / 2 - sceneBounds.left) / sceneBounds.width) * 100));
  mascot.style.setProperty("--destination", `${destination}%`);
  mascot.classList.add("mascot-walking");
  building.classList.add("location-selected");
  audio.hop();
  hopTimer = window.setInterval(() => audio.hop(), 520);
  window.setTimeout(() => {
    window.clearInterval(hopTimer);
    mascot.classList.remove("mascot-walking");
    moving = false;
    game.start(activities[building.dataset.location]);
  }, 3600);
}

game = new MiniGame(navigation, showVillage);
showMenu();
