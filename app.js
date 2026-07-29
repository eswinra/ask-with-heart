const builderView = document.getElementById("builderView");
const proposalView = document.getElementById("proposalView");
const builderForm = document.getElementById("builderForm");
const sharePanel = document.getElementById("sharePanel");
const shareUrl = document.getElementById("shareUrl");
const previewLink = document.getElementById("previewLink");
const copyButton = document.getElementById("copyButton");

const FORMSPREE_ENDPOINT = "https://formspree.io/f/mkodevaz";

const params = new URLSearchParams(window.location.search);
const to = clean(params.get("to"));
const from = clean(params.get("from"));
const question = clean(params.get("q"));

function clean(value) {
  return (value || "").trim().slice(0, 160);
}

function showBuilder() {
  builderView.hidden = false;
  proposalView.hidden = true;
}

function showProposal() {
  builderView.hidden = true;
  proposalView.hidden = false;

  document.getElementById("recipientLine").textContent = to
    ? `${to},`
    : "A special question";

  document.getElementById("questionText").textContent =
    question || "Would you like to be my girlfriend?";

  document.getElementById("senderLine").textContent =
    from ? `— ${from}` : "";
}

function buildShareUrl(toName, fromName, questionText) {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("to", toName);
  url.searchParams.set("from", fromName);
  url.searchParams.set("q", questionText);
  return url.toString();
}

builderForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const toName = clean(document.getElementById("toName").value);
  const fromName = clean(document.getElementById("fromName").value);
  const questionText = clean(document.getElementById("question").value);

  const url = buildShareUrl(toName, fromName, questionText);
  shareUrl.value = url;
  previewLink.href = url;
  sharePanel.hidden = false;
  shareUrl.focus();
  shareUrl.select();
});

copyButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    copyButton.textContent = "Copied";
  } catch {
    shareUrl.select();
    document.execCommand("copy");
    copyButton.textContent = "Copied";
  }

  setTimeout(() => {
    copyButton.textContent = "Copy";
  }, 1800);
});

const answerButtons = document.getElementById("answerButtons");
const answerResult = document.getElementById("answerResult");
const resultTitle = document.getElementById("resultTitle");
const resultMessage = document.getElementById("resultMessage");
const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const resetButton = document.getElementById("resetButton");

function setButtonsDisabled(disabled) {
  yesButton.disabled = disabled;
  noButton.disabled = disabled;
}

async function submitAnswer(answer) {
  setButtonsDisabled(true);

  const originalYesText = yesButton.textContent;
  const originalNoText = noButton.textContent;
  yesButton.textContent = answer === "Yes" ? "Sending..." : originalYesText;
  noButton.textContent = answer === "No" ? "Sending..." : originalNoText;

  const payload = {
    recipient: to || "Not provided",
    sender: from || "Not provided",
    question: question || "Would you like to be my girlfriend?",
    answer,
    submitted_at: new Date().toLocaleString(),
    page_url: window.location.href,
    _subject: `Ask With Heart response: ${answer}`
  };

  try {
    const response = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("The response could not be sent.");
    }

    answerButtons.hidden = true;
    answerResult.hidden = false;
    resetButton.hidden = true;

    if (answer === "Yes") {
      resultTitle.textContent = "That is wonderful ♥";
      resultMessage.textContent = from
        ? `Your answer was sent to ${from}.`
        : "Your answer was sent.";
      celebrate();
    } else {
      resultTitle.textContent = "Thank you for being honest";
      resultMessage.textContent = from
        ? `Your answer was sent to ${from}.`
        : "Your answer was sent.";
    }
  } catch (error) {
    answerResult.hidden = false;
    resultTitle.textContent = "Your answer was not sent";
    resultMessage.textContent =
      "Please check your connection and press your answer again.";
  } finally {
    yesButton.textContent = originalYesText;
    noButton.textContent = originalNoText;
    setButtonsDisabled(false);
  }
}

yesButton?.addEventListener("click", () => submitAnswer("Yes"));
noButton?.addEventListener("click", () => submitAnswer("No"));

resetButton?.addEventListener("click", () => {
  answerButtons.hidden = false;
  answerResult.hidden = true;
});

function celebrate() {
  const colors = ["#e84872", "#f9a826", "#7b61ff", "#2dbf8c", "#ff7a59"];

  for (let i = 0; i < 34; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background =
      colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.45}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 2300);
  }
}

if (to || from || question) {
  showProposal();
} else {
  showBuilder();
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
