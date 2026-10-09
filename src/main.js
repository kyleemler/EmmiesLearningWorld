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
let hopTimer;
let moveTimer;
let pendingActivity = null;
let villageScene;

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
  if (id === "addition") {
    return `<svg class="building-art addition-art" viewBox="0 0 230 180" aria-hidden="true">
      <path d="M28 109q10-48 87-51 77 3 87 51l-16 54H45z" fill="#75c8d0" stroke="#498d9c" stroke-width="5"/>
      <path d="M39 117q76-21 152 0" fill="none" stroke="#b5eff0" stroke-width="5" stroke-linecap="round"/>
      <path d="M55 64h120l-13-31H68z" fill="#e8ba79" stroke="#a5794c" stroke-width="5" stroke-linejoin="round"/>
      <path d="M67 33q10-19 21 0m18 0q10-19 21 0m18 0q10-19 21 0" fill="#fff2cc" stroke="#a5794c" stroke-width="4"/>
      <g fill="#ffcf6c" stroke="#fff4d9" stroke-width="3"><circle cx="76" cy="109" r="16"/><circle cx="115" cy="126" r="16"/><circle cx="155" cy="107" r="16"/></g>
      <path d="M104 148h22m-11-11v22" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      <path d="M40 159q-10-20 5-29m141 29q10-20-5-29" fill="none" stroke="#55ae75" stroke-width="6" stroke-linecap="round"/>
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
  const orderedActivities = Object.values(activities);
  const nextActivity = orderedActivities.find(({ id }) => !gameState.completedActivities.includes(id));
  navigation.show(`
    <div class="village-header">
      <div class="welcome-pill" aria-label="Tap the path to guide the bunny"><img src="${mascotUrl}" alt="" /><span>Tap the path to guide me!</span></div>
      <div class="village-tools">
        <div class="star-total" aria-label="${gameState.stars} stars earned">⭐ <span>${gameState.stars}</span></div>
        <div class="map-progress" aria-label="${gameState.completedActivities.length} of ${orderedActivities.length} adventures explored">
          <span class="map-progress-label">Adventures</span>
          <span class="map-progress-dots">${orderedActivities.map(({ id }, index) => `<i class="${gameState.completedActivities.includes(id) ? "is-done" : ""} ${id === nextActivity?.id ? "is-next" : ""}" aria-hidden="true">${gameState.completedActivities.includes(id) ? "✓" : index + 1}</i>`).join("")}</span>
        </div>
        ${navigation.soundButton()}
      </div>
    </div>
    <div class="village-scene">
      <div class="village-sky">
        <div class="sun">☀</div><div class="cloud cloud-a"></div><div class="cloud cloud-b"></div><div class="cloud cloud-c"></div>
        <div class="distant-hills"></div>
      </div>
      <div class="village-grass"></div>
      <svg class="village-roads" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
        <path class="road-edge" d="M505 710 C460 630 560 575 500 510 C440 445 530 380 500 310 M500 465 C390 420 300 458 220 395 C145 337 90 360 25 330 M500 430 C620 390 710 445 795 390 C875 338 935 358 990 325"/>
        <path class="road-surface" d="M505 710 C460 630 560 575 500 510 C440 445 530 380 500 310 M500 465 C390 420 300 458 220 395 C145 337 90 360 25 330 M500 430 C620 390 710 445 795 390 C875 338 935 358 990 325"/>
        <path class="road-dashes" d="M505 710 C460 630 560 575 500 510 C440 445 530 380 500 310 M500 465 C390 420 300 458 220 395 C145 337 90 360 25 330 M500 430 C620 390 710 445 795 390 C875 338 935 358 990 325"/>
      </svg>
      <div class="trees tree-left"><span>🌳</span></div><div class="trees tree-right"><span>🌲</span></div>
      <div class="bush bush-left"></div><div class="bush bush-right"></div>
      <div class="village-buildings">
        ${orderedActivities.map((activity, index) => {
          const isDone = gameState.completedActivities.includes(activity.id);
          const isNext = activity.id === nextActivity?.id;
          return `<button class="location location-${activity.id} ${isDone ? "location-done" : ""} ${isNext ? "location-next" : ""}" type="button" data-location="${activity.id}" aria-label="Hop to ${activity.title}${isDone ? ", completed, replay anytime" : ""}">
          <span class="trail-marker ${isDone ? "is-done" : ""} ${isNext ? "is-next" : ""}" aria-hidden="true">${isDone ? "✓" : index + 1}</span>
          <span class="building-label">${activity.title}</span>
          ${buildingArt(activity.id)}
          <span class="location-glow" aria-hidden="true">${activity.emoji}</span>
        </button>`;
        }).join("")}
      </div>
      <div class="future-lots" aria-label="Two future places for new games">
        <div class="future-lot ${nextActivity ? "" : "lot-next"}"><span class="lot-art">🌱</span><span class="lot-label">${nextActivity ? "A new game will grow here!" : "More games soon!"}</span><span class="lot-marker" aria-hidden="true">${nextActivity ? "✦" : "＋"}</span></div>
        <div class="future-lot"><span class="lot-art">🪧</span><span class="lot-label">A little space for later</span></div>
      </div>
      <div class="path-flowers flowers-left" aria-hidden="true">🌼　🌷　🌼</div>
      <div class="path-flowers flowers-right" aria-hidden="true">🌷　🌼　🌸</div>
      <button class="enter-location" type="button" aria-label="Enter this learning game" hidden>🚪<span>Let's play!</span></button>
      <img class="village-mascot" src="${mascotUrl}" alt="Your bunny friend. Tap the path or grass to hop around." />
      <div class="tap-hint">Tap the grass to hop • tap a house to visit</div>
    </div>
  `, "village");
  villageScene = root.querySelector(".village-scene");
  villageScene.addEventListener("pointerdown", handleVillageTap);
  root.querySelectorAll(".location").forEach((building) => {
    building.addEventListener("click", () => moveToLocation(building));
  });
  root.querySelector(".enter-location").addEventListener("click", () => {
    if (pendingActivity) {
      audio.button();
      game.start(pendingActivity);
    }
  });
}

function handleVillageTap(event) {
  if (event.target.closest("button, .village-header")) return;
  const bounds = villageScene.getBoundingClientRect();
  moveMascot(
    ((event.clientX - bounds.left) / bounds.width) * 100,
    ((event.clientY - bounds.top) / bounds.height) * 100
  );
}

function moveToLocation(building) {
  const bounds = building.getBoundingClientRect();
  const sceneBounds = villageScene.getBoundingClientRect();
  const mascotHeight = root.querySelector(".village-mascot").getBoundingClientRect().height;
  pendingActivity = activities[building.dataset.location];
  root.querySelectorAll(".location").forEach((location) => location.classList.toggle("location-selected", location === building));
  moveMascot(
    ((bounds.left + bounds.width / 2 - sceneBounds.left) / sceneBounds.width) * 100,
    ((bounds.bottom - sceneBounds.top - mascotHeight * 0.65) / sceneBounds.height) * 100,
    pendingActivity
  );
}

function moveMascot(x, y, destinationActivity = null) {
  const mascot = root.querySelector(".village-mascot");
  const sceneBounds = villageScene.getBoundingClientRect();
  const currentX = Number.parseFloat(mascot.style.left) || 50;
  const currentY = Number.parseFloat(mascot.style.top) || 82;
  const destinationX = Math.min(94, Math.max(6, x));
  const destinationY = Math.min(87, Math.max(23, y));
  const distance = Math.hypot(
    (destinationX - currentX) * sceneBounds.width / 100,
    (destinationY - currentY) * sceneBounds.height / 100
  );
  const duration = Math.max(800, Math.min(3600, distance * 3.4));
  window.clearInterval(hopTimer);
  window.clearTimeout(moveTimer);
  pendingActivity = destinationActivity;
  root.querySelector(".enter-location").hidden = true;
  mascot.style.setProperty("--travel-duration", `${duration}ms`);
  mascot.style.left = `${destinationX}%`;
  mascot.style.top = `${destinationY}%`;
  mascot.classList.add("mascot-walking");
  audio.hop();
  hopTimer = window.setInterval(() => audio.hop(), 520);
  moveTimer = window.setTimeout(() => {
    window.clearInterval(hopTimer);
    mascot.classList.remove("mascot-walking");
    if (!pendingActivity) return;
    const enterButton = root.querySelector(".enter-location");
    enterButton.style.left = `${destinationX}%`;
    enterButton.style.top = `${Math.max(15, destinationY - 10)}%`;
    enterButton.hidden = false;
  }, duration);
}

game = new MiniGame(navigation, showVillage);
showMenu();
