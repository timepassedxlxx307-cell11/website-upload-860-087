(function () {
    function onReady(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
            return;
        }
        callback();
    }

    function initMenu() {
        var button = document.querySelector("[data-menu-button]");
        var menu = document.querySelector("[data-mobile-menu]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function initHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle("is-active", i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle("is-active", i === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5000);
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(index - 1);
                restart();
            });
        }
        if (next) {
            next.addEventListener("click", function () {
                show(index + 1);
                restart();
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                restart();
            });
        });
        restart();
    }

    function initFiltering() {
        var list = document.querySelector("[data-filter-list]");
        var search = document.querySelector("#movieSearch");
        var type = document.querySelector("#filterType");
        var year = document.querySelector("#filterYear");
        if (!list || !search) {
            return;
        }
        var params = new URLSearchParams(window.location.search);
        var initial = params.get("q");
        if (initial) {
            search.value = initial;
        }
        var cards = Array.prototype.slice.call(list.querySelectorAll("[data-card]"));

        function normalize(value) {
            return String(value || "").trim().toLowerCase();
        }

        function apply() {
            var keyword = normalize(search.value);
            var typeValue = type ? normalize(type.value) : "";
            var yearValue = year ? normalize(year.value) : "";
            cards.forEach(function (card) {
                var meta = normalize(card.getAttribute("data-meta"));
                var cardType = normalize(card.getAttribute("data-kind"));
                var cardYear = normalize(card.getAttribute("data-year"));
                var matched = true;
                if (keyword && meta.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (typeValue && cardType !== typeValue) {
                    matched = false;
                }
                if (yearValue && cardYear !== yearValue) {
                    matched = false;
                }
                card.classList.toggle("is-hidden", !matched);
            });
        }

        search.addEventListener("input", apply);
        if (type) {
            type.addEventListener("change", apply);
        }
        if (year) {
            year.addEventListener("change", apply);
        }
        apply();
    }

    function initPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
        players.forEach(function (shell) {
            var video = shell.querySelector("video");
            var button = shell.querySelector(".video-start");
            var playlist = shell.getAttribute("data-play");
            if (!video || !playlist) {
                return;
            }

            function start() {
                if (video.dataset.ready !== "1") {
                    video.dataset.ready = "1";
                    if (video.canPlayType("application/vnd.apple.mpegurl")) {
                        video.src = playlist;
                    } else if (window.Hls && window.Hls.isSupported()) {
                        var hls = new window.Hls({
                            enableWorker: true,
                            lowLatencyMode: true
                        });
                        hls.loadSource(playlist);
                        hls.attachMedia(video);
                        video._hls = hls;
                    } else {
                        video.src = playlist;
                    }
                }
                shell.classList.add("is-playing");
                var playResult = video.play();
                if (playResult && typeof playResult.catch === "function") {
                    playResult.catch(function () {});
                }
            }

            if (button) {
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    start();
                });
            }
            shell.addEventListener("click", function (event) {
                if (event.target === video && video.dataset.ready === "1") {
                    return;
                }
                start();
            });
            video.addEventListener("play", function () {
                shell.classList.add("is-playing");
            });
        });
    }

    onReady(function () {
        initMenu();
        initHero();
        initFiltering();
        initPlayers();
    });
})();
