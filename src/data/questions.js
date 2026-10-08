const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const NUMBER_EMOJI = ["🍓", "🧁", "🐥", "🍪", "🌼"];
const COLOR_SET = [
  { name: "red", color: "#f16f75", emoji: "🍎" },
  { name: "blue", color: "#65bce8", emoji: "🫐" },
  { name: "yellow", color: "#ffd45f", emoji: "🌟" },
  { name: "green", color: "#71ca8a", emoji: "🐸" },
  { name: "purple", color: "#ae83d8", emoji: "🍇" },
  { name: "orange", color: "#ffa45d", emoji: "🍊" }
];

function pickRandom(items, count) {
  const pool = [...items];
  const picked = [];
  while (picked.length < count && pool.length) {
    picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  }
  return picked;
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

export function makeLetterQuestion() {
  const [answer, ...distractors] = pickRandom(LETTERS, 3);
  return {
    kind: "letters",
    prompt: `Can you find the letter ${answer}?`,
    target: answer,
    choices: shuffle([answer, ...distractors])
  };
}

export function makeNumberQuestion() {
  const answer = Math.floor(Math.random() * 5) + 1;
  return {
    kind: "numbers",
    prompt: "How many do you see?",
    target: answer,
    objects: Array.from({ length: answer }, () => NUMBER_EMOJI[Math.floor(Math.random() * NUMBER_EMOJI.length)]),
    choices: shuffle([answer, ...pickRandom([1, 2, 3, 4, 5].filter((number) => number !== answer), 2)])
  };
}

export function makeColorQuestion() {
  const colors = pickRandom(COLOR_SET, 3);
  const answer = colors[Math.floor(Math.random() * colors.length)];
  return {
    kind: "colors",
    prompt: `Can you find ${answer.name}?`,
    target: answer.name,
    choices: colors.map(({ name, color, emoji }) => ({ name, color, emoji }))
  };
}
