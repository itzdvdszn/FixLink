// =========================================================
// FIXLINK — REAL PROFESSIONAL SEARCH + BOOKING
// =========================================================

const SUPABASE_URL =
  "https://liykyosnqcebnnnewomx.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_PJMLKaDQbAt4pxg3Bkp8dQ_8H5mYA7Y";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const input = document.getElementById("serviceSearch");
const results = document.getElementById("serviceResults");

// =========================================================
// LOAD PROFESSIONALS
// =========================================================

async function loadProfessionals() {

  results.innerHTML = `
    <div class="page-empty">
      <strong>Loading professionals...</strong>
      <span>Please wait.</span>
    </div>
  `;

  const { data, error } = await supabaseClient
    .from("professionals")
    .select(`
      id,
      profession,
      description,
      years_experience,
      location,
      service_area,
      availability,
      verified,
      rating,
      profile_id,
      profiles (
        full_name
      )
    `)
    .order("rating", { ascending: false });

  if (error) {

    console.error("Error loading professionals:", error);

    results.innerHTML = `
      <div class="page-empty">
        <strong>Unable to load professionals</strong>
        <span>Please refresh the page and try again.</span>
      </div>
    `;

    return;
  }

  renderProfessionals(data || []);
}

// =========================================================
// RENDER PROFESSIONALS
// =========================================================

function renderProfessionals(list) {

  if (!list.length) {

    results.innerHTML = `
      <div class="page-empty">
        <strong>No professionals available yet</strong>
        <span>New FixLink professionals will appear here when they register.</span>
      </div>
    `;

    return;
  }

  results.innerHTML = list.map(professional => {

    const name =
      professional.profiles?.full_name ||
      "FixLink Professional";

    const profession =
      professional.profession ||
      "Professional";

    const description =
      professional.description ||
      "Professional FixLink service provider.";

    const experience =
      professional.years_experience !== null &&
      professional.years_experience !== undefined
        ? `${professional.years_experience} years experience`
        : "Experience not listed";

    const rating =
      professional.rating !== null &&
      professional.rating !== undefined
        ? Number(professional.rating).toFixed(1)
        : "New";

    const verified =
      professional.verified
        ? `<span class="pill">VERIFIED</span>`
        : "";

    return `
      <article class="page-card">

        <div class="page-card-top">

          <div>
            <h2>${escapeHTML(name)}</h2>
            ${verified}
          </div>

        </div>

        <p>
          <strong>${escapeHTML(profession)}</strong>
        </p>

        <p>
          ${escapeHTML(description)}
        </p>

        <p>
          ${escapeHTML(experience)}
        </p>

        <p>
          📍 ${escapeHTML(
            professional.location || "Location not listed"
          )}
        </p>

        <p>
          ⭐ ${rating}
        </p>

        <button
          class="primary request-service"
          data-professional-id="${professional.id}"
          data-professional-name="${escapeHTML(name)}"
          data-profession="${escapeHTML(profession)}"
        >
          Request Service
        </button>

      </article>
    `;

  }).join("");

  attachRequestButtons();
}

// =========================================================
// SEARCH
// =========================================================

function filterProfessionals() {

  const query =
    input.value.toLowerCase().trim();

  const cards =
    document.querySelectorAll(".page-card");

  cards.forEach(card => {

    const text =
      card.textContent.toLowerCase();

    card.style.display =
      !query || text.includes(query)
        ? ""
        : "none";

  });
}

// =========================================================
// REQUEST BUTTONS
// =========================================================

function attachRequestButtons() {

  document
    .querySelectorAll(".request-service")
    .forEach(button => {

      button.addEventListener("click", () => {

        openBookingForm(
          button.dataset.professionalId,
          button.dataset.professionalName,
          button.dataset.profession
        );

      });

    });

}

// =========================================================
// BOOKING FORM
// =========================================================

