(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
      menuButton.textContent = mobileMenu.classList.contains('open') ? '×' : '☰';
    });
  }

  document.querySelectorAll('img').forEach(function (image) {
    image.addEventListener('error', function () {
      image.style.display = 'none';
      var poster = image.closest('.poster, .ranking-poster, .mini-thumb');
      if (poster) {
        poster.classList.add('image-missing');
      }
    }, { once: true });
  });

  document.querySelectorAll('[data-hero]').forEach(function (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function show(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, idx) {
        slide.classList.toggle('active', idx === current);
      });
      dots.forEach(function (dot, idx) {
        dot.classList.toggle('active', idx === current);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(current + 1);
      }, 5000);
    }

    dots.forEach(function (dot, idx) {
      dot.addEventListener('click', function () {
        show(idx);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        show(current - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(current + 1);
        restart();
      });
    }

    show(0);
    restart();
  });

  document.querySelectorAll('[data-movie-filter]').forEach(function (filter) {
    var input = filter.querySelector('[data-filter-input]');
    var chips = Array.prototype.slice.call(filter.querySelectorAll('[data-filter-chip]'));
    var scope = filter.closest('main') || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var empty = scope.querySelector('[data-empty-state]');
    var activeChip = '全部';

    function valueOf(card) {
      return [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-year') || '',
        card.getAttribute('data-category') || '',
        card.getAttribute('data-type') || '',
        card.getAttribute('data-genre') || '',
        card.getAttribute('data-tags') || ''
      ].join(' ').toLowerCase();
    }

    function apply() {
      var query = input ? input.value.trim().toLowerCase() : '';
      var visible = 0;

      cards.forEach(function (card) {
        var text = valueOf(card);
        var typeMatch = activeChip === '全部' || text.indexOf(activeChip.toLowerCase()) !== -1;
        var queryMatch = !query || text.indexOf(query) !== -1;
        var show = typeMatch && queryMatch;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeChip = chip.getAttribute('data-filter-chip') || '全部';
        chips.forEach(function (item) {
          item.classList.toggle('active', item === chip);
        });
        apply();
      });
    });

    if (chips[0]) {
      chips[0].classList.add('active');
    }

    if (input) {
      input.addEventListener('input', apply);
    }
  });

  document.querySelectorAll('[data-global-search]').forEach(function (box) {
    var input = box.querySelector('[data-global-search-input]');
    var results = box.querySelector('[data-global-search-results]');
    var data = window.SiteSearchIndex || [];

    function render(items) {
      if (!results) {
        return;
      }

      if (!items.length) {
        results.innerHTML = '';
        results.classList.remove('open');
        return;
      }

      results.innerHTML = items.slice(0, 12).map(function (item) {
        return '<a class="search-result-item" href="' + item.url + '">' +
          '<strong>' + item.title + '</strong>' +
          '<span>' + item.year + ' · ' + item.category + ' · ' + item.genre + '</span>' +
          '</a>';
      }).join('');
      results.classList.add('open');
    }

    if (input) {
      input.addEventListener('input', function () {
        var query = input.value.trim().toLowerCase();
        if (query.length < 1) {
          render([]);
          return;
        }
        var matched = data.filter(function (item) {
          return item.search.indexOf(query) !== -1;
        });
        render(matched);
      });

      document.addEventListener('click', function (event) {
        if (!box.contains(event.target)) {
          render([]);
        }
      });
    }
  });

  document.querySelectorAll('[data-player]').forEach(function (player) {
    var video = player.querySelector('video');
    var button = player.querySelector('[data-play-button]');

    if (!video) {
      return;
    }

    var source = video.getAttribute('data-stream');
    var ready = false;

    function prepare() {
      if (ready || !source) {
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
        ready = true;
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        ready = true;
      } else {
        video.src = source;
        ready = true;
      }
    }

    function play() {
      prepare();
      if (button) {
        button.classList.add('hidden');
      }
      var attempt = video.play();
      if (attempt && typeof attempt.catch === 'function') {
        attempt.catch(function () {
          if (button) {
            button.classList.remove('hidden');
          }
        });
      }
    }

    if (button) {
      button.addEventListener('click', play);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      }
    });

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('hidden');
      }
    });
  });
})();
