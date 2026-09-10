// ======================================================
// ⭐ PREMIUM ANIMATED STAR BACKGROUND
// ======================================================

const canvas = document.getElementById("starCanvas");

if (canvas) {
  const ctx = canvas.getContext("2d");

  let stars = [];

  const mouse = {
    x: null,
    y: null
  };

  // Number of stars
  function getStarCount() {
    if (window.innerWidth < 600) {
      return 180;
    }

    if (window.innerWidth < 1000) {
      return 280;
    }

    return 400;
  }

  // High quality canvas
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createStars();
  }

  // Create stars
  function createStars() {
    stars = [];

    const count = getStarCount();

    for (let i = 0; i < count; i++) {

      stars.push({

        x: Math.random() * window.innerWidth,

        y: Math.random() * window.innerHeight,

        // 85% tiny stars
        // 15% bigger stars
        size:
          Math.random() < 0.85
            ? Math.random() * 1.0 + 0.5
            : Math.random() * 2.5 + 1.5,

        // Slow random movement
        speedX: (Math.random() - 0.5) * 0.20,

        speedY: (Math.random() - 0.5) * 0.20,

        // Brightness
        opacity: Math.random() * 0.65 + 0.25,

        // Twinkle
        twinkle: Math.random() * 0.02 + 0.005,

        twinkleDirection:
          Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  // Draw and animate stars
  function drawStars() {

    ctx.clearRect(
      0,
      0,
      window.innerWidth,
      window.innerHeight
    );

    stars.forEach(star => {

      // ------------------------------
      // Normal movement
      // ------------------------------

      star.x += star.speedX;
      star.y += star.speedY;


      // ------------------------------
      // Screen wrap
      // ------------------------------

      if (star.x < -5) {
        star.x = window.innerWidth + 5;
      }

      if (star.x > window.innerWidth + 5) {
        star.x = -5;
      }

      if (star.y < -5) {
        star.y = window.innerHeight + 5;
      }

      if (star.y > window.innerHeight + 5) {
        star.y = -5;
      }


      // ------------------------------
      // Twinkle effect
      // ------------------------------

      star.opacity +=
        star.twinkle *
        star.twinkleDirection;

      if (
        star.opacity >= 0.9 ||
        star.opacity <= 0.2
      ) {
        star.twinkleDirection *= -1;
      }


      // ------------------------------
      // Mouse repel
      // ------------------------------

      if (
        mouse.x !== null &&
        mouse.y !== null
      ) {

        const dx = star.x - mouse.x;
        const dy = star.y - mouse.y;

        const distance =
          Math.sqrt(dx * dx + dy * dy);

        const repelDistance = 120;


        if (
          distance < repelDistance &&
          distance > 0
        ) {

          const force =
            (repelDistance - distance) /
            repelDistance;


          // Fast reaction
          star.x +=
            (dx / distance) *
            force *
            3.5;

          star.y +=
            (dy / distance) *
            force *
            3.5;
        }
      }


      // ------------------------------
      // Premium glow
      // ------------------------------

      if (star.size > 1.4) {

        ctx.shadowBlur = 10;

        ctx.shadowColor =
          "rgba(255,255,255,0.8)";

      } else {

        ctx.shadowBlur = 0;
      }


      // ------------------------------
      // Draw star
      // ------------------------------

      ctx.beginPath();

      ctx.arc(
        star.x,
        star.y,
        star.size,
        0,
        Math.PI * 2
      );

      ctx.fillStyle =
        `rgba(255,255,255,${star.opacity})`;

      ctx.fill();
    });


    // Reset glow
    ctx.shadowBlur = 0;


    // Continue animation
    requestAnimationFrame(drawStars);
  }


  // ======================================================
  // MOUSE
  // ======================================================

  window.addEventListener("mousemove", e => {

    mouse.x = e.clientX;
    mouse.y = e.clientY;

  });


  window.addEventListener("mouseleave", () => {

    mouse.x = null;
    mouse.y = null;

  });


  // ======================================================
  // TOUCH SUPPORT
  // ======================================================

  window.addEventListener(
    "touchmove",
    e => {

      if (e.touches.length > 0) {

        mouse.x =
          e.touches[0].clientX;

        mouse.y =
          e.touches[0].clientY;
      }

    },
    { passive: true }
  );


  window.addEventListener(
    "touchend",
    () => {

      mouse.x = null;
      mouse.y = null;

    }
  );


  // Resize
  window.addEventListener(
    "resize",
    resizeCanvas
  );


  // Start
  resizeCanvas();

  drawStars();
}


// ======================================================
// SMOOTH SCROLL
// ======================================================

document
  .querySelectorAll('a[href^="#"]')
  .forEach(link => {

    link.addEventListener("click", e => {

      e.preventDefault();

      const target =
        document.querySelector(
          link.getAttribute("href")
        );

      if (target) {

        target.scrollIntoView({
          behavior: "smooth"
        });

      }

    });

  });


// ======================================================
// MOBILE NAVBAR
// ======================================================

const menuToggle =
  document.querySelector(".menu-toggle");

const navLinks =
  document.querySelector(".nav-links");


if (menuToggle) {

  menuToggle.addEventListener(
    "click",
    () => {

      navLinks.classList.toggle("active");

    }
  );

}


// ======================================================
// SECTION HIGHLIGHT
// ======================================================

const sections =
  document.querySelectorAll("section");

const navItems =
  document.querySelectorAll(
    ".nav-links a"
  );


window.addEventListener(
  "scroll",
  () => {

    let current = "";

    sections.forEach(section => {

      const sectionTop =
        section.offsetTop - 100;

      if (
        window.pageYOffset >=
        sectionTop
      ) {

        current =
          section.getAttribute("id");

      }

    });


    navItems.forEach(link => {

      link.classList.remove("active");

      if (
        current &&
        link
          .getAttribute("href")
          .includes(current)
      ) {

        link.classList.add("active");

      }

    });

  }
);


// ======================================================
// GSAP ANIMATIONS
// ======================================================

gsap.from(
  "#hero .hero-title",
  {
    y: -50,
    opacity: 0,
    duration: 1
  }
);


gsap.from(
  "#hero .hero-sub",
  {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.4
  }
);


gsap.from(
  "#hero .hero-desc",
  {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.8
  }
);


gsap.from(
  "#hero .hero-buttons",
  {
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 1.2
  }
);


gsap.utils
  .toArray(".glass")
  .forEach(section => {

    gsap.from(section, {

      y: 100,

      opacity: 0,

      duration: 1,

      scrollTrigger: {

        trigger: section,

        start: "top 80%"
      }

    });

  });


gsap.utils
  .toArray(".section-title")
  .forEach(title => {

    const glass =
      title.nextElementSibling;

    gsap.from(title, {

      y: 100,

      opacity: 0,

      duration: 1,

      scrollTrigger: {

        trigger:
          glass || title,

        start: "top 80%"
      }

    });

  });


gsap.utils
  .toArray(".filter-btns")
  .forEach(filterBar => {

    const glass =
      filterBar.nextElementSibling;

    gsap.from(filterBar, {

      y: 100,

      opacity: 0,

      duration: 1,

      scrollTrigger: {

        trigger:
          glass || filterBar,

        start: "top 80%"
      }

    });

  });


// ======================================================
// PROGRESS BAR
// ======================================================

window.addEventListener(
  "scroll",
  () => {

    const scrollTop =
      window.scrollY;

    const docHeight =
      document.body.scrollHeight -
      window.innerHeight;

    const scrollPercent =
      docHeight > 0
        ? (scrollTop / docHeight) * 100
        : 0;

    const progressBar =
      document.getElementById(
        "progress-bar"
      );

    if (progressBar) {

      progressBar.style.width =
        scrollPercent + "%";

    }

  }
);


// ======================================================
// CUSTOM CURSOR
// ======================================================

const cursor =
  document.querySelector(".cursor");

const cursorDot =
  document.querySelector(".cursor-dot");


document.addEventListener(
  "mousemove",
  e => {

    if (!cursor || !cursorDot)
      return;

    cursor.style.left =
      e.clientX + "px";

    cursor.style.top =
      e.clientY + "px";

    cursorDot.style.left =
      e.clientX + "px";

    cursorDot.style.top =
      e.clientY + "px";

  }
);


document
  .querySelectorAll("a, button")
  .forEach(el => {

    el.addEventListener(
      "mouseenter",
      () => {

        if (cursor) {
          cursor.classList.add(
            "hover"
          );
        }

      }
    );


    el.addEventListener(
      "mouseleave",
      () => {

        if (cursor) {
          cursor.classList.remove(
            "hover"
          );
        }

      }
    );

  });


document.addEventListener(
  "mousedown",
  () => {

    if (cursor) {

      cursor.style.transform =
        "translate(-50%, -50%) scale(0.75)";

    }

  }
);


document.addEventListener(
  "mouseup",
  () => {

    if (cursor) {

      cursor.style.transform =
        "translate(-50%, -50%) scale(1)";

    }

  }
);


// ======================================================
// PAGE LOADER
// ======================================================

window.addEventListener(
  "load",
  () => {

    setTimeout(() => {

      const loader =
        document.getElementById(
          "loader"
        );

      if (loader) {

        loader.classList.add(
          "hidden"
        );

      }

    }, 1800);

  }
);


// ======================================================
// SCROLL TO TOP
// ======================================================

const scrollTopBtn =
  document.getElementById(
    "scroll-top"
  );


window.addEventListener(
  "scroll",
  () => {

    if (!scrollTopBtn)
      return;

    if (window.scrollY > 300) {

      scrollTopBtn.classList.add(
        "visible"
      );

    } else {

      scrollTopBtn.classList.remove(
        "visible"
      );

    }

  }
);


if (scrollTopBtn) {

  scrollTopBtn.addEventListener(
    "click",
    () => {

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );

}


// ======================================================
// TOAST NOTIFICATION
// ======================================================

function showToast(msg) {

  const toast =
    document.getElementById(
      "toast"
    );

  const toastMessage =
    document.getElementById(
      "toast-message"
    );


  if (!toast || !toastMessage)
    return;


  toastMessage.textContent =
    msg;

  toast.classList.add("show");


  setTimeout(() => {

    toast.classList.remove(
      "show"
    );

  }, 3500);

}


const contactForm =
  document.querySelector(
    ".contact-form"
  );


if (contactForm) {

  contactForm.addEventListener(
    "submit",
    e => {

      e.preventDefault();

      showToast(
        "Message sent successfully! 🎉"
      );

      contactForm.reset();

    }
  );

}


// ======================================================
// PROJECT FILTER
// ======================================================

const filterBtns =
  document.querySelectorAll(
    ".filter-btn"
  );

const yearGroups =
  document.querySelectorAll(
    ".year-group"
  );


filterBtns.forEach(btn => {

  btn.addEventListener(
    "click",
    () => {

      filterBtns.forEach(b =>
        b.classList.remove(
          "active"
        )
      );


      btn.classList.add(
        "active"
      );


      const filter =
        btn.dataset.filter;


      yearGroups.forEach(group => {

        if (
          filter === "all" ||
          group.dataset.year === filter
        ) {

          group.style.display =
            "block";

        } else {

          group.style.display =
            "none";

        }

      });

    }
  );

});