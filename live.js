// =========================================================
// FIXLINK LIVE DATA (load AFTER script.js)
// Real professionals from Supabase + real booking requests
// =========================================================
const SHOW_DEMO_WHEN_EMPTY = true; // demo cards only appear while there are no real professionals
const PRO_FIELDS = "id,full_name,profession,description,years_experience,location,service_area,availability,starting_price,verified,rating,is_premium";
let livePros = [], tradeFilter = "", pendingPro = null;

const toCard = p => ({
  id: p.id, live: true, verified: !!p.verified, premium: !!p.is_premium,
  name: p.full_name || "Professional", trade: p.profession || "Professional",
  rating: Number(p.rating) > 0 ? Number(p.rating).toFixed(1) : "New", jobs: "0",
  distance: p.location || "Location not set",
  experience: `${p.years_experience || 0} years experience`,
  price: p.starting_price ? `₦${Number(p.starting_price).toLocaleString()}` : "On request",
  img: services.find(s => s[0] === p.profession)?.[2] || services[0][2],
  description: p.description || ""
});

getRenderedPros = function () {
  let all = livePros.map(toCard);
  if (!all.length && SHOW_DEMO_WHEN_EMPTY) {
    all = demoPros.map(p => ({ ...p, demo: true, price: distanceBasedPrice(p.price, p.distance) }));
  }
  return tradeFilter ? all.filter(p => p.trade === tradeFilter) : all;
};

renderPros = function () {
  const all = getRenderedPros();
  if (!all.length) {
    pg.innerHTML = `<div class="empty-state">No professionals${tradeFilter ? ` for ${esc(tradeFilter)}` : ""} yet. ${tradeFilter ? '<button class="view-all" id="clearTrade" type="button">Show all professionals</button>' : ""}</div>`;
    return;
  }
  pg.innerHTML = all.map((p, i) => {
    const badge = p.demo ? '<span class="verified" style="background:#64748b">Demo profile</span>'
      : p.verified ? '<span class="verified">✓ Verified</span>'
      : '<span class="verified" style="background:#f5a900;color:#132a49">New</span>';
    const actions = p.demo
      ? `<button class="secondary message-pro" type="button" data-name="${esc(p.name)}" data-trade="${esc(p.trade)}" data-phone="${esc(p.phone || "")}">Message</button><a class="secondary call-pro" href="tel:${esc(p.phone || "")}">☎ Call</a><button class="primary request-pro" type="button">Request</button>`
      : `<button class="primary request-pro" type="button" style="grid-column:1/-1">Request</button>`;
    return `<article class="pro-card" data-pro-index="${i}" tabindex="0"><div class="pro-image"><img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">${badge}</div><div class="pro-body"><h3>${esc(p.name)}</h3><div class="rating">★ ${esc(p.rating)} <span class="meta">(${esc(p.jobs)} jobs)</span></div><div class="meta">⌖ ${esc(p.distance)}</div><div class="meta">◷ ${esc(p.experience)}</div><span class="tag">${esc(p.trade)}</span>${p.premium ? ' <span class="tag" style="background:#fff5d9;color:#a86b00">★ Premium</span>' : ""}<div class="price">From ${esc(p.price)}</div><div class="pro-actions">${actions}</div></div></article>`;
  }).join("");
};

async function loadLivePros() {
  try {
    const { data, error } = await supabaseClient.from("professionals").select(PRO_FIELDS)
      .order("is_premium", { ascending: false }).order("rating", { ascending: false });
    if (error) throw error;
    livePros = data || [];
  } catch (e) { console.error("Could not load professionals:", e); livePros = []; }
  renderPros();
}

// Honest wording in the professional details window
const _openDetails = openProfessionalDetails;
openProfessionalDetails = function (pro) {
  _openDetails(pro);
  professionalModal.querySelector(".pill").textContent = pro.demo ? "DEMO PROFILE" : pro.verified ? "VERIFIED PROFESSIONAL" : "PROFESSIONAL";
  $("professionalDetailsBio").textContent = pro.demo
    ? `${pro.name} is a demo profile that shows how FixLink professionals appear.`
    : (pro.description || `${pro.name} offers ${pro.trade.toLowerCase()} services.`);
  $("professionalDetailsMessage").hidden = !pro.demo;
  $("professionalDetailsRequest").onclick = () => { closeModal(professionalModal); startRequest(pro); };
};

