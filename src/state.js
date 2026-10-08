const STORAGE_KEY = "emmies-learning-world";

function readSavedState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    return {
      stars: Number.isInteger(saved.stars) && saved.stars >= 0 ? saved.stars : 0,
      soundEnabled: typeof saved.soundEnabled === "boolean" ? saved.soundEnabled : true
    };
  } catch (error) {
    console.warn("Could not read saved game settings.", error);
    return { stars: 0, soundEnabled: true };
  }
}

const savedState = readSavedState();

export const gameState = {
  stars: savedState.stars,
  soundEnabled: savedState.soundEnabled
};

export function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (error) {
    console.warn("Could not save game progress on this device.", error);
  }
}

export function addStars(amount) {
  gameState.stars += amount;
  saveState();
}

export function toggleSound() {
  gameState.soundEnabled = !gameState.soundEnabled;
  saveState();
  return gameState.soundEnabled;
}
