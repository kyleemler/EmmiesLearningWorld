import { audio } from "./audio.js";
import { gameState, toggleSound } from "./state.js";

export class Navigation {
  constructor(root) {
    this.root = root;
  }

  soundButton() {
    const label = gameState.soundEnabled ? "Turn sound off" : "Turn sound on";
    const icon = gameState.soundEnabled ? "🔊" : "🔇";
    return `<button class="sound-button" type="button" aria-label="${label}" title="${label}">${icon}</button>`;
  }

  bindSoundButton() {
    this.root.querySelector(".sound-button")?.addEventListener("click", () => {
      const enabled = toggleSound();
      audio.setEnabled(enabled);
      if (enabled) audio.button();
      const label = enabled ? "Turn sound off" : "Turn sound on";
      this.root.querySelector(".sound-button").setAttribute("aria-label", label);
      this.root.querySelector(".sound-button").setAttribute("title", label);
      this.root.querySelector(".sound-button").textContent = enabled ? "🔊" : "🔇";
      this.root.querySelector(".screen")?.classList.toggle("screen-no-speech", !enabled || !audio.canSpeak());
    });
  }

  show(markup, screenName) {
    this.render(markup, screenName);
  }

  render(markup, screenName) {
    this.root.innerHTML = `<section class="screen screen-entering screen-${screenName}" data-screen="${screenName}">${markup}</section>`;
    this.root.querySelector(".screen")?.addEventListener("animationend", (event) => {
      if (event.target === event.currentTarget) event.currentTarget.classList.remove("screen-entering");
    }, { once: true });
    this.bindSoundButton();
  }
}