openJob = function (service = "") {
  if (service) $("jobService").value = service;
  const head = jobModal.querySelector(".modal-head");
  head.querySelector("h2").textContent = pendingPro ? `Request ${pendingPro.name}` : "Request a professional";
  head.querySelector("p").textContent = "Tell them what you need. You pay only after they accept.";
  $("jobForm").elements.date.min = new Date().toISOString().slice(0, 10);
  showModal(jobModal);
};

async function startRequest(pro) {
  if (!pro) return;
  if (pro.demo) { msg("This is a demo profile. You can request real professionals as they join."); return; }
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) { msg("Please sign in as a customer to send a request."); openAccount("customer"); return; }
  pendingPro = pro;
  openJob(pro.trade);
}

// Capture-phase listeners run before the older handlers in script.js
pg.addEventListener("click", e => {
  if (e.target.closest("#clearTrade")) { e.stopPropagation(); tradeFilter = ""; renderPros(); return; }
  const req = e.target.closest(".request-pro");
  if (req) { e.stopPropagation(); startRequest(getRenderedPros()[Number(req.closest(".pro-card").dataset.proIndex)]); }
}, true);

sg.addEventListener("click", e => {
  const card = e.target.closest(".service-card");
  if (!card) return;
  e.stopPropagation();
  tradeFilter = card.dataset.service;
  renderPros();
  pg.scrollIntoView({ behavior: "smooth" });
  msg(`Showing ${tradeFilter} professionals. Pick one to send a request.`);
}, true);

$("viewPros").onclick = () => { tradeFilter = ""; renderPros(); pg.scrollIntoView({ behavior: "smooth" }); };

// Saving a real booking request
$("jobForm").addEventListener("submit", async e => {
  e.preventDefault(); e.stopImmediatePropagation();
  const form = e.currentTarget;
  if (!form.checkValidity()) { form.reportValidity(); return; }
  if (!pendingPro) { msg("Choose a professional first."); return; }
  const d = new FormData(form), budget = Number(d.get("budget") || 0);
  if (!(budget > 0)) { msg("Enter your budget so the professional can respond."); return; }
  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  try {
    const { data: customer, error: customerError } = await supabaseClient.from("customers").select("id").maybeSingle();
    if (customerError || !customer) { msg("Only customer accounts can send requests."); return; }
    const { error } = await supabaseClient.from("bookings").insert({
      customer_id: customer.id, professional_id: pendingPro.id,
      service: d.get("service"), description: d.get("description").trim(),
      location: d.get("location").trim(),
      scheduled_at: new Date(d.get("date") + "T09:00:00").toISOString(),
      budget, urgency: d.get("urgency"), status: "requested"
    });
    if (error) { console.error("Booking error:", error); msg("Could not send your request. Please try again."); return; }
    msg(`Request sent to ${pendingPro.name}. You can pay once they accept.`);
    form.reset(); pendingPro = null; updateFeePreview(); closeModal(jobModal);
  } finally { button.disabled = false; }
}, true);

// "Dashboard" button for professionals
async function syncDashboardButton(session) {
  const actions = document.querySelector(".header-actions");
  let button = $("dashboardTopBtn");
  if (!session || !actions) { button?.remove(); return; }
  const { data } = await supabaseClient.from("profiles").select("role").eq("user_id", session.user.id).maybeSingle();
  if (data?.role !== "professional") { button?.remove(); return; }
  if (!button) {
    button = document.createElement("button");
    button.id = "dashboardTopBtn"; button.className = "account-btn"; button.textContent = "Dashboard";
    button.onclick = () => { window.location.href = "dashboard.html"; };
    actions.insertBefore(button, $("profileTopBtn") || null);
  }
}
supabaseClient.auth.getSession().then(({ data }) => syncDashboardButton(data.session));
supabaseClient.auth.onAuthStateChange((_event, session) => setTimeout(() => syncDashboardButton(session), 0));

loadLivePros();
