const services = [
  ["Plumbers","🔧","https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=700&q=80"],["Carpenters","🔨","https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=700&q=80"],["Electricians","⚡","https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=700&q=80"],["Painters","🎨","https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=700&q=80"],["Bricklayers","🧱","https://images.unsplash.com/photo-1590725140246-20acdee442be?auto=format&fit=crop&w=700&q=80"],["AC Technicians","❄️","assets/ac-technician.png"],["Welders","🔩","https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=700&q=80"],["Glass Installers","🪟","https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=700&q=80"],["Tilers","🏠","https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=700&q=80"],["Cleaners","🧹","https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80"],["Mechanics","🚗","https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&w=700&q=80"],["Furniture Makers","🪚","https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80"],["Builders / Masons","🏗️","https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=700&q=80"],["Landscapers","🌳","https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=700&q=80"]
];
const demoPros=[
 {name:"Musa Plumbing",rating:"4.8",jobs:"124",distance:"2.3 km away",experience:"6 years experience",trade:"Plumbers",price:"₦5,000",img:"https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80",city:"Lagos",phone:"+2348000000001"},
 {name:"James Carpentry",rating:"4.7",jobs:"98",distance:"3.1 km away",experience:"5 years experience",trade:"Carpenters",price:"₦4,000",img:"https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=500&q=80",city:"Lagos",phone:"+2348000000002"},
 {name:"Tunde Electric",rating:"4.9",jobs:"156",distance:"1.8 km away",experience:"7 years experience",trade:"Electricians",price:"₦6,000",img:"https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=500&q=80",city:"Lagos",phone:"+2348000000003"},
 {name:"Samuel Paints",rating:"4.6",jobs:"87",distance:"4.2 km away",experience:"4 years experience",trade:"Painters",price:"₦4,500",img:"https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=500&q=80",city:"Lagos",phone:"+2348000000004"}
];
const $=id=>document.getElementById(id), sg=$("serviceGrid"),pg=$("proGrid"),mg=$("monitoringGrid"),toast=$("toast");
const settingsLink=document.createElement("button");settingsLink.className="header-settings";settingsLink.type="button";settingsLink.setAttribute("aria-label","Open settings");settingsLink.title="Settings";settingsLink.textContent="⚙";settingsLink.style.cssText="display:grid;place-items:center;flex:0 0 42px;width:42px;height:42px;margin-right:12px;border:0;border-radius:50%;background:#c7cbd1;color:#062b5c;text-decoration:none;font-size:23px;font-weight:700;box-shadow:0 4px 12px #062b5c2b";const topbar=document.querySelector(".topbar");topbar?.prepend(settingsLink);if(topbar){topbar.style.justifyContent="flex-start";const headerActions=topbar.querySelector(".header-actions");if(headerActions)headerActions.style.marginLeft="auto"}
const proModal=$("proModal"),customerModal=$("customerModal"),jobModal=$("jobModal"),accountModal=$("accountModal"),messageModal=$("messageModal"),professionalModal=$("professionalModal"),paymentModal=$("paymentModal"),premiumModal=$("premiumModal"),assistantModal=$("assistantModal"),settingsDrawer=$("settingsDrawer");const premiumSettingsRow=document.createElement("a");premiumSettingsRow.className="settings-row premium-settings-row";premiumSettingsRow.href="#premium";settingsDrawer?.querySelector(".settings-list")?.append(premiumSettingsRow);function updatePremiumSettings(){const days=premiumDaysRemaining();premiumSettingsRow.innerHTML=days?`<div><strong>Premium Visibility</strong><span>Active • ${days} day${days===1?"":"s"} remaining</span></div><span class="premium-status">ACTIVE</span>`:`<div><strong>Premium Visibility</strong><span>Optional upgrade for greater visibility.</span></div><span class="premium-status">VIEW</span>`;premiumSettingsRow.onclick=event=>{event.preventDefault();showModal(premiumModal)}}updatePremiumSettings();const closeSettings=()=>{settingsDrawer.classList.remove("show");settingsDrawer.setAttribute("aria-hidden","true");settingsDrawer.style.setProperty("visibility","hidden","important");settingsDrawer.style.setProperty("opacity","0","important")};settingsLink.onclick=()=>{updatePremiumSettings();settingsDrawer.classList.add("show");settingsDrawer.setAttribute("aria-hidden","false");settingsDrawer.style.setProperty("visibility","visible","important");settingsDrawer.style.setProperty("opacity","1","important")};$("closeSettings").onclick=closeSettings;settingsDrawer.onclick=event=>{if(event.target===settingsDrawer)closeSettings()};
const steps=[...document.querySelectorAll(".form-step")],labels=[...document.querySelectorAll(".steps span")],bar=$("progressBar"); let current=0,accountRole="customer",deferredInstall=null;
const PROS_KEY="fixlink_demo_public_pros_v2", ACCOUNT_KEY="fixlink_demo_account_v2", PREMIUM_KEY="fixlink_premium_status_v1", PREMIUM_EXPIRES_KEY="fixlink_premium_expires_v1", COMMISSION_RATE=0.30, STANDARD_PROFESSIONAL_RATE=0.10, PAYSTACK_PUBLIC_KEY="pk_test_replace_with_your_paystack_public_key"; let pendingPayment=null,assistantThinking=false;
const footerInfo={"#about":["About FixLink","FixLink connects customers with trusted local service professionals."],"#how-it-works":["How FixLink works","Search for a service, compare verified professionals, then message or request the right person for your job."],"#contact":["Contact FixLink","Send us a message through the FixLink support team. This demo does not send real email."],"#help":["Help Center","For this demo, start by searching for a service or opening the FixLink Assistant."],"#faqs":["FAQs","You can compare professionals, message them, request a service, and track active bookings."],"#support":["Contact Support","Support messaging will be connected during the backend phase."],"#privacy":["Privacy Policy","This demo stores account, profile, and Premium status data only on this device."],"#terms":["Terms of Service","FixLink demo requests, payments, and profiles are for demonstration purposes only."],"#cookies":["Cookie Policy","This demo does not use advertising cookies."],"#safety":["Safety","Use verified professionals, discuss the work clearly, and never share sensitive documents in this demo."],"#facebook":["Facebook","Social links will be connected when FixLink's official channels are available."],"#instagram":["Instagram","Social links will be connected when FixLink's official channels are available."],"#tiktok":["TikTok","Social links will be connected when FixLink's official channels are available."],"#x":["X","Social links will be connected when FixLink's official channels are available."]};
const footerDialog=document.createElement("div");footerDialog.className="modal";footerDialog.innerHTML='<div class="modal-card small"><button class="close footer-dialog-close" type="button" aria-label="Close information">×</button><div class="modal-head"><span class="pill">FIXLINK</span><h2 id="footerDialogTitle"></h2><p id="footerDialogText"></p></div></div></div>';document.body.append(footerDialog);function showFooterInfo(title,text){$("footerDialogTitle").textContent=title;$("footerDialogText").textContent=text;showModal(footerDialog)}footerDialog.querySelector(".footer-dialog-close").onclick=()=>closeModal(footerDialog);footerDialog.addEventListener("click",event=>{if(event.target===footerDialog)closeModal(footerDialog)});
document.querySelectorAll(".site-footer a").forEach(link=>link.onclick=event=>{event.preventDefault();const action=link.getAttribute("href");if(action==="#services"||action==="#professionals"){window.location.href="search.html";return}if(action==="#request"){openJob();return}if(action==="#become-pro"||action==="#pro-signup"){openPro();return}if(action==="#pro-signin"){openAccount("professional");return}const info=footerInfo[action];if(info)showFooterInfo(info[0],info[1])});
function premiumDaysRemaining(){const statusKey="fixlink_premium_status_v1",expiresKey="fixlink_premium_expires_v1";if(localStorage.getItem(statusKey)!=="active")return 0;let expires=Number(localStorage.getItem(expiresKey)||0);if(!expires){expires=Date.now()+30*24*60*60*1000;localStorage.setItem(expiresKey,String(expires))}const days=Math.ceil((expires-Date.now())/(24*60*60*1000));if(days<=0){localStorage.removeItem(statusKey);localStorage.removeItem(expiresKey);return 0}return days}
function msg(t){toast.textContent=t;toast.classList.add("show");clearTimeout(msg.timer);msg.timer=setTimeout(()=>toast.classList.remove("show"),2400)}
function getPros(){try{return JSON.parse(localStorage.getItem(PROS_KEY)||"[]")}catch{return []}}
function savePros(a){localStorage.setItem(PROS_KEY,JSON.stringify(a))}
function distanceBasedPrice(basePrice,distance){const base=Number(String(basePrice||0).replace(/[^0-9.]/g,""));const kilometers=Number(String(distance||"").match(/[0-9]+(?:\.[0-9]+)?/)?.[0]||0);return `₦${Math.round(base+kilometers*100).toLocaleString()}`}
const fallbackImage="assets/ac-technician.png";
function renderServices(list=services){sg.innerHTML=list.length?list.map(([name,icon,img])=>`<button class="service-card" data-service="${name}" type="button"><img src="${img}" alt="${name}" loading="lazy"><span class="service-icon">${icon}</span><span class="service-label">${name}</span></button>`).join(""): '<div class="empty-state">No matching service found. Try another search.</div>'}
function getRenderedPros(){const registered=getPros().map(p=>({...p,rating:"New",jobs:"0",distance:p.city?`${p.city} • nearby demo profile`:"Location not set",experience:`${p.experience||0} years experience`,price:`₦${Number(p.startingPrice||0).toLocaleString()}`,img:p.img||services.find(s=>s[0]===p.trade)?.[2]||services[0][2]}));return [...registered,...demoPros].map(p=>({...p,price:distanceBasedPrice(p.price,p.distance)}))}
function renderPros(){const all=getRenderedPros();pg.innerHTML=all.map((p,index)=>`<article class="pro-card" data-pro-index="${index}" tabindex="0"><div class="pro-image"><img src="${p.img}" alt="${p.name}" loading="lazy"><span class="verified">✓ Verified</span></div><div class="pro-body"><h3>${p.name}</h3><div class="rating">★ ${p.rating} <span class="meta">(${p.jobs} jobs)</span></div><div class="meta">⌖ ${p.distance}</div><div class="meta">◷ ${p.experience}</div><span class="tag">${p.trade}</span><div class="price">From ${p.price}</div><div class="pro-actions"><button class="secondary message-pro" type="button" data-name="${p.name}" data-trade="${p.trade}" data-phone="${p.phone||""}">Message</button><a class="secondary call-pro" href="${p.phone?`tel:${p.phone}`:"#"}" data-phone="${p.phone||""}">☎ Call</a><button class="primary request-pro" type="button" data-trade="${p.trade}">Request</button></div></div></article>`).join("")}
const monitoringJobs=[{name:"Musa Plumbing",trade:"Plumbing repair",status:"On the way",progress:72,distance:"0.8 km away",eta:"Arriving in 8 min",img:demoPros[0].img,latitude:6.5244,longitude:3.3792},{name:"Tunde Electric",trade:"Electrical inspection",status:"Heading to you",progress:38,distance:"2.1 km away",eta:"Arriving in 18 min",img:demoPros[2].img,latitude:6.6018,longitude:3.3515}];
function renderMonitoring(){mg.innerHTML=monitoringJobs.map((job,index)=>`<article class="monitor-card"><div class="monitor-head"><img class="monitor-avatar" src="${job.img}" alt="${job.name}"><div><h3>${job.name}</h3><p>${job.trade}</p></div><span class="monitor-status">${job.status}</span></div><div class="monitor-route"><span>Professional location</span><strong>${job.distance}</strong></div><div class="monitor-progress" aria-label="${job.progress}% of the journey completed"><span style="width:${job.progress}%"></span></div><div class="monitor-meta"><span>Journey progress <strong>${job.progress}%</strong></span><span><strong>${job.eta}</strong></span></div><button class="secondary monitor-action" type="button" data-monitor-index="${index}">View tracking details</button></article>`).join("")}
document.addEventListener("error",event=>{const image=event.target;if(image instanceof HTMLImageElement&&image.getAttribute("src")!==fallbackImage){image.src=fallbackImage}},true);
function showModal(m){m.classList.add("show");document.body.style.overflow="hidden"} function closeModal(m){m.classList.remove("show");if(![proModal,customerModal,jobModal,accountModal,messageModal,professionalModal,paymentModal,premiumModal,assistantModal].some(x=>x.classList.contains("show")))document.body.style.overflow=""} function closeAll(){[proModal,customerModal,jobModal,accountModal,messageModal,professionalModal,paymentModal,premiumModal,assistantModal].forEach(m=>m.classList.remove("show"));document.body.style.overflow=""}
function showModal(m){m.classList.add("show");document.body.style.overflow="hidden"} function closeModal(m){m.classList.remove("show");if(![proModal,customerModal,jobModal,accountModal,messageModal,paymentModal,premiumModal,assistantModal].some(x=>x.classList.contains("show")))document.body.style.overflow=""} function closeAll(){[proModal,customerModal,jobModal,accountModal,messageModal,paymentModal,premiumModal,assistantModal].forEach(m=>m.classList.remove("show"));document.body.style.overflow=""}
function update(){steps.forEach((s,i)=>s.classList.toggle("active",i===current));labels.forEach((l,i)=>l.classList.toggle("active",i===current));bar.style.width=`${((current+1)/steps.length)*100}%`;$("prevStep").style.visibility=current?"visible":"hidden";$("nextStep").textContent=current===steps.length-1?"Create Professional Profile":"Continue"}
function validate(){for(const f of steps[current].querySelectorAll("input,select,textarea")){if(!f.checkValidity()){f.reportValidity();return false}}return true}
services.forEach(([name])=>{$("trade").insertAdjacentHTML("beforeend",`<option>${name}</option>`);$("jobService").insertAdjacentHTML("beforeend",`<option>${name}</option>`)}); renderServices();renderPros();renderMonitoring();update();
function watchPasswordMatch(form){const password=form.querySelector('[name="password"]'),confirmation=form.querySelector('[name="confirmPassword"]'),message=form.querySelector('.password-match-message');const check=()=>{const incomplete=!confirmation.value||!password.value;message.textContent=incomplete?"":password.value===confirmation.value?"Passwords match.":"Passwords do not match.";message.className=`password-match-message ${incomplete?"":password.value===confirmation.value?"match":"mismatch"}`};password.addEventListener("input",check);confirmation.addEventListener("input",check)}
watchPasswordMatch($("proForm"));watchPasswordMatch($("customerForm"));
document.querySelectorAll(".password-toggle").forEach(button=>button.onclick=()=>{const input=$(button.dataset.target),visible=input.type==="text";input.type=visible?"password":"text";button.textContent=visible?"Show":"Hide";button.setAttribute("aria-label",`${visible?"Show":"Hide"} password`)})
$("nextStep").onclick = async () => {
  if (!validate()) return;

  const stepData = new FormData($("proForm"));

  if (
    current === 0 &&
    stepData.get("password") !== stepData.get("confirmPassword")
  ) {
    msg("Passwords do not match.");
    $("proForm [name=confirmPassword]").focus();
    return;
  }

  if (current < steps.length - 1) {
    current++;
    update();
    proModal.querySelector(".modal-card").scrollTo({
      top: 0,
      behavior: "smooth"
    });
    return;
  }

  const f = $("proForm");
  const d = new FormData(f);

  const name = d.get("fullName").trim();
  const phone = d.get("phone").trim();
  const email = d.get("email").trim();
  const city = d.get("city").trim();
  const password = d.get("password");

  const trade = d.get("trade") || "";
  const experience = d.get("experience") || "";
  const description = d.get("description") || "";
  const radius = d.get("radius") || "";
  const days = d.get("days") || "";
  const hours = d.get("hours") || "";
  const startingPrice = d.get("startingPrice") || "";

  const availability = [days, hours]
    .filter(Boolean)
    .join(" • ");

  try {
    msg("Creating your professional account...");

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone,
          role: "professional",
          location: city,

          // Professional information
          trade: trade,
          experience: experience ? Number(experience) : 0,
          description: description,
          radius: radius ? Number(radius) : null,
          days: days,
          hours: hours,
          availability: availability,

          // Other signup information
          starting_price: startingPrice
        }
      }
    });

    if (error) {
      console.error("Professional signup error:", error);
      msg(error.message);
      return;
    }

    if (!data.user) {
      msg("Professional account could not be created. Please try again.");
      return;
    }

    /*
     * The database trigger creates the profiles row and
     * professional row automatically using the metadata above.
     *
     * We deliberately DO NOT:
     * - query the profiles table
     * - insert into the professionals table
     *
     * This is important because email confirmation can mean
     * the browser does not yet have an authenticated session.
     */

    const publicProfile = {
      name,
      trade,
      city,
      experience,
      startingPrice
    };

    savePros([...getPros(), publicProfile]);

    localStorage.setItem(
      ACCOUNT_KEY,
      JSON.stringify({
        role: "professional",
        name,
        email,
        city,
        userId: data.user.id
      })
    );

    msg("Professional account created! Check your email to confirm it.");

    f.reset();
    current = 0;
    update();
    closeModal(proModal);
    renderPros();

   } catch (error) {
    console.error("Professional signup error:", error);
    msg("Something went wrong. Please try again.");
  }
};

