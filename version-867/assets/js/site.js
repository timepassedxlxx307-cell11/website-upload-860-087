(function() {
  var menuButton = document.querySelector(".mobile-menu-button");
  var mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function() {
      var opened = mobileNav.hasAttribute("hidden");
      if (opened) {
        mobileNav.removeAttribute("hidden");
        menuButton.setAttribute("aria-expanded", "true");
        menuButton.textContent = "×";
      } else {
        mobileNav.setAttribute("hidden", "");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
      }
    });
  }

  var hero = document.querySelector("[data-hero]");
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var next = hero.querySelector("[data-next-slide]");
    var prev = hero.querySelector("[data-prev-slide]");
    var index = 0;
    var timer = null;

    function show(target) {
      if (!slides.length) {
        return;
      }
      index = (target + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === index);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function() {
        show(index + 1);
      }, 5000);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    if (next) {
      next.addEventListener("click", function() {
        show(index + 1);
        start();
      });
    }

    if (prev) {
      prev.addEventListener("click", function() {
        show(index - 1);
        start();
      });
    }

    dots.forEach(function(dot) {
      dot.addEventListener("click", function() {
        show(Number(dot.getAttribute("data-go-slide")) || 0);
        start();
      });
    });

    hero.addEventListener("mouseenter", stop);
    hero.addEventListener("mouseleave", start);
    show(0);
    start();
  }

  var searchInput = document.getElementById("movie-search-input");
  var resultText = document.getElementById("search-result-text");
  var resultRoot = document.getElementById("search-results");

  if (searchInput && resultRoot) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    var cards = Array.prototype.slice.call(resultRoot.querySelectorAll(".movie-card"));

    function filter(query) {
      var normalized = query.trim().toLowerCase();
      var count = 0;
      cards.forEach(function(card) {
        var haystack = [
          card.getAttribute("data-title"),
          card.getAttribute("data-tags"),
          card.getAttribute("data-genre"),
          card.textContent
        ].join(" ").toLowerCase();
        var visible = !normalized || haystack.indexOf(normalized) !== -1;
        card.style.display = visible ? "" : "none";
        if (visible) {
          count += 1;
        }
      });
      if (resultText) {
        resultText.textContent = normalized ? "已筛选出 " + count + " 个相关结果" : "按关键词筛选影片";
      }
    }

    searchInput.value = initialQuery;
    filter(initialQuery);
    searchInput.addEventListener("input", function() {
      filter(searchInput.value);
    });
  }
}());
