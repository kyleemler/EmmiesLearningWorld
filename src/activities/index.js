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
    sayQuestion: (question) => question.prompt
  },
  numbers: {
    id: "numbers",
    title: "Counting Bakery",
    name: "Counting",
    emoji: "🧁",
    theme: "numbers",
    introduction: "Let's count together!",
    makeQuestion: makeNumberQuestion,
    sayQuestion: (question) => question.prompt
  },
  colors: {
    id: "colors",
    title: "Rainbow Garden",
    name: "Colors",
    emoji: "🌈",
    theme: "colors",
    introduction: "Let's find a color!",
    makeQuestion: makeColorQuestion,
    sayQuestion: (question) => question.prompt
  }
};
