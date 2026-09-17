/* =========================================================
   FIXLINK ASSISTANT
   Helps customers identify the right professional
   ========================================================= */

const assistantLog = document.getElementById("assistantLog");
const assistantInput = document.getElementById("assistantInput");
const assistantForm = document.getElementById("assistantForm");
const assistantSuggestions = document.getElementById("assistantSuggestions");
const assistantResult = document.getElementById("assistantResult");
const assistantRecommendation = document.getElementById("assistantRecommendation");
const findProfessionals = document.getElementById("findProfessionals");

let assistantThinking = false;


/* =========================================================
   TRADE GUIDANCE
   ========================================================= */

const tradeGuidance = [

  {
    trade: "Plumbers",
    keywords: [
      "leak",
      "leaking",
      "pipe",
      "tap",
      "faucet",
      "toilet",
      "water",
      "drain",
      "plumb",
      "sink",
      "blocked drain",
      "burst pipe"
    ]
  },

  {
    trade: "Electricians",
    keywords: [
      "light",
      "lights",
      "power",
      "socket",
      "wire",
      "wiring",
      "electric",
      "electrical",
      "switch",
      "outlet",
      "fuse",
      "generator"
    ]
  },

  {
    trade: "Painters",
    keywords: [
      "paint",
      "painting",
      "wall paint",
      "colour",
      "color",
      "decor",
      "decoration"
    ]
  },

  {
    trade: "Carpenters",
    keywords: [
      "wood",
      "woodwork",
      "door",
      "cabinet",
      "shelf",
      "wooden",
      "carpenter"
    ]
  },

  {
    trade: "AC Technicians",
    keywords: [
      "ac",
      "a/c",
      "air conditioner",
      "air conditioning",
      "cooling",
      "refriger",
      "not cooling",
      "hot air"
    ]
  },

  {
    trade: "Cleaners",
    keywords: [
      "clean",
      "cleaning",
      "dirt",
      "dirty",
      "home cleaning",
      "office cleaning",
      "wash",
      "cleaner"
    ]
  },

  {
    trade: "Mechanics",
    keywords: [
      "car",
      "vehicle",
      "engine",
      "brake",
      "brakes",
      "tyre",
      "tire",
      "mechanic",
      "car repair",
      "vehicle repair"
    ]
  },

  {
    trade: "Tilers",
    keywords: [
      "tile",
      "tiles",
      "tiling",
      "floor tile",
      "bathroom floor",
      "wall tile"
    ]
  },

  {
    trade: "Builders / Masons",
    keywords: [
      "build",
      "building",
      "brick",
      "bricks",
      "cement",
      "concrete",
      "wall crack",
      "mason",
      "masonry",
      "construction"
    ]
  },

  {
    trade: "Welders",
    keywords: [
      "weld",
      "welding",
      "welder",
      "metal",
      "iron",
      "gate",
      "metal gate"
    ]
  },

  {
    trade: "Glass Installers",
    keywords: [
      "glass",
      "window",
      "windows",
      "mirror",
      "glass door"
    ]
  },

  {
    trade: "Landscapers",
    keywords: [
      "garden",
      "gardening",
      "lawn",
      "landscape",
      "landscaping",
      "tree",
      "grass",
      "yard"
    ]
  },

  {
    trade: "Furniture Makers",
    keywords: [
      "furniture",
      "sofa",
      "table",
      "chair",
      "wardrobe",
      "bed",
      "bookshelf"
    ]
  }

];


/* =========================================================
   FIND TRADE
   ========================================================= */

function recommendTrade(problem) {

  const text = problem
    .toLowerCase()
    .replace(/[.,!?]/g, " ");

  for (const item of tradeGuidance) {

    const match = item.keywords.some(keyword =>
      text.includes(keyword.toLowerCase())
    );

    if (match) {
      return item.trade;
    }
  }

  return "Plumbers";
}


/* =========================================================
   ADD MESSAGE TO CHAT
   ========================================================= */

function appendMessage(text, kind) {

  const message = document.createElement("div");

  message.className = `assistant-bubble ${kind}`;

  message.textContent = text;

  assistantLog.appendChild(message);

  assistantLog.scrollTop = assistantLog.scrollHeight;
}


/* =========================================================
   THINKING STATE
   ========================================================= */

function setAssistantThinking(thinking) {

  assistantThinking = thinking;

  assistantInput.disabled = thinking;

  const submitButton =
    assistantForm.querySelector("button");

  if (submitButton) {
    submitButton.disabled = thinking;
  }

  assistantSuggestions
    .querySelectorAll("button")
    .forEach(button => {
      button.disabled = thinking;
    });


  const currentThinking =
    document.getElementById("assistantThinking");


  if (thinking && !currentThinking) {

    const thinkingBubble =
      document.createElement("div");

    thinkingBubble.className =
      "assistant-bubble received assistant-thinking";

    thinkingBubble.id =
      "assistantThinking";

    thinkingBubble.setAttribute(
      "role",
      "status"
    );

    thinkingBubble.textContent =
      "FixLink Assistant is thinking...";

    assistantLog.appendChild(thinkingBubble);

    assistantLog.scrollTop =
      assistantLog.scrollHeight;
  }


  if (!thinking && currentThinking) {
    currentThinking.remove();
  }
}


/* =========================================================
   ASK ASSISTANT
   ========================================================= */

async function askAssistant(problem) {

  if (assistantThinking) return;

  const cleanProblem =
    problem.trim();

  if (!cleanProblem) return;


  const trade =
    recommendTrade(cleanProblem);


  appendMessage(
    cleanProblem,
    "sent"
  );


  setAssistantThinking(true);


  /*
     Small delay makes the assistant feel natural
     without making the user wait too long.
  */

  await new Promise(resolve =>
    setTimeout(resolve, 900)
  );


  setAssistantThinking(false);


  appendMessage(
    `This sounds like a ${trade.toLowerCase()} job. ` +
    `I recommend looking for ${trade.toLowerCase()} near you. ` +
    `You can compare their profiles, message them, or request a quote.`,
    "received"
  );


  assistantRecommendation.textContent =
    `Recommended trade: ${trade}`;


  assistantResult.hidden = false;


  findProfessionals.dataset.trade =
    trade;


  assistantSuggestions.hidden = true;


  assistantInput.disabled = false;

  assistantInput.focus();
}


/* =========================================================
   FORM SUBMIT
   ========================================================= */

assistantForm.addEventListener(
  "submit",
  event => {

    event.preventDefault();

    const problem =
      assistantInput.value.trim();

    if (!problem) return;

    askAssistant(problem);

    assistantInput.value = "";
  }
);


/* =========================================================
   QUICK SUGGESTIONS
   ========================================================= */

assistantSuggestions.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest("button");

    if (!button) return;

    const prompt =
      button.dataset.prompt;

    if (prompt) {
      askAssistant(prompt);
    }
  }
);


/* =========================================================
   VIEW MATCHING PROFESSIONALS
   ========================================================= */

findProfessionals.addEventListener(
  "click",
  () => {

    const trade =
      findProfessionals.dataset.trade || "";

    /*
       Store the selected trade so the homepage can
       use it when the customer arrives.
    */

    if (trade) {
      localStorage.setItem(
        "fixlinkAssistantTrade",
        trade
      );
    }

    window.location.href =
      "index.html#services";
  }
);
