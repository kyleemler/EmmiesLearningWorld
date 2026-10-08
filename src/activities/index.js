import { makeColorQuestion, makeLetterQuestion, makeNumberQuestion } from "../data/questions.js";

export const activities = {
  letters: {
    id: "letters",
    title: "ABC Cottage",
    name: "Letters",
    emoji: "🔤",
    theme: "letters",
    introduction: "Let's find some letters!",
    makeQuestion: makeLetterQuestion,
    sayQuestion: (question) => `Can you find the letter ${question.target}?`
  },
  numbers: {
    id: "numbers",
    title: "Counting Bakery",
    name: "Counting",
    emoji: "🧁",
    theme: "numbers",
    introduction: "Let's count together!",
    makeQuestion: makeNumberQuestion,
    sayQuestion: (question) => question.kind === "numbers"
      ? "How many do you see?"
      : question.prompt
  },
  colors: {
    id: "colors",
    title: "Rainbow Garden",
    name: "Colors",
    emoji: "🌈",
    theme: "colors",
    introduction: "Let's find a color!",
    makeQuestion: makeColorQuestion,
    sayQuestion: (question) => `Can you find ${question.target}?`
  }
};