$("prevStep").onclick=()=>{if(current){current--;update()}};
$("proForm").addEventListener("submit",e=>e.preventDefault());
$("customerForm").addEventListener("submit", async e => {
  e.preventDefault();

  const form = e.currentTarget;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const d = new FormData(form);

  if (d.get("password") !== d.get("confirmPassword")) {
    msg("Passwords do not match.");
    $("customerForm [name=confirmPassword]").focus();
    return;
  }

  const name = d.get("name").trim();
  const phone = d.get("phone").trim();
  const email = d.get("email").trim();
  const city = d.get("city").trim();
  const password = d.get("password");

  try {
    msg("Creating your account...");

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone,
          role: "customer",
          location: city
        }
      }
    });

    if (error) {
      msg(error.message);
      return;
    }

    if (!data.user) {
      msg("Account could not be created. Please try again.");
      return;
    }

    /*
     * The database trigger automatically creates:
     * 1. The profiles row
     * 2. The customers row
     *
     * We do not read those rows here because email
     * confirmation means the browser is not authenticated yet.
     */

    localStorage.setItem(
      ACCOUNT_KEY,
      JSON.stringify({
        role: "customer",
        name,
        email,
        city,
        userId: data.user.id
      })
    );

    msg("Account created! Check your email to confirm your account.");
    form.reset();
    closeModal(customerModal);

  } catch (error) {
    console.error("Customer signup error:", error);
    msg("Something went wrong. Please try again.");
  }
});
$("professionalSignup").onclick = () => {
  closeModal(customerModal);
  openPro();
};
$("jobForm").addEventListener("submit",e=>{e.preventDefault();if(!e.currentTarget.checkValidity()){e.currentTarget.reportValidity();return}const data=new FormData(e.currentTarget),workerAmount=Number(data.get("budget")||0);if(workerAmount<=0){msg("Enter a budget to continue to payment.");return}const premium=localStorage.getItem(PREMIUM_KEY)==="active",customerFee=Math.ceil(workerAmount*COMMISSION_RATE),professionalFee=premium?0:Math.ceil(workerAmount*STANDARD_PROFESSIONAL_RATE),payout=workerAmount-professionalFee,total=workerAmount+customerFee;pendingPayment={service:data.get("service"),workerAmount,customerFee,professionalFee,payout,premium,description:data.get("description")};$("workerAmount").textContent=`₦${workerAmount.toLocaleString()}`;$("commissionAmount").textContent=`₦${customerFee.toLocaleString()}`;$("professionalFeeLabel").textContent=premium?"Premium professional platform deduction (0%)":"Standard professional platform deduction (10%)";$("professionalFeeAmount").textContent=`₦${professionalFee.toLocaleString()}`;$("payoutLabel").textContent=premium?"Premium professional receives in full":"Standard professional payout";$("payoutAmount").textContent=`₦${payout.toLocaleString()}`;$("totalAmount").textContent=`₦${total.toLocaleString()}`;showModal(paymentModal)});
$("payNow").onclick=()=>{const email=$("paymentEmail");if(!email.checkValidity()){email.reportValidity();return}if(!pendingPayment)return;const amount=pendingPayment.workerAmount+pendingPayment.customerFee;if(!window.PaystackPop||PAYSTACK_PUBLIC_KEY.includes("replace_with")){msg("Add your Paystack public key in script.js to enable live checkout.");return}const handler=PaystackPop.setup({key:PAYSTACK_PUBLIC_KEY,email:email.value,amount:amount*100,currency:"NGN",metadata:{custom_fields:[{display_name:"Service",variable_name:"service",value:pendingPayment.service},{display_name:"FixLink customer usage fee",variable_name:"usage_fee",value:`₦${pendingPayment.customerFee.toLocaleString()}`},{display_name:"Professional platform deduction",variable_name:"professional_fee",value:`₦${pendingPayment.professionalFee.toLocaleString()}`},{display_name:"Professional payout",variable_name:"professional_payout",value:`₦${pendingPayment.payout.toLocaleString()}`},{display_name:"Premium status",variable_name:"premium",value:pendingPayment.premium?"active":"standard"}]},callback:transaction=>{msg(`Payment successful: ${transaction.reference}`);pendingPayment=null;$("paymentEmail").value="";$("jobForm").reset();closeModal(paymentModal)},onClose:()=>msg("Payment window closed.")});handler.openIframe()};
function openCustomer(){showModal(customerModal)} function openPro(){showModal(proModal);update()} function openJob(service=""){if(service)$("jobService").value=service;showModal(jobModal)}
function openMessage(name="a professional",trade="local services",phone=""){ $("messageTitle").textContent=`Chat with ${name}`; $("messageSubtitle").textContent=`${trade} • nearby and ready to help`;$("messageCall").href=phone?`tel:${phone}`:"#";$("messageCall").hidden=!phone;$("chatLog").innerHTML=`<div class="chat-bubble received">Hi! I’m ${name}. Tell me what you need help with and I’ll get back to you shortly.<small>Just now</small></div>`; showModal(messageModal); $("messageInput").focus() }
function openProfessionalDetails(pro){$("professionalDetailsImage").src=pro.img;$("professionalDetailsImage").alt=pro.name;$("professionalDetailsName").textContent=pro.name;$("professionalDetailsTrade").textContent=`${pro.trade} • From ${pro.price}`;$("professionalDetailsRating").textContent=`★ ${pro.rating}`;$("professionalDetailsJobs").textContent=pro.jobs;$("professionalDetailsExperience").textContent=pro.experience;$("professionalDetailsLocation").textContent=pro.distance;$("professionalDetailsBio").textContent=`${pro.name} is a verified ${pro.trade.toLowerCase()} professional serving customers nearby. Contact them to discuss your project, availability and the right service for your needs.`;$("professionalDetailsMessage").onclick=()=>{closeModal(professionalModal);openMessage(pro.name,pro.trade,pro.phone||"")};$("professionalDetailsRequest").onclick=()=>{closeModal(professionalModal);openJob(pro.trade)};showModal(professionalModal)}
const tradeGuidance=[{trade:"Plumbers",keywords:["leak","pipe","tap","toilet","water","drain","plumb","sink"]},{trade:"Electricians",keywords:["light","power","socket","wire","electric","switch","outlet","fuse"]},{trade:"Painters",keywords:["paint","wall","colour","color","decor"]},{trade:"Carpenters",keywords:["wood","door","cabinet","shelf","furniture","carpenter"]},{trade:"AC Technicians",keywords:["ac","air conditioner","cooling","fan","refriger"]},{trade:"Cleaners",keywords:["clean","dirt","home cleaning","office cleaning"]},{trade:"Mechanics",keywords:["car","vehicle","engine","brake","tyre","tire","mechanic"]},{trade:"Tilers",keywords:["tile","floor","bathroom floor"]},{trade:"Builders / Masons",keywords:["build","brick","cement","wall crack","mason"]},{trade:"Welders",keywords:["weld","metal","iron","gate"]},{trade:"Glass Installers",keywords:["glass","window","mirror"]},{trade:"Landscapers",keywords:["garden","lawn","landscape","tree"]},{trade:"Furniture Makers",keywords:["furniture","sofa","table","chair"]}];
function recommendTrade(problem){const text=problem.toLowerCase();const match=tradeGuidance.find(item=>item.keywords.some(keyword=>text.includes(keyword)));return match?.trade||"Plumbers"}
function assistantMessage(text,kind="received"){$("assistantLog").insertAdjacentHTML("beforeend",`<div class="assistant-bubble ${kind}">${text}</div>`);$("assistantLog").scrollTop=$("assistantLog").scrollHeight}
function setAssistantThinking(thinking){assistantThinking=thinking;$("assistantInput").disabled=thinking;$("assistantForm").querySelector("button").disabled=thinking;document.querySelectorAll("#assistantSuggestions button").forEach(button=>button.disabled=thinking);const current=$("assistantThinking");if(thinking&&!current){$("assistantLog").insertAdjacentHTML("beforeend",'<div class="assistant-bubble received assistant-thinking" id="assistantThinking" role="status" aria-label="FixLink Assistant is thinking"><span></span><span></span><span></span></div>');$("assistantLog").scrollTop=$("assistantLog").scrollHeight}else if(!thinking&&current)current.remove()}
async function askAssistant(problem){if(assistantThinking)return;const trade=recommendTrade(problem);assistantMessage(problem,"sent");setAssistantThinking(true);await new Promise(resolve=>setTimeout(resolve,3000));assistantMessage(`This sounds like a <strong>${trade}</strong> job. I recommend starting with trusted ${trade.toLowerCase()} near you. You can compare their profiles, message them, or request a quote.`);$("assistantRecommendation").innerHTML=`Recommended trade: <strong>${trade}</strong>`;$("assistantResult").hidden=false;$("findProfessionals").dataset.trade=trade;$("assistantSuggestions").hidden=true;setAssistantThinking(false)}
if($("assistantBtn"))$("assistantBtn").onclick=()=>{showModal(assistantModal);$("assistantInput").focus()};$("assistantForm").addEventListener("submit",e=>{e.preventDefault();const input=$("assistantInput"),problem=input.value.trim();if(problem){askAssistant(problem);input.value=""}});$("assistantSuggestions").addEventListener("click",e=>{const button=e.target.closest("button");if(button)askAssistant(button.dataset.prompt)});$("findProfessionals").onclick=()=>{const trade=$("findProfessionals").dataset.trade;closeModal(assistantModal);$("searchInput").value=trade;renderServices(services.filter(service=>service[0]===trade));document.querySelector("#serviceGrid").scrollIntoView({behavior:"smooth"});msg(`Showing ${trade} professionals and services.`)};
$("openPremium").onclick=()=>showModal(premiumModal);$("accountPremium").onclick=()=>showModal(premiumModal);$("subscribePremium").onclick=()=>{localStorage.setItem(PREMIUM_KEY,"active");msg("Premium selected. Its monthly subscription is separate from job payments.");closeModal(premiumModal)};
$("openPremium").onclick=()=>showModal(premiumModal);$("accountPremium").onclick=()=>showModal(premiumModal);$("subscribePremium").onclick=()=>{localStorage.setItem(PREMIUM_KEY,"active");localStorage.setItem(PREMIUM_EXPIRES_KEY,String(Date.now()+30*24*60*60*1000));updatePremiumSettings();msg("Premium selected. Its monthly subscription is separate from job payments.");closeModal(premiumModal)};
$("messageForm").addEventListener("submit",e=>{e.preventDefault();const input=$("messageInput");const message=input.value.trim();if(!message)return;$("chatLog").insertAdjacentHTML("beforeend",`<div class="chat-bubble sent">${message}<small>Just now</small></div>`);input.value="";$("chatLog").scrollTop=$("chatLog").scrollHeight;setTimeout(()=>{$("chatLog").insertAdjacentHTML("beforeend",`<div class="chat-bubble received">Thanks for reaching out. I can help with that. Please share your preferred time and area.<small>Just now</small></div>`);$("chatLog").scrollTop=$("chatLog").scrollHeight},650)});
function updateAccountCopy(){const professional=accountRole==="professional";$("accountTitle").textContent=professional?"Welcome back, professional":"Welcome back";$("accountSubtitle").textContent=professional?"Sign in to manage your profile, requests and Premium Visibility.":"Sign in as a customer to message professionals and manage your requests.";$("professionalAccountActions").hidden=!professional}
function openAccount(role="customer"){accountRole=role;document.querySelectorAll(".auth-tab").forEach(t=>t.classList.toggle("active",t.dataset.role===role));updateAccountCopy();showModal(accountModal)}
$("profileBtn")?.addEventListener("click", () => openAccount("customer"));
$("accountBtn")?.addEventListener("click", () => openAccount("customer"));
$("createAccountBtn")?.addEventListener("click", () => openCustomer());
$("fixlink-home-brand")?.addEventListener("click", () => {
  if (location.pathname.endsWith("index.html")) return;
});
document.querySelectorAll(".auth-tab").forEach(t=>t.onclick=()=>{accountRole=t.dataset.role;document.querySelectorAll(".auth-tab").forEach(x=>x.classList.toggle("active",x===t));updateAccountCopy()});
$("accountForm").addEventListener("submit", async e => {

  e.preventDefault();

  const form = e.currentTarget;

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const d = new FormData(form);
  const email = d.get("email").trim();
  const password = d.get("password");

  try {
    msg("Signing you in...");

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      msg(error.message);
      return;
    }

    if (!data.user) {
      msg("Sign in failed. Please try again.");
      return;
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from("profiles")
      .select("id, full_name, email, phone, role, location")
      .eq("user_id", data.user.id)
      .single();

    if (profileError) {
      console.error("Profile lookup error:", profileError);
      msg("Signed in, but your profile could not be loaded.");
      return;
    }

    if (profile.role !== accountRole) {
      await supabaseClient.auth.signOut();

      msg(
        `This account is registered as a ${profile.role}, not a ${accountRole}.`
      );
      return;
    }

    localStorage.setItem(
      ACCOUNT_KEY,
      JSON.stringify({
        role: profile.role,
        name: profile.full_name,
        email: profile.email,
        city: profile.location || "",
        userId: data.user.id
      })
    );

    msg(
      `${profile.role[0].toUpperCase() + profile.role.slice(1)} sign-in successful.`
    );

    form.reset();
    closeModal(accountModal);

  } catch (error) {
    console.error("Sign-in error:", error);
    msg("Something went wrong. Please try again.");
  }

});

