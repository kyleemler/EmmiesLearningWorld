class AudioManager {
  constructor() {
    this.context = null;
    this.musicTimer = null;
    this.musicNote = 0;
    this.musicOn = false;
    this.melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 880, 698.46];
  }

  getContext() {
    if (!this.context) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;
      this.context = new AudioContextClass();
    }
    if (this.context.state === "suspended") this.context.resume();
    return this.context;
  }

  tone(frequency, duration = 0.12, wave = "sine", volume = 0.08, delay = 0) {
    if (!gameState.soundEnabled) return;
    const context = this.getContext();
    if (!context) return;
    const start = context.currentTime + delay;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.02);
  }

  button() {
    this.tone(720, 0.07, "sine", 0.035);
  }

  correct() {
    this.tone(660, 0.15, "sine", 0.07);
    this.tone(880, 0.22, "sine", 0.07, 0.12);
  }

  incorrect() {
    this.tone(250, 0.16, "triangle", 0.045);
  }

  celebrate() {
    [523, 659, 784, 1047].forEach((note, index) => {
      this.tone(note, 0.25, "sine", 0.07, index * 0.11);
    });
  }

  startMusic() {
    if (this.musicOn || !gameState.soundEnabled) return;
    this.musicOn = true;
    this.getContext();
    this.musicTimer = window.setInterval(() => {
      this.tone(this.melody[this.musicNote % this.melody.length], 0.48, "sine", 0.018);
      this.musicNote += 1;
    }, 620);
  }

  stopMusic() {
    this.musicOn = false;
    window.clearInterval(this.musicTimer);
    this.musicTimer = null;
  }

  setEnabled(enabled) {
    if (enabled) this.startMusic();
    else {
      this.stopMusic();
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    }
  }

  speak(text) {
    if (!("speechSynthesis" in window) || !gameState.soundEnabled) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.82;
    utterance.pitch = 1.12;
    window.speechSynthesis.speak(utterance);
  }
}

import { gameState } from "./state.js";

export const audio = new AudioManager();
