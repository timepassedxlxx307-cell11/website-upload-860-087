(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var button = document.querySelector("[data-menu-toggle]");
        var nav = document.querySelector("[data-site-nav]");
        if (!button || !nav) {
            return;
        }
        button.addEventListener("click", function () {
            nav.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var previous = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        if (!slides.length) {
            return;
        }
        var current = 0;
        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }
        if (previous) {
            previous.addEventListener("click", function () {
                show(current - 1);
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(current + 1);
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
            });
        });
        window.setInterval(function () {
            show(current + 1);
        }, 5200);
    }

    function setupSearch() {
        var input = document.querySelector("[data-site-search]");
        var cards = Array.prototype.slice.call(document.querySelectorAll("[data-search-card]"));
        if (!input || !cards.length) {
            return;
        }
        var category = document.querySelector("[data-category-filter]");
        var year = document.querySelector("[data-year-filter]");
        var empty = document.querySelector("[data-empty-state]");
        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }
        function run() {
            var keyword = normalize(input.value);
            var categoryValue = normalize(category ? category.value : "");
            var yearValue = normalize(year ? year.value : "");
            var visible = 0;
            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute("data-title"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-category"),
                    card.getAttribute("data-tags")
                ].join(" "));
                var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchesCategory = !categoryValue || normalize(card.getAttribute("data-category")) === categoryValue;
                var matchesYear = !yearValue || normalize(card.getAttribute("data-year")) === yearValue;
                var showCard = matchesKeyword && matchesCategory && matchesYear;
                card.hidden = !showCard;
                if (showCard) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.hidden = visible !== 0;
            }
        }
        input.addEventListener("input", run);
        if (category) {
            category.addEventListener("change", run);
        }
        if (year) {
            year.addEventListener("change", run);
        }
    }

    window.SitePlayer = {
        mount: function (source) {
            var frame = document.querySelector("[data-player]");
            if (!frame) {
                return;
            }
            var video = frame.querySelector("video");
            var button = frame.querySelector("[data-play-button]");
            if (!video || !button || !source) {
                return;
            }
            var prepared = false;
            function prepare() {
                if (prepared) {
                    return;
                }
                prepared = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = source;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(source);
                    hls.attachMedia(video);
                    frame.hls = hls;
                } else {
                    video.src = source;
                }
            }
            function play() {
                prepare();
                button.classList.add("is-hidden");
                var action = video.play();
                if (action && action.catch) {
                    action.catch(function () {
                        button.classList.remove("is-hidden");
                    });
                }
            }
            button.addEventListener("click", play);
            video.addEventListener("play", function () {
                button.classList.add("is-hidden");
            });
            video.addEventListener("pause", function () {
                if (video.currentTime === 0 || video.ended) {
                    button.classList.remove("is-hidden");
                }
            });
        }
    };

    ready(function () {
        setupMenu();
        setupHero();
        setupSearch();
    });
}());
