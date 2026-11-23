/* ============================================================
   EDIT THESE TWO THINGS TO MAKE THE SITE HERS
   ============================================================ */

// 1. WhatsApp number in international format, digits only (Nigeria example: 2348012345678)
const WHATSAPP_NUMBER = "2348165352116";

// 2. Her work. To add a piece, copy one line and change it.
//    img: path to a photo, e.g. "images/gown-1.jpg". Leave "" to show a colour placeholder.
//    category: "women", "baby" or "native"
const works = [
  { title: "Native gown", category: "women", img: "images/talior1.jpeg", tone: ["#c2407a", "#3a1030"], ratio: "4/5" },
  { title: "Baby girl christening gown", category: "baby", img: "", tone: ["#fbe3ee", "#e7b9d2"], ratio: "4/5" },
  { title: "Ankara peplum top and skirt", category: "women", img: "images/talior2.jpeg", tone: ["#c49a3c", "#7a4a12"], ratio: "4/5" },
  { title: "Birthday frock, age 2", category: "baby", img: "", tone: ["#cfa9e6", "#8f5fb8"], ratio: "4/5" },
  { title: "Lace corporate dress", category: "women", img: "images/talior3.jpeg", tone: ["#5a2a4e", "#2a1626"], ratio: "4/5" },
  { title: "Iro and buba set", category: "women", img: "images/talior4.jpeg", tone: ["#e08a5b", "#a2492a"], ratio: "4/5" },
  { title: "desgin gown", category: "women", img: "images/talior5.jpeg", tone: ["#f3b6cf", "#c987b5"], ratio: "4/5" },
  { title: "Mother and daughter set", category: "baby", img: "", tone: ["#7fb7a4", "#2f6f5c"], ratio: "4/5" },
  { title: "George wrapper and blouse", category: "women", img: "images/talior9.jpeg", tone: ["#6b3fa0", "#2e1352"], ratio: "4/5" }
];

/* ============================================================ */

const dressIcon = `<svg viewBox="0 0 64 64" fill="none" stroke="#fff" stroke-width="2.5" stroke-linejoin="round" aria-hidden="true"><path d="M24 6l8 6 8-6 4 12-6 6 10 34H16l10-34-6-6z"/></svg>`;

const grid = document.getElementById("grid");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
const labels = { women: "Women", baby: "Baby girls", native: "Native wear" };

function picMarkup(w) {
  const bg = `linear-gradient(160deg, ${w.tone[0]}, ${w.tone[1]})`;
  const inner = w.img
    ? `<img src="${w.img}" alt="${w.title}" loading="lazy" onerror="this.remove()">`
    : "";
  return { bg, inner: inner + (w.img ? "" : dressIcon) };
}

function render(filter = "all") {
  grid.innerHTML = "";
  works.forEach((w, i) => {
    if (filter !== "all" && w.category !== filter) return;
    const { bg, inner } = picMarkup(w);
    const card = document.createElement("button");
    card.className = "card";
    card.type = "button";
    card.setAttribute("aria-label", "View " + w.title);
    card.innerHTML = `
      <div class="pic" style="aspect-ratio:${w.ratio};background:${bg}">${inner}</div>
      <div class="cap"><strong>${w.title}</strong><small>${labels[w.category]}</small></div>`;
    card.addEventListener("click", () => openLightbox(i));
    grid.appendChild(card);
  });
}

function openLightbox(i) {
  const w = works[i];
  const { bg, inner } = picMarkup(w);
  lbImg.style.background = bg;
  lbImg.innerHTML = inner;
  lbCap.textContent = w.title;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightbox.querySelector(".lb-close").focus();
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
}

document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    render(chip.dataset.filter);
  });
});

lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.getElementById("lbOrder").addEventListener("click", closeLightbox);
document.addEventListener("keydown", e => { if (e.key === "Escape" && !lightbox.hidden) closeLightbox(); });

// mobile menu
const menuBtn = document.querySelector(".menu-btn");
const menu = document.getElementById("menu");
menuBtn.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  menu.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}));

// order form sends a pre-written WhatsApp message
document.getElementById("orderForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const lines = [
    `Hello, my name is ${f.get("name")}.`,
    `I would like to order: ${f.get("type")}.`,
    f.get("date") ? `I need it by ${f.get("date")}.` : "",
    f.get("details") ? `Details: ${f.get("details")}` : ""
  ].filter(Boolean).join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines)}`, "_blank", "noopener");
});

document.getElementById("year").textContent = new Date().getFullYear();
render();
