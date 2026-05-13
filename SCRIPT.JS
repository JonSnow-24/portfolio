// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    document.querySelector(link.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// Mobile navbar toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Section highlight in navbar
const sections = document.querySelectorAll("section");
const navItems = document.querySelectorAll(".nav-links a");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (pageYOffset >= sectionTop) current = section.getAttribute("id");
  });
  navItems.forEach(link => {
    link.classList.remove("active");
    if (current && link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});

// GSAP Animations

gsap.from("#hero .hero-title", { y: -50, opacity: 0, duration: 1 });
gsap.from("#hero .hero-sub", { y: 50, opacity: 0, duration: 1, delay: 0.4 });
gsap.from("#hero .hero-desc", { y: 50, opacity: 0, duration: 1, delay: 0.8 });
gsap.from("#hero .hero-buttons", { y: 50, opacity: 0, duration: 1, delay: 1.2 });

gsap.utils.toArray(".glass").forEach(section => {
  gsap.from(section, {
    y: 100,
    opacity: 0,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
    }
  });
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;

  document.getElementById("progress-bar").style.width = scrollPercent + "%";
});