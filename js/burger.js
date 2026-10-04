(function () {
  let burger = document.querySelector(".burger");
  let nav = document.querySelector(".nav");
  if (!burger || !nav) return;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function closeMenu() {
    burger.classList.remove("is-open");
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
    if (!document.querySelector(".modal.is-open")) {
      document.body.classList.remove("is-locked");
    }
  }

  function openMenu() {
    burger.classList.add("is-open");
    nav.classList.add("is-open");
    burger.setAttribute("aria-expanded", "true");
    burger.setAttribute("aria-label", "Закрыть меню");
    document.body.classList.add("is-locked");
  }

  burger.addEventListener("click", function () {
    if (nav.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && nav.classList.contains("is-open") && !document.querySelector(".modal.is-open")) {
      closeMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (!isMobile()) {
      closeMenu();
    }
  });
})();
