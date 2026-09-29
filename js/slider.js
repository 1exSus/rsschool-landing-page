(function () {
  let root = document.querySelector("[data-carousel]");
  if (!root) return;

  let track = root.querySelector(".carousel__track");
  let slides = Array.prototype.slice.call(root.querySelectorAll(".carousel__slide"));
  let prev = root.querySelector("[data-carousel-prev]");
  let next = root.querySelector("[data-carousel-next]");
  let dotsWrap = root.querySelector("[data-carousel-dots]");
  let index = 0;

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

  function goTo(nextIndex) {
    let total = slides.length;
    let width = root.querySelector(".carousel__viewport").offsetWidth;
    index = (nextIndex + total) % total;
    slides.forEach(function (slide) {
      slide.style.flexBasis = width + "px";
      slide.style.maxWidth = width + "px";
    });
    track.style.transform = "translateX(" + -index * width + "px)";
    Array.prototype.forEach.call(dotsWrap.children, function (dot, i) {
      dot.classList.toggle("is-active", i === index);
    });
  }

  prev.addEventListener("click", function () {
    goTo(index - 1);
  });

  next.addEventListener("click", function () {
    goTo(index + 1);
  });

  window.addEventListener("resize", function () {
    goTo(index);
  });

  goTo(0);
})();
