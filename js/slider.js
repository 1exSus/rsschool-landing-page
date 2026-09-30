(function () {
  let root = document.querySelector("[data-carousel]");

  if (!root) return;

  let track = root.querySelector(".carousel__track");
  let slides = Array.prototype.slice.call(
      root.querySelectorAll(".carousel__slide")
  );
  let prev = root.querySelector("[data-carousel-prev]");
  let next = root.querySelector("[data-carousel-next]");
  let dotsWrap = root.querySelector("[data-carousel-dots]");

  let index = 0;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;
  let hasMoved = false;

  let autoplayTimer = null;
  let isHovered = false;
  let autoplayDelay = 5000;

  slides.forEach(function (_, i) {
    let dot = document.createElement("button");

    dot.type = "button";
    dot.className = "carousel__dot";
    dot.setAttribute("aria-label", "Слайд " + (i + 1));

    dot.addEventListener("click", function () {
      goTo(i);
    });

    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
      dot.classList.toggle("is-active", i === index);
    });
  }

  function setPosition(offset, animated) {
    track.style.transition = animated
        ? "transform 0.45s ease"
        : "none";

    track.style.transform =
        "translate3d(calc(" +
        -index * 100 +
        "% + " +
        offset +
        "px), 0, 0)";
  }

  function goTo(nextIndex) {
    let total = slides.length;

    index = (nextIndex + total) % total;

    setPosition(0, true);
    updateDots();

    restartAutoplay();
  }

  function startAutoplay() {
    if (isHovered) return;

    stopAutoplay();

    autoplayTimer = setInterval(function () {
      goTo(index + 1);
    }, autoplayDelay);
  }

  function stopAutoplay() {
    if (autoplayTimer !== null) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function restartAutoplay() {
    stopAutoplay();

    if (!isHovered) {
      startAutoplay();
    }
  }

  prev.addEventListener("click", function () {
    goTo(index - 1);
  });

  next.addEventListener("click", function () {
    goTo(index + 1);
  });

  root.addEventListener("pointerdown", function (event) {
    if (event.target.closest("a, button")) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    isDragging = true;
    hasMoved = false;
    startX = event.clientX;
    currentX = event.clientX;

    stopAutoplay();

    track.style.transition = "none";

    root.setPointerCapture(event.pointerId);
  });

  root.addEventListener("pointermove", function (event) {
    if (!isDragging) return;

    currentX = event.clientX;

    let delta = currentX - startX;

    if (Math.abs(delta) > 5) {
      hasMoved = true;
    }

    if (hasMoved) {
      setPosition(delta, false);
    }
  });

  function finishDrag() {
    if (!isDragging) return;

    let delta = currentX - startX;

    isDragging = false;

    if (Math.abs(delta) >= 40) {
      if (delta < 0) {
        goTo(index + 1);
      } else {
        goTo(index - 1);
      }
    } else {
      goTo(index);
    }
  }

  root.addEventListener("pointerup", finishDrag);
  root.addEventListener("pointercancel", finishDrag);

  root.addEventListener("lostpointercapture", function () {
    if (isDragging) {
      finishDrag();
    }
  });

  root.addEventListener("mouseenter", function () {
    isHovered = true;
    stopAutoplay();
  });

  root.addEventListener("mouseleave", function () {
    isHovered = false;
    startAutoplay();
  });

  root.addEventListener("wheel", function (event) {
    if (Math.abs(event.deltaY) < 10 && Math.abs(event.deltaX) < 10) {
      return;
    }

    event.preventDefault();

    if (event.deltaY > 0 || event.deltaX > 0) {
      goTo(index + 1);
    } else {
      goTo(index - 1);
    }
  }, { passive: false });

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      goTo(index - 1);
    }

    if (event.key === "ArrowRight") {
      goTo(index + 1);
    }
  });

  window.addEventListener("resize", function () {
    setPosition(0, false);
  });

  goTo(0);
})();