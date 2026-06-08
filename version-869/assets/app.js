(function () {
    var nav = document.querySelector(".site-nav");
    var toggle = document.querySelector(".nav-toggle");
    var links = document.querySelector(".nav-links");

    function refreshNav() {
        if (!nav) {
            return;
        }
        if (window.scrollY > 20) {
            nav.classList.add("is-scrolled");
        } else {
            nav.classList.remove("is-scrolled");
        }
    }

    refreshNav();
    window.addEventListener("scroll", refreshNav, { passive: true });

    if (toggle && links) {
        toggle.addEventListener("click", function () {
            var opened = links.classList.toggle("is-open");
            document.body.classList.toggle("menu-open", opened);
            toggle.setAttribute("aria-expanded", opened ? "true" : "false");
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var prev = document.querySelector(".hero-prev");
    var next = document.querySelector(".hero-next");
    var active = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle("is-active", i === active);
            slide.setAttribute("aria-hidden", i === active ? "false" : "true");
        });
        dots.forEach(function (dot, i) {
            dot.classList.toggle("is-active", i === active);
        });
    }

    function startSlides() {
        if (timer) {
            window.clearInterval(timer);
        }
        if (slides.length > 1) {
            timer = window.setInterval(function () {
                showSlide(active + 1);
            }, 5200);
        }
    }

    if (slides.length) {
        showSlide(0);
        startSlides();
        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(active - 1);
                startSlides();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                showSlide(active + 1);
                startSlides();
            });
        }
        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                showSlide(index);
                startSlides();
            });
        });
    }

    function normalize(text) {
        return String(text || "").toLowerCase().trim();
    }

    function setupFilter(panel) {
        var scopeSelector = panel.getAttribute("data-target") || ".movie-card";
        var cards = Array.prototype.slice.call(document.querySelectorAll(scopeSelector));
        var input = panel.querySelector(".movie-search");
        var selects = Array.prototype.slice.call(panel.querySelectorAll(".filter-select"));
        var empty = document.querySelector(panel.getAttribute("data-empty") || ".empty-result");

        function applyFilter() {
            var query = normalize(input ? input.value : "");
            var shown = 0;
            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-genre"),
                    card.getAttribute("data-tags"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-type")
                ].join(" "));
                var visible = !query || text.indexOf(query) !== -1;
                selects.forEach(function (select) {
                    var field = select.getAttribute("data-filter");
                    var value = normalize(select.value);
                    if (value && normalize(card.getAttribute("data-" + field)) !== value) {
                        visible = false;
                    }
                });
                card.style.display = visible ? "" : "none";
                if (visible) {
                    shown += 1;
                }
            });
            if (empty) {
                empty.classList.toggle("is-visible", shown === 0);
            }
        }

        if (input) {
            input.addEventListener("input", applyFilter);
            var params = new URLSearchParams(window.location.search);
            var q = params.get("q");
            if (q && !input.value) {
                input.value = q;
            }
        }
        selects.forEach(function (select) {
            select.addEventListener("change", applyFilter);
        });
        applyFilter();
    }

    Array.prototype.slice.call(document.querySelectorAll(".movie-filter")).forEach(setupFilter);
})();
