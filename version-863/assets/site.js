(function () {
  function setupMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var nav = document.querySelector("[data-mobile-nav]");
    if (!button || !nav) {
      return;
    }
    button.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function setupHero() {
    var root = document.querySelector("[data-hero-slider]");
    if (!root) {
      return;
    }
    var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(root.querySelectorAll("[data-slide-to]"));
    if (slides.length < 2) {
      return;
    }
    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-slide-to")) || 0);
        start();
      });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    start();
  }

  function setupFilters() {
    var roots = Array.prototype.slice.call(document.querySelectorAll("[data-filter-root]"));
    roots.forEach(function (root) {
      var input = root.querySelector("[data-search-input]");
      var chips = Array.prototype.slice.call(root.querySelectorAll("[data-filter-chip]"));
      var cards = Array.prototype.slice.call(root.querySelectorAll(".movie-card"));
      var active = "";

      function normalize(value) {
        return String(value || "").toLowerCase().replace(/\s+/g, "");
      }

      function apply() {
        var query = normalize(input ? input.value : "");
        cards.forEach(function (card) {
          var haystack = normalize(card.getAttribute("data-filter-text"));
          var category = card.getAttribute("data-category") || "";
          var queryMatch = !query || haystack.indexOf(query) !== -1;
          var categoryMatch = !active || category === active;
          card.classList.toggle("is-hidden", !(queryMatch && categoryMatch));
        });
      }

      if (input) {
        input.addEventListener("input", apply);
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (query) {
          input.value = query;
        }
      }

      chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
          active = chip.getAttribute("data-filter-chip") || "";
          chips.forEach(function (item) {
            item.classList.toggle("active", item === chip);
          });
          apply();
        });
      });

      apply();
    });
  }

  function setupImages() {
    var images = Array.prototype.slice.call(document.querySelectorAll(".cover-img"));
    images.forEach(function (image) {
      image.addEventListener("error", function () {
        image.classList.add("is-missing");
      });
    });
  }

  setupMenu();
  setupHero();
  setupFilters();
  setupImages();
})();