$("viewPros").onclick=()=>pg.scrollIntoView({behavior:"smooth"});$("viewServices").onclick=()=>sg.scrollIntoView({behavior:"smooth"});
function useLocation(){if(!navigator.geolocation){msg("Location is not supported by this browser.");return}navigator.geolocation.getCurrentPosition(()=>{ $("locationText").textContent="Nearby"; msg("Location detected. Nearby matching is currently a demo feature.");},()=>msg("Location permission was not granted."))}
$("locationBtn").onclick=useLocation;
$("useLocation").onclick=useLocation;
// =========================================================
// FIXLINK PROFESSIONAL LOCATION
// =========================================================

let professionalLatitude = null;
let professionalLongitude = null;

const professionalLocationButton = $("allowProfessionalLocation");
const professionalLocationStatus = $("professionalLocationStatus");

if (professionalLocationButton) {
  professionalLocationButton.addEventListener("click", () => {

    if (!navigator.geolocation) {
      professionalLocationStatus.textContent =
        "Location is not supported by this browser.";
      return;
    }

    professionalLocationButton.disabled = true;
    professionalLocationButton.textContent = "Detecting...";

    professionalLocationStatus.textContent =
      "Requesting your location. Please allow location access in your browser.";

    navigator.geolocation.getCurrentPosition(
      (position) => {

        professionalLatitude = position.coords.latitude;
        professionalLongitude = position.coords.longitude;

        professionalLocationStatus.textContent =
          "✓ Location detected successfully. Your position can be used for nearby customer matching.";

        professionalLocationButton.textContent = "Location allowed";
        professionalLocationButton.disabled = false;
      },

      (error) => {

        professionalLocationButton.disabled = false;
        professionalLocationButton.textContent = "Allow location";

        if (error.code === 1) {
          professionalLocationStatus.textContent =
            "Location permission was denied. Please allow location access in your browser settings and try again.";
        } else if (error.code === 2) {
          professionalLocationStatus.textContent =
            "Your location could not be detected. Please check your device location settings and try again.";
        } else if (error.code === 3) {
          professionalLocationStatus.textContent =
            "Location detection timed out. Please try again.";
        } else {
          professionalLocationStatus.textContent =
            "Unable to detect your location. Please try again.";
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  });
}
$("searchInput").oninput=e=>{const q=e.target.value.toLowerCase().trim();renderServices(q?services.filter(s=>s[0].toLowerCase().includes(q)):services)};
$("searchInput").onkeydown=e=>{if(e.key==="Enter"){e.preventDefault();const q=e.target.value.trim();if(q)msg(`Showing services matching “${q}”.`)}};
sg.addEventListener("click",e=>{const c=e.target.closest(".service-card");if(c)openJob(c.dataset.service)});pg.addEventListener("click",e=>{const card=e.target.closest(".pro-card"),message=e.target.closest(".message-pro"),request=e.target.closest(".request-pro");if(message)openMessage(message.dataset.name,message.dataset.trade,message.dataset.phone);else if(request)openJob(request.dataset.trade);else if(card)openProfessionalDetails(getRenderedPros()[Number(card.dataset.proIndex)])});pg.addEventListener("keydown",e=>{const card=e.target.closest(".pro-card");if(card&&["Enter"," "].includes(e.key)){e.preventDefault();openProfessionalDetails(getRenderedPros()[Number(card.dataset.proIndex)])}});
mg.addEventListener("click",e=>{const button=e.target.closest(".monitor-action");if(button){const job=monitoringJobs[Number(button.dataset.monitorIndex)];msg(`${job.name} is ${job.distance}. ${job.eta}.`)}});
["closeModal","closeCustomer","closeJob","closeAccount","closeMessage","closePayment","closePremium","closeAssistant"].forEach(id=>$(id).onclick=closeAll);$("closeProfessional").onclick=()=>closeModal(professionalModal);[proModal,customerModal,jobModal,accountModal,messageModal,professionalModal,paymentModal,premiumModal,assistantModal].forEach(m=>m.addEventListener("click",e=>{if(e.target===m)closeModal(m)}));document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAll()});
// =========================================================
// FIXLINK — AUTHENTICATION HEADER
// Updates the top-right buttons based on Supabase login state.
// =========================================================

function updateHeaderAuth(session) {
  const accountBtn = $("accountBtn");
  const createAccountBtn = $("createAccountBtn");
  const headerActions = document.querySelector(".header-actions");

  if (!headerActions) return;

  let profileTopBtn = $("profileTopBtn");
  let signOutTopBtn = $("signOutTopBtn");

  if (session && session.user) {
    // Hide Sign in / Create account
    if (accountBtn) accountBtn.hidden = true;
    if (createAccountBtn) createAccountBtn.hidden = true;

    // Create Profile button if it doesn't exist
    if (!profileTopBtn) {
      profileTopBtn = document.createElement("button");
      profileTopBtn.id = "profileTopBtn";
      profileTopBtn.className = "account-btn";
      profileTopBtn.textContent = "Profile";

      profileTopBtn.onclick = () => {
        window.location.href = "profile.html";
      };

      headerActions.appendChild(profileTopBtn);
    }

    // Create Sign out button if it doesn't exist
    if (!signOutTopBtn) {
      signOutTopBtn = document.createElement("button");
      signOutTopBtn.id = "signOutTopBtn";
      signOutTopBtn.className = "create-account-btn";
      signOutTopBtn.textContent = "Sign out";

      signOutTopBtn.onclick = async () => {
        const { error } = await supabaseClient.auth.signOut();

        if (error) {
          console.error("Sign out error:", error);
          msg("Unable to sign out. Please try again.");
          return;
        }

        localStorage.removeItem(ACCOUNT_KEY);

        msg("You have been signed out.");

        updateHeaderAuth(null);
      };

      headerActions.appendChild(signOutTopBtn);
    }

    profileTopBtn.hidden = false;
    signOutTopBtn.hidden = false;

  } else {
    // Show Sign in / Create account
    if (accountBtn) accountBtn.hidden = false;
    if (createAccountBtn) createAccountBtn.hidden = false;

    // Hide logged-in buttons
    if (profileTopBtn) profileTopBtn.hidden = true;
    if (signOutTopBtn) signOutTopBtn.hidden = true;
  }
}


// Check current Supabase session when the page loads.
supabaseClient.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error("Session check error:", error);
    updateHeaderAuth(null);
    return;
  }

  updateHeaderAuth(data.session);
});


// Automatically update the header whenever authentication changes.
supabaseClient.auth.onAuthStateChange((event, session) => {
  updateHeaderAuth(session);
});
