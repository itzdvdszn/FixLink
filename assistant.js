const assistantLog = document.getElementById("assistantLog");
const assistantInput = document.getElementById("assistantInput");
const assistantForm = document.getElementById("assistantForm");
const assistantSuggestions = document.getElementById("assistantSuggestions");
const assistantResult = document.getElementById("assistantResult");
const assistantRecommendation = document.getElementById("assistantRecommendation");
const findProfessionals = document.getElementById("findProfessionals");
let assistantThinking = false;

const tradeGuidance = [
  {trade:"Plumbers", keywords:["leak","pipe","tap","toilet","water","drain","plumb","sink"]},
  {trade:"Electricians", keywords:["light","power","socket","wire","electric","switch","outlet","fuse"]},
  {trade:"Painters", keywords:["paint","wall","colour","color","decor"]},
  {trade:"Carpenters", keywords:["wood","door","cabinet","shelf","furniture","carpenter"]},
  {trade:"AC Technicians", keywords:["ac","air conditioner","cooling","fan","refriger"]},
  {trade:"Cleaners", keywords:["clean","dirt","home cleaning","office cleaning"]},
  {trade:"Mechanics", keywords:["car","vehicle","engine","brake","tyre","tire","mechanic"]},
  {trade:"Tilers", keywords:["tile","floor","bathroom floor"]},
  {trade:"Builders / Masons", keywords:["build","brick","cement","wall crack","mason"]},
  {trade:"Welders", keywords:["weld","metal","iron","gate"]},
  {trade:"Glass Installers", keywords:["glass","window","mirror"]},
  {trade:"Landscapers", keywords:["garden","lawn","landscape","tree"]},
  {trade:"Furniture Makers", keywords:["furniture","sofa","table","chair"]}
];

function recommendTrade(problem){
  const text = problem.toLowerCase();
  return tradeGuidance.find(item => item.keywords.some(keyword => text.includes(keyword)))?.trade || "Plumbers";
}

function appendMessage(text, kind){
  const message = document.createElement("div");
  message.className = `assistant-bubble ${kind}`;
  message.textContent = text;
  assistantLog.appendChild(message);
  assistantLog.scrollTop = assistantLog.scrollHeight;
}

function setAssistantThinking(thinking){
  assistantThinking = thinking;
  assistantInput.disabled = thinking;
  assistantForm.querySelector("button").disabled = thinking;
  assistantSuggestions.querySelectorAll("button").forEach(button => button.disabled = thinking);
  const current = document.getElementById("assistantThinking");
  if(thinking && !current){
    assistantLog.insertAdjacentHTML("beforeend", '<div class="assistant-bubble received assistant-thinking" id="assistantThinking" role="status" aria-label="FixLink Assistant is thinking"><span></span><span></span><span></span></div>');
    assistantLog.scrollTop = assistantLog.scrollHeight;
  }else if(!thinking && current){
    current.remove();
  }
}

async function askAssistant(problem){
  if(assistantThinking) return;
  const trade = recommendTrade(problem);
  appendMessage(problem, "sent");
  setAssistantThinking(true);
  await new Promise(resolve => setTimeout(resolve, 3000));
  const response = document.createElement("div");
  response.className = "assistant-bubble received";
  response.innerHTML = `This sounds like a <strong>${trade}</strong> job. I recommend starting with trusted ${trade.toLowerCase()} near you. You can compare their profiles, message them, or request a quote.`;
  assistantLog.appendChild(response);
  assistantRecommendation.innerHTML = `Recommended trade: <strong>${trade}</strong>`;
  assistantResult.hidden = false;
  findProfessionals.dataset.trade = trade;
  assistantSuggestions.hidden = true;
  setAssistantThinking(false);
}

assistantForm.addEventListener("submit", event => {
  event.preventDefault();
  const problem = assistantInput.value.trim();
  if(problem){
    askAssistant(problem);
    assistantInput.value = "";
  }
});

assistantSuggestions.addEventListener("click", event => {
  const button = event.target.closest("button");
  if(button) askAssistant(button.dataset.prompt);
});

findProfessionals.addEventListener("click", () => {
  window.location.href = `index.html#services`;
});
