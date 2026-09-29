(function () {
  let cardsRoot = document.querySelector("[data-cards]");
  let loadMore = document.querySelector("[data-load-more]");
  let tabs = document.querySelectorAll("[data-category]");
  let modal = document.querySelector("[data-modal]");
  if (!cardsRoot || !loadMore || !modal) return;

  let projects = [];
  let category = "frontend";
  let visibleCount = 0;
  let selected = null;
  let difficulty = "medium";
  let duration = "sprint";

  function pageSize() {
    return window.innerWidth <= 768 ? 4 : 6;
  }

  function filtered() {
    return projects.filter(function (item) {
      return item.category === category;
    });
  }

  function renderCards() {
    let items = filtered();
    cardsRoot.innerHTML = "";
    items.slice(0, visibleCount).forEach(function (item) {
      let card = document.createElement("button");
      card.type = "button";
      card.className = "card";
      card.innerHTML =
        '<img src="' +
        item.image +
        '" alt="Обложка проекта ' +
        item.name +
        '" width="640" height="400" />' +
        '<span class="card__body">' +
        '<span class="card__tag">' +
        item.tag +
        "</span>" +
        "<span class=\"card__title\">" +
        item.name +
        "</span>" +
        '<span class="muted">' +
        item.short +
        "</span>" +
        "</span>";
      card.addEventListener("click", function () {
        openModal(item);
      });
      cardsRoot.appendChild(card);
    });

    let hasMore = visibleCount < items.length;
    loadMore.hidden = !hasMore;
  }

  function setCategory(next) {
    category = next;
    visibleCount = pageSize();
    tabs.forEach(function (tab) {
      tab.classList.toggle("is-active", tab.getAttribute("data-category") === category);
    });
    renderCards();
  }

  function updateModalInfo() {
    if (!selected) return;
    let diff = selected.difficulty[difficulty];
    let dur = selected.duration[duration];
    let hours = diff.hours + dur.hoursAdd;
    document.querySelector("[data-modal-hours]").textContent = hours + " ч";
    document.querySelector("[data-modal-inside]").textContent = diff.inside + " " + dur.inside;
    document.querySelectorAll("[data-param='difficulty'] .chip").forEach(function (chip) {
      chip.classList.toggle("is-active", chip.getAttribute("data-value") === difficulty);
    });
    document.querySelectorAll("[data-param='duration'] .chip").forEach(function (chip) {
      chip.classList.toggle("is-active", chip.getAttribute("data-value") === duration);
    });
  }

  function lockScroll() {
    document.body.classList.add("is-locked");
  }

  function unlockScroll() {
    if (!document.querySelector(".nav.is-open")) {
      document.body.classList.remove("is-locked");
    }
  }

  function openModal(item) {
    selected = item;
    difficulty = item.defaults.difficulty;
    duration = item.defaults.duration;
    document.querySelector("[data-modal-image]").src = item.image;
    document.querySelector("[data-modal-image]").alt = "Обложка проекта " + item.name;
    document.querySelector("[data-modal-tag]").textContent = item.tag;
    document.querySelector("[data-modal-title]").textContent = item.name;
    document.querySelector("[data-modal-text]").textContent = item.description;
    document.querySelector("[data-modal-link]").href = item.link;
    updateModalInfo();
    modal.classList.add("is-open");
    lockScroll();
  }

  function closeModal() {
    modal.classList.remove("is-open");
    selected = null;
    unlockScroll();
  }

  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setCategory(tab.getAttribute("data-category"));
    });
  });

  loadMore.addEventListener("click", function () {
    visibleCount = filtered().length;
    renderCards();
  });

  document.querySelectorAll("[data-param] .chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      let group = chip.parentElement.getAttribute("data-param");
      if (group === "difficulty") difficulty = chip.getAttribute("data-value");
      if (group === "duration") duration = chip.getAttribute("data-value");
      updateModalInfo();
    });
  });

  document.querySelector("[data-modal-close]").addEventListener("click", closeModal);
  document.querySelector("[data-modal-overlay]").addEventListener("click", closeModal);
  modal.querySelector(".modal__dialog").addEventListener("click", function (event) {
    event.stopPropagation();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  window.addEventListener("resize", function () {
    let items = filtered();
    let size = pageSize();
    let expanded = visibleCount >= items.length;
    visibleCount = expanded ? items.length : size;
    renderCards();
  });

  fetch("data/projects.json")
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      projects = data;
      setCategory("frontend");
    });
})();