function openBookingForm(
  professionalId,
  professionalName,
  profession
) {

  const existing =
    document.getElementById("bookingModal");

  if (existing) {
    existing.remove();
  }

  const modal =
    document.createElement("div");

  modal.id = "bookingModal";

  modal.innerHTML = `
    <div class="modal-backdrop">

      <div class="modal-card">

        <button
          type="button"
          class="modal-close"
          id="closeBookingModal"
        >
          ×
        </button>

        <span class="pill">BOOK A SERVICE</span>

        <h2>Request ${escapeHTML(profession)}</h2>

        <p>
          Request service from
          <strong>${escapeHTML(professionalName)}</strong>.
        </p>

        <form id="bookingForm">

          <label>
            Work-site address

            <input
              type="text"
              id="bookingLocation"
              required
              placeholder="Where should the professional come?"
            >
          </label>

          <label>
            Date

            <input
              type="date"
              id="bookingDate"
              required
            >
          </label>

          <label>
            Time

            <input
              type="time"
              id="bookingTime"
              required
            >
          </label>

          <label>
            Describe the job

            <textarea
              id="bookingDescription"
              rows="4"
              required
              placeholder="Tell the professional what you need help with..."
            ></textarea>
          </label>

          <button
            class="primary"
            type="submit"
            id="submitBooking"
          >
            Send Booking Request
          </button>

          <p id="bookingMessage"></p>

        </form>

      </div>

    </div>
  `;

  document.body.appendChild(modal);

  document
    .getElementById("closeBookingModal")
    .addEventListener("click", () => {
      modal.remove();
    });

  document
    .getElementById("bookingForm")
    .addEventListener("submit", async event => {

      event.preventDefault();

      await createBooking(
        professionalId,
        profession
      );

    });

}

// =========================================================
// CREATE BOOKING
// =========================================================

async function createBooking(
  professionalId,
  profession
) {

  const submitButton =
    document.getElementById("submitBooking");

  const message =
    document.getElementById("bookingMessage");

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  // -------------------------------------------------------
  // GET SIGNED-IN USER
  // -------------------------------------------------------

  const {
    data: sessionData,
    error: sessionError
  } = await supabaseClient.auth.getSession();

  if (
    sessionError ||
    !sessionData.session
  ) {

    message.textContent =
      "Please sign in to your customer account before requesting a service.";

    submitButton.disabled = false;
    submitButton.textContent =
      "Send Booking Request";

    return;
  }

  const userId =
    sessionData.session.user.id;

  // -------------------------------------------------------
  // GET PROFILE
  // -------------------------------------------------------

  const {
    data: profile,
    error: profileError
  } = await supabaseClient
    .from("profiles")
    .select("id, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (
    profileError ||
    !profile
  ) {

    console.error(profileError);

    message.textContent =
      "Your FixLink profile could not be found.";

    submitButton.disabled = false;
    submitButton.textContent =
      "Send Booking Request";

    return;
  }

  // -------------------------------------------------------
  // GET CUSTOMER
  // -------------------------------------------------------

  const {
    data: customer,
    error: customerError
  } = await supabaseClient
    .from("customers")
    .select("id")
    .eq("profile_id", profile.id)
    .maybeSingle();

  if (customerError) {

    console.error(customerError);

    message.textContent =
      "Unable to find your customer account.";

    submitButton.disabled = false;
    submitButton.textContent =
      "Send Booking Request";

    return;
  }

  if (!customer) {

    message.textContent =
      "You need a customer account before you can request a service.";

    submitButton.disabled = false;
    submitButton.textContent =
      "Send Booking Request";

    return;
  }

  // -------------------------------------------------------
  // GET FORM DATA
  // -------------------------------------------------------

  const location =
    document
      .getElementById("bookingLocation")
      .value
      .trim();

  const date =
    document
      .getElementById("bookingDate")
      .value;

  const time =
    document
      .getElementById("bookingTime")
      .value;

  const description =
    document
      .getElementById("bookingDescription")
      .value
      .trim();

  const scheduledAt =
    `${date}T${time}:00`;

  // -------------------------------------------------------
  // CREATE BOOKING
  // -------------------------------------------------------

  const {
    error: bookingError
  } = await supabaseClient
    .from("bookings")
    .insert({
      customer_id: customer.id,
      professional_id: professionalId,
      service: profession,
      description: description,
      location: location,
      status: "pending",
      scheduled_at: scheduledAt
    });

  if (bookingError) {

    console.error(
      "Booking creation error:",
      bookingError
    );

    message.textContent =
      "The booking could not be created. Please try again.";

    submitButton.disabled = false;
    submitButton.textContent =
      "Send Booking Request";

    return;
  }

  // -------------------------------------------------------
  // SUCCESS
  // -------------------------------------------------------

  message.textContent =
    "✓ Booking request sent successfully.";

  submitButton.textContent =
    "Booking Sent";

  setTimeout(() => {

    window.location.href =
      "bookings.html";

  }, 1000);

}

// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// =========================================================
// EVENTS
// =========================================================

input.addEventListener(
  "input",
  filterProfessionals
);

document
  .getElementById("searchForm")
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();
      filterProfessionals();

    }
  );

// =========================================================
// START
// =========================================================

loadProfessionals();