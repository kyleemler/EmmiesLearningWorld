const LETTER_SOUNDS = [
  { letter: "A", sound: "ah", example: "apple", distractors: ["M", "T"] },
  { letter: "B", sound: "buh", example: "ball", distractors: ["F", "S"] },
  { letter: "C", sound: "kuh", example: "cat", distractors: ["M", "T"] },
  { letter: "D", sound: "duh", example: "dog", distractors: ["L", "P"] },
  { letter: "E", sound: "eh", example: "egg", distractors: ["B", "D"] },
  { letter: "F", sound: "fff", example: "fish", distractors: ["B", "R"] },
  { letter: "G", sound: "guh", example: "goat", distractors: ["L", "N"] },
  { letter: "H", sound: "hhh", example: "hat", distractors: ["V", "Y"] },
  { letter: "I", sound: "ih", example: "igloo", distractors: ["M", "T"] },
  { letter: "J", sound: "juh", example: "jam", distractors: ["M", "Z"] },
  { letter: "K", sound: "kuh", example: "kite", distractors: ["B", "L"] },
  { letter: "L", sound: "lll", example: "leaf", distractors: ["G", "R"] },
  { letter: "M", sound: "mmm", example: "moon", distractors: ["D", "V"] },
  { letter: "N", sound: "nnn", example: "nest", distractors: ["B", "H"] },
  { letter: "O", sound: "oh", example: "ocean", distractors: ["M", "T"] },
  { letter: "P", sound: "puh", example: "pig", distractors: ["D", "T"] },
  { letter: "Q", sound: "kwuh", example: "queen", distractors: ["N", "F"] },
  { letter: "R", sound: "rrr", example: "rabbit", distractors: ["F", "L"] },
  { letter: "S", sound: "sss", example: "sun", distractors: ["J", "W"] },
  { letter: "T", sound: "tuh", example: "turtle", distractors: ["N", "P"] },
  { letter: "U", sound: "uh", example: "up", distractors: ["B", "D"] },
  { letter: "V", sound: "vvv", example: "van", distractors: ["H", "M"] },
  { letter: "W", sound: "wuh", example: "web", distractors: ["S", "Y"] },
  { letter: "X", sound: "ks", example: "box", distractors: ["F", "S"] },
  { letter: "Y", sound: "yuh", example: "yarn", distractors: ["H", "W"] },
  { letter: "Z", sound: "zzz", example: "zebra", distractors: ["J", "S"] }
];
const COUNTING_ITEMS = [
  { name: "duck", plural: "ducks", emoji: "🦆" },
  { name: "flower", plural: "flowers", emoji: "🌼" },
  { name: "cupcake", plural: "cupcakes", emoji: "🧁" },
  { name: "apple", plural: "apples", emoji: "🍎" },
  { name: "fish", plural: "fish", emoji: "🐟" }
];
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
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const otherIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[otherIndex]] = [shuffled[otherIndex], shuffled[index]];
  }
  return shuffled;
}

export function makeLetterQuestion() {
  const selected = LETTER_SOUNDS[Math.floor(Math.random() * LETTER_SOUNDS.length)];
  return {
    kind: "letters",
    prompt: `What letter makes the ${selected.sound} sound in ${selected.example}?`,
    sound: selected.sound,
    example: selected.example,
    target: selected.letter,
    choices: shuffle([selected.letter, ...selected.distractors])
  };
}

export function makeNumberQuestion() {
  const targetCount = Math.floor(Math.random() * 5) + 1;
  const [targetItem, otherItem] = pickRandom(COUNTING_ITEMS, 2);
  const otherCount = Math.floor(Math.random() * 3) + 1;
  const objects = shuffle([
    ...Array.from({ length: targetCount }, () => targetItem),
    ...Array.from({ length: otherCount }, () => otherItem)
  ]);
  return {
    kind: "numbers",
    prompt: `How many ${targetItem.plural} can you see?`,
    target: targetCount,
    targetItem,
    objects,
    choices: shuffle([targetCount, ...pickRandom([1, 2, 3, 4, 5].filter((number) => number !== targetCount), 2)])
  };
}

export function makeColorQuestion() {
  const colors = pickRandom(COLOR_SET, 3);
  const answer = colors[Math.floor(Math.random() * colors.length)];
  return {
    kind: "colors",
    prompt: `Can you find the ${answer.name} color?`,
    target: answer.name,
    choices: shuffle(colors.map(({ name, color, emoji }) => ({ name, color, emoji })))
  };
}

export function makeAdditionQuestion() {
  const firstCount = Math.floor(Math.random() * 4) + 1;
  const secondCount = Math.floor(Math.random() * (5 - firstCount)) + 1;
  const target = firstCount + secondCount;
  const targetItem = COUNTING_ITEMS[Math.floor(Math.random() * COUNTING_ITEMS.length)];
  const objectName = (count) => count === 1 ? targetItem.name : targetItem.plural;
  const firstPhrase = `${firstCount} ${objectName(firstCount)}`;
  const secondPhrase = `${secondCount} more ${objectName(secondCount)} ${secondCount === 1 ? "joins" : "join"} them`;
  return {
    kind: "addition",
    prompt: `How many ${targetItem.plural} altogether?`,
    spokenPrompt: `You have ${firstPhrase}. ${secondPhrase}. How many ${targetItem.plural} are there altogether?`,
    targetItem,
    firstCount,
    secondCount,
    target,
    choices: shuffle([target, ...pickRandom([1, 2, 3, 4, 5].filter((number) => number !== target), 2)])
  };
}
