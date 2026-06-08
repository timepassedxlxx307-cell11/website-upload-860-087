(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");
    });
  }

  var hero = document.querySelector("[data-hero]");

  if (hero) {
    var slides = Array.prototype.slice.call(
      hero.querySelectorAll("[data-hero-slide]"),
    );
    var dots = Array.prototype.slice.call(
      hero.querySelectorAll("[data-hero-dot]"),
    );
    var active = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      active = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === active);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === active);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }
  }

  var searchInput = document.querySelector("[data-search-input]");
  var regionFilter = document.querySelector("[data-region-filter]");
  var yearFilter = document.querySelector("[data-year-filter]");
  var cards = Array.prototype.slice.call(
    document.querySelectorAll("[data-search-card]"),
  );

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase();
  }

  function filterCards() {
    var query = normalize(searchInput ? searchInput.value : "");
    var region = normalize(regionFilter ? regionFilter.value : "");
    var year = normalize(yearFilter ? yearFilter.value : "");

    cards.forEach(function (card) {
      var text = normalize(card.getAttribute("data-search-text"));
      var cardRegion = normalize(card.getAttribute("data-region"));
      var cardYear = normalize(card.getAttribute("data-year"));
      var matched = true;

      if (query && text.indexOf(query) === -1) {
        matched = false;
      }

      if (region && cardRegion !== region) {
        matched = false;
      }

      if (year && cardYear !== year) {
        matched = false;
      }

      card.hidden = !matched;
    });
  }

  if (searchInput && cards.length) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get("q");

    if (q) {
      searchInput.value = q;
    }

    searchInput.addEventListener("input", filterCards);

    if (regionFilter) {
      regionFilter.addEventListener("change", filterCards);
    }

    if (yearFilter) {
      yearFilter.addEventListener("change", filterCards);
    }

    filterCards();
  }
})();
