import { audio } from "./audio.js";
import { addStars, gameState, markActivityComplete } from "./state.js";
import mascotUrl from "./assets/mascot.svg";

const ROUND_LENGTH = 5;

export class MiniGame {
  constructor(navigation, onReturnToVillage) {
    this.navigation = navigation;
    this.onReturnToVillage = onReturnToVillage;
    this.activity = null;
    this.questionIndex = 0;
    this.locked = false;
  }

  start(activity) {
    this.activity = activity;
    this.questionIndex = 0;
    this.showIntroduction();
  }

  showIntroduction() {
    this.navigation.show(`
      ${this.topBar()}
      <div class="activity-wrap">
        <div class="activity-card intro-card theme-${this.activity.theme}">
          <div class="intro-sparkle sparkle-one">✦</div>
          <div class="intro-sparkle sparkle-two">✧</div>
          <div class="activity-icon">${this.activity.emoji}</div>
          <h1>${this.activity.name}</h1>
          <p class="spoken-prompt">${this.activity.introduction}</p>
          <button class="big-button play-activity" type="button" aria-label="Start ${this.activity.name} game">
            <span>Let's play!</span><span aria-hidden="true">▶</span>
          </button>
          <button class="speak-button" type="button" aria-label="Hear the instructions">🔈</button>
        </div>
      </div>
    `, "activity");
    this.navigation.root.querySelector(".back-button").addEventListener("click", () => {
      audio.button();
      this.onReturnToVillage();
    });
    this.navigation.root.querySelector(".play-activity").addEventListener("click", () => {
      audio.button();
      this.showQuestion();
    });
    this.navigation.root.querySelector(".speak-button").addEventListener("click", () => {
      audio.button();
      audio.speak(this.activity.introduction);
    });
  }

  topBar() {
    return `<header class="game-topbar">
      <button class="back-button" type="button" aria-label="Back to the village">←</button>
      <div class="progress-stars" aria-label="Question ${this.questionIndex + 1} of ${ROUND_LENGTH}">
        ${Array.from({ length: ROUND_LENGTH }, (_, index) => `<span class="${index < this.questionIndex ? "earned" : ""}">★</span>`).join("")}
      </div>
      ${this.navigation.soundButton()}
    </header>`;
  }

  showQuestion() {
    if (this.questionIndex >= ROUND_LENGTH) {
      this.showReward();
      return;
    }
    const question = this.activity.makeQuestion();
    this.locked = false;
    this.navigation.show(`
      ${this.topBar()}
      <div class="activity-wrap">
        <div class="activity-card question-card theme-${this.activity.theme}">
          <div class="question-number">${this.questionIndex + 1}<span> / ${ROUND_LENGTH}</span></div>
          <h1 class="question-prompt ${question.kind === "colors" ? "audio-only-prompt" : ""}">${question.kind === "letters"
            ? "Which letter makes this sound?"
            : question.kind === "colors" ? "Listen to the color!" : question.prompt}</h1>
          ${question.kind === "colors" ? `<p class="silent-question-prompt">${question.prompt}</p>` : ""}
          ${this.questionVisual(question)}
          <div class="answer-options ${question.kind === "letters" ? "letter-options" : ""}" role="group" aria-label="Answer choices">
            ${question.choices.map((choice) => this.answerButton(question, choice)).join("")}
          </div>
          <div class="answer-feedback" aria-live="polite"></div>
          <button class="speak-button question-speak" type="button" aria-label="Hear the question">🔈</button>
        </div>
      </div>
    `, "activity");
    const root = this.navigation.root;
    root.classList.toggle("screen-no-speech", !gameState.soundEnabled || !audio.canSpeak());
    root.querySelector(".back-button").addEventListener("click", () => {
      audio.button();
      this.onReturnToVillage();
    });
    root.querySelector(".question-speak").addEventListener("click", () => {
      audio.button();
      audio.speak(this.activity.sayQuestion(question));
    });
    root.querySelectorAll(".answer-choice").forEach((button) => {
      button.addEventListener("click", () => this.checkAnswer(button, question));
    });
    audio.speak(this.activity.sayQuestion(question));
  }

  questionVisual(question) {
    if (question.kind === "addition") {
      const nameForCount = (count) => count === 1 ? question.targetItem.name : question.targetItem.plural;
      return `<div class="addition-objects" role="img" aria-label="${question.firstCount} ${nameForCount(question.firstCount)} plus ${question.secondCount} ${nameForCount(question.secondCount)}">
        <span class="addition-group">${question.targetItem.emoji.repeat(question.firstCount)}</span>
        <span class="addition-sign" aria-hidden="true">+</span>
        <span class="addition-group">${question.targetItem.emoji.repeat(question.secondCount)}</span>
      </div>`;
    }
    if (question.kind === "numbers") {
      const counts = question.objects.reduce((result, item) => {
        result[item.name] ??= { count: 0, plural: item.plural };
        result[item.name].count += 1;
        return result;
      }, {});
      const objectSummary = Object.entries(counts)
        .map(([name, item]) => `${item.count} ${item.count === 1 ? name : item.plural}`)
        .join(" and ");
      return `<div class="counting-objects" role="img" aria-label="${objectSummary}">${question.objects.map((item) => `<span aria-hidden="true">${item.emoji}</span>`).join("")}</div>`;
    }
    if (question.kind === "letters") {
      return `<div class="sound-cue" aria-label="The ${question.sound} sound, like in ${question.example}">
        <span>“${question.sound}”</span><small>like in ${question.example}</small>
      </div>`;
    }
    return "";
  }

  answerButton(question, choice) {
    const isColor = question.kind === "colors";
    const label = isColor ? choice.name : choice;
    const content = isColor
      ? `<span class="color-orb" style="--choice-color:${choice.color}">${choice.emoji}</span><span class="color-name">${choice.name}</span>`
      : `<span>${choice}</span>`;
    return `<button class="answer-choice ${isColor ? "color-choice" : ""}" type="button" data-answer="${label}" aria-label="${isColor ? choice.name : choice}">
      ${content}
    </button>`;
  }

  checkAnswer(button, question) {
    if (this.locked) return;
    const choice = button.dataset.answer;
    const correct = String(choice) === String(question.target);
    const feedback = this.navigation.root.querySelector(".answer-feedback");
    if (!correct) {
      audio.incorrect();
      button.classList.remove("answer-wrong");
      void button.offsetWidth;
      button.classList.add("answer-wrong");
      feedback.textContent = "That's okay! Try another one.";
      feedback.classList.add("feedback-try");
      audio.speak("Try again!");
      return;
    }
    this.locked = true;
    audio.correct();
    button.classList.add("answer-correct");
    feedback.textContent = "You did it!";
    feedback.className = "answer-feedback feedback-correct";
    audio.speak("Hooray! That's right!");
    window.setTimeout(() => {
      this.questionIndex += 1;
      this.showQuestion();
    }, 760);
  }

  showReward() {
    const earned = ROUND_LENGTH;
    addStars(earned);
    markActivityComplete(this.activity.id);
    audio.celebrate();
    this.navigation.show(`
      <header class="game-topbar">
        <div class="reward-star-total" aria-label="${gameState.stars} total stars">⭐ ${gameState.stars}</div>
        ${this.navigation.soundButton()}
      </header>
      <div class="activity-wrap reward-wrap">
        <div class="confetti" aria-hidden="true">
          ${Array.from({ length: 20 }, (_, index) => `<i style="--i:${index}"></i>`).join("")}
        </div>
        <div class="activity-card reward-card">
          <div class="reward-mascot"><img src="${mascotUrl}" alt="" /></div>
          <h1>Wonderful work!</h1>
          <p>You learned so much!</p>
          <div class="reward-stars" aria-label="You earned five stars">⭐⭐⭐⭐⭐</div>
          <button class="big-button return-village" type="button">
            <span>Back to the village</span><span aria-hidden="true">🏡</span>
          </button>
        </div>
      </div>
    `, "reward");
    this.navigation.root.querySelector(".return-village").addEventListener("click", () => {
      audio.button();
      this.onReturnToVillage();
    });
  }
}
