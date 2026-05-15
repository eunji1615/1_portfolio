const root = document.documentElement;
const hero = document.querySelector(".hero-section");
const revealTargets = document.querySelectorAll("[data-reveal]");
const parallaxTargets = document.querySelectorAll("[data-parallax]");
const navLinks = document.querySelectorAll(".section-nav a");
const sections = [...document.querySelectorAll("main section[id]")];
let ticking = false;

if (hero) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    root.style.setProperty("--pointer-x", `${x}%`);
    root.style.setProperty("--pointer-y", `${y}%`);
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18 }
);

revealTargets.forEach((target) => revealObserver.observe(target));

parallaxTargets.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -5;
    const ry = ((x / rect.width) - 0.5) * 6;
    card.style.setProperty("--rotate-x", `${rx.toFixed(2)}deg`);
    card.style.setProperty("--rotate-y", `${ry.toFixed(2)}deg`);
    card.style.setProperty("--glow-x", `${(x / rect.width) * 100}%`);
    card.style.setProperty("--glow-y", `${(y / rect.height) * 100}%`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.setProperty("--glow-x", "50%");
    card.style.setProperty("--glow-y", "50%");
  });
});

const activateLink = () => {
  const viewportMiddle = window.scrollY + window.innerHeight * 0.45;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const active = viewportMiddle >= top && viewportMiddle < bottom;

    navLinks.forEach((link) => {
      link.classList.toggle(
        "is-active",
        active && link.getAttribute("href") === `#${section.id}`
      );
    });
  });
};

const updateScrollMotion = () => {
  const viewportHeight = window.innerHeight;

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    const start = viewportHeight;
    const end = -rect.height;
    const progress = (start - rect.top) / (start - end);
    const clamped = Math.max(0, Math.min(1, progress));
    const centered = (clamped - 0.5) * 2;

    section.style.setProperty("--section-progress", clamped.toFixed(4));
    section.style.setProperty("--section-shift", centered.toFixed(4));
  });

  activateLink();
  ticking = false;
};

const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(updateScrollMotion);
    ticking = true;
  }
};

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("resize", handleScroll);
window.addEventListener("load", updateScrollMotion);

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetId = link.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});
