
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const toast = (message) => {
  const el = $("#toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove("show"), 3000);
};

const year = $("#year");
if (year) year.textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $("#menuToggle");
if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    $("#mainNav")?.classList.toggle("open");
  });
}

$$('#mainNav a').forEach(link => {
  link.addEventListener("click", () => $("#mainNav")?.classList.remove("open"));
});

// Modal controls
function openModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  $$(".modal-backdrop.open").forEach(item => item.classList.remove("open"));
  modal.classList.add("open");
  document.body.classList.add("modal-open");
}

function closeModals() {
  $$(".modal-backdrop").forEach(item => item.classList.remove("open"));
  document.body.classList.remove("modal-open");
}

$$("[data-open]").forEach(button => {
  button.addEventListener("click", () => openModal(button.dataset.open));
});

$$("[data-close]").forEach(button => {
  button.addEventListener("click", closeModals);
});

$$(".modal-backdrop").forEach(modal => {
  modal.addEventListener("click", event => {
    if (event.target === modal) closeModals();
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModals();
});

$$("[data-switch]").forEach(button => {
  button.addEventListener("click", () => openModal(button.dataset.switch));
});

// Show and hide passwords
$$("[data-password]").forEach(button => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.password);
    if (!input) return;

    const show = input.type === "password";
    input.type = show ? "text" : "password";
    button.textContent = show ? "Hide" : "Show";
  });
});

// Demo forms: do not save real customer data
$$(".demo-form").forEach(form => {
  form.addEventListener("submit", event => {
    event.preventDefault();

    const message = $(".form-message", form);
    if (message) {
      message.textContent =
        "Demo only: no account or loan application was created or submitted.";
      message.setAttribute("role", "status");
    }

    toast("Demo only — no information was sent or saved.");
    form.reset();

    $$(".show-password", form).forEach(button => {
      button.textContent = "Show";
    });

    $$('input[type="password"]', form).forEach(input => {
      input.type = "password";
    });
  });
});

// Loan enquiry modal
$$(".apply-btn").forEach(button => {
  button.addEventListener("click", () => {
    const loanType = $("#loanType");
    if (loanType) loanType.value = button.dataset.loan || "Loan option";
    openModal("applyModal");
  });
});

// Illustrative repayment estimator
const amount = $("#amount");
const feeRate = $("#feeRate");

function money(value) {
  return "MWK " + Math.round(value).toLocaleString("en-US");
}

function updateEstimate() {
  if (!amount || !feeRate) return;

  const principal = Number(amount.value);
  const fee = principal * Number(feeRate.value) / 100;

  $("#amountLabel").textContent = money(principal);
  $("#feeOut").textContent = money(fee);
  $("#totalOut").textContent = money(principal + fee);
}

if (amount) amount.addEventListener("input", updateEstimate);
if (feeRate) feeRate.addEventListener("change", updateEstimate);
updateEstimate();

// Contact form opens an email draft; it does not send data to a server.
const contactForm = $("#contactForm");

if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = data.get("name");
    const email = data.get("email");
    const message = data.get("message");

    const subject = encodeURIComponent(
      "FlexiLoan website enquiry from " + name
    );

    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    const status = $("#contactMessage");
    if (status) {
      status.textContent =
        "Your email app will open with a draft. The website has not sent or stored this enquiry.";
    }

    window.location.href =
      "mailto:hello@example.com?subject=" + subject + "&body=" + body;
  });
}