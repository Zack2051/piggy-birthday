(() => {
  "use strict";
  const data = window.BIRTHDAY;
  const $ = id => document.getElementById(id);
  let chapter = 0;
  let confettiTimer;
  let deliveryTimer;
  const show = (id, visible) => { $(id).hidden = !visible; };
  const text = (id, value) => { $(id).textContent = value; };
  function page(id) {
    window.clearTimeout(deliveryTimer);
    ["intro", "journey", "complete", "ending"].forEach(name => show(name, name === id));
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function renderQuestion() {
    const item = data.chapters[chapter];
    page("journey");
    show("question-panel", true);
    show("memory-panel", false);
    text("progress-label", `${String(chapter + 1).padStart(2, "0")} / ${String(data.chapters.length).padStart(2, "0")}`);
    document.querySelectorAll(".progress i").forEach((el, i) => el.classList.toggle("active", i <= chapter));
    text("chapter-icon", item.icon);
    text("chapter-title", item.title);
    text("question-description", item.description);
    text("feedback", "");
    $("answers").replaceChildren();
    item.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      const label = document.createElement("span");
      label.textContent = String(index + 1).padStart(2, "0");
      button.append(label, document.createTextNode(answer));
      button.addEventListener("click", () => {
        if (item.correct === null || item.correct === index) revealMemory();
        else text("feedback", "沒關係，回憶可以慢慢想。再選一次，或看看小提示 ♡");
      });
      $("answers").append(button);
    });
    $("chapter-title").focus({ preventScroll: true });
  }
  function revealMemory() {
    const item = data.chapters[chapter];
    show("question-panel", false);
    show("memory-panel", true);
    $("memory-card").setAttribute("aria-expanded", "false");
    document.querySelector(".card-front").hidden = false;
    document.querySelector(".card-back").hidden = true;
    show("next", false);
    text("memory-title", item.memoryTitle);
    text("memory-text", item.memory);
    const photo = $("memory-photo");
    photo.hidden = true;
    photo.removeAttribute("src");
    photo.onload = () => { photo.hidden = false; };
    photo.onerror = () => { photo.hidden = true; };
    if (item.photo) photo.src = item.photo;
    text("next", chapter === data.chapters.length - 1 ? "完成我們的回憶 ♡" : "把這份心意收好 →");
    $("memory-heading").focus({ preventScroll: true });
  }
  function celebrate() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const container = document.querySelector(".confetti");
    window.clearTimeout(confettiTimer);
    container.replaceChildren();
    for (let i = 0; i < 45; i++) {
      const piece = document.createElement("i");
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = ["#a53e4d", "#d6ac62", "#8a9b7b", "#e9b3a7"][i % 4];
      piece.style.animationDelay = `${Math.random() * .8}s`;
      container.append(piece);
    }
    confettiTimer = window.setTimeout(() => container.replaceChildren(), 4000);
  }
  text("birthday-name", data.name);
  text("salutation", `給${data.name}：`);
  text("signature", `很愛很愛你的，\n${data.sender}`);
  text("gift-text", data.gift);
  text("gift-name", data.giftName);
  text("gift-message", data.giftMessage);
  data.letter.forEach(paragraph => {
    const p = document.createElement("p");
    p.textContent = paragraph;
    $("letter-body").append(p);
  });
  document.querySelector(".progress").replaceChildren(...data.chapters.map(() => document.createElement("i")));
  $("start").addEventListener("click", () => { chapter = 0; renderQuestion(); });
  $("home").addEventListener("click", () => { page("intro"); $("start").focus(); });
  $("hint").addEventListener("click", () => text("feedback", data.chapters[chapter].hint));
  $("memory-card").addEventListener("click", () => {
    const open = $("memory-card").getAttribute("aria-expanded") !== "true";
    $("memory-card").setAttribute("aria-expanded", String(open));
    document.querySelector(".card-front").hidden = open;
    document.querySelector(".card-back").hidden = !open;
    if (open) show("next", true);
  });
  $("next").addEventListener("click", () => {
    if ($("journey").hidden) return;
    chapter++;
    if (chapter < data.chapters.length) renderQuestion();
    else {
      page("complete");
      $("complete").classList.remove("is-accepting");
      $("accept-gift").disabled = false;
      text("accept-status", "");
      text("wish-message", "");
      $("gift-stage").classList.remove("is-open");
      $("open-gift").setAttribute("aria-expanded", "false");
      $("open-gift").setAttribute("aria-label", "打開生日禮物盒");
      show("gift-reveal", false);
      show("gift-caption", false);
      show("gift-instruction", true);
      $("complete-title").focus({ preventScroll: true });
      celebrate();
    }
  });
  $("accept-gift").addEventListener("click", () => {
    if ($("accept-gift").disabled || $("complete").hidden) return;
    $("accept-gift").disabled = true;
    $("complete").classList.add("is-accepting");
    text("accept-status", "心意送達，請小豬簽收 ♡");
    const enterEnding = () => {
      page("ending");
      $("ending-title").focus({ preventScroll: true });
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) enterEnding();
    else deliveryTimer = window.setTimeout(enterEnding, 1200);
  });
  $("wish").addEventListener("click", () => {
    text("wish-message", data.wish);
    celebrate();
  });
  $("open-gift").addEventListener("click", () => {
    if ($("open-gift").getAttribute("aria-expanded") === "true") return;
    $("gift-stage").classList.add("is-open");
    $("open-gift").setAttribute("aria-expanded", "true");
    $("open-gift").setAttribute("aria-label", "禮物已拆開，是一台拍立得");
    show("gift-reveal", true);
    show("gift-caption", true);
    show("gift-instruction", false);
    celebrate();
  });
  $("restart").addEventListener("click", () => { chapter = 0; page("intro"); $("start").focus(); });
})();
