(function () {
  var header = document.querySelector('.site-header');
  var menuButton = document.querySelector('.mobile-menu-button');

  if (header && menuButton) {
    menuButton.addEventListener('click', function () {
      var open = header.classList.toggle('menu-open');
      menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    }

    function nextSlide() {
      showSlide(current + 1);
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(nextSlide, 5000);
    }

    var nextButton = hero.querySelector('[data-hero-next]');
    var prevButton = hero.querySelector('[data-hero-prev]');

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        nextSlide();
        restart();
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        showSlide(current - 1);
        restart();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        restart();
      });
    });

    restart();
  }

  var filterRoot = document.querySelector('[data-card-filter]');

  if (filterRoot) {
    var input = filterRoot.querySelector('[data-filter-input]');
    var chips = Array.prototype.slice.call(filterRoot.querySelectorAll('[data-filter-type]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card-list] .movie-card'));
    var empty = document.querySelector('[data-empty-state]');
    var activeType = 'all';

    function applyFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var visible = 0;

      cards.forEach(function (card) {
        var searchText = card.getAttribute('data-search') || '';
        var cardType = card.getAttribute('data-type') || '';
        var matchedText = !keyword || searchText.indexOf(keyword) !== -1;
        var matchedType = activeType === 'all' || cardType === activeType;
        var show = matchedText && matchedType;
        card.style.display = show ? '' : 'none';
        if (show) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (item) {
          item.classList.remove('is-active');
        });
        chip.classList.add('is-active');
        activeType = chip.getAttribute('data-filter-type') || 'all';
        applyFilter();
      });
    });
  }

  var searchForm = document.querySelector('[data-global-search-form]');
  var searchInput = document.querySelector('[data-global-search-input]');
  var searchResults = document.querySelector('[data-search-results]');
  var searchTitle = document.querySelector('[data-search-title]');
  var searchEmpty = document.querySelector('[data-search-empty]');

  if (searchForm && searchInput && searchResults && window.SEARCH_MOVIES) {
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get('q') || '';
    searchInput.value = initialQuery;

    function cardTemplate(movie) {
      var tags = movie.tags.slice(0, 3).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');

      return '<article class="movie-card">' +
        '<a class="poster-link" href="' + movie.url + '" aria-label="观看' + escapeHtml(movie.title) + '">' +
        '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
        '<span class="play-dot">▶</span>' +
        '</a>' +
        '<div class="movie-card-body">' +
        '<div class="movie-meta"><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.type) + '</span></div>' +
        '<h3><a href="' + movie.url + '">' + escapeHtml(movie.title) + '</a></h3>' +
        '<p>' + escapeHtml(movie.oneLine) + '</p>' +
        '<div class="tag-row">' + tags + '</div>' +
        '</div>' +
        '</article>';
    }

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>"']/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[char];
      });
    }

    function renderSearch(query) {
      var keyword = String(query || '').trim().toLowerCase();
      var pool = window.SEARCH_MOVIES;
      var results = keyword ? pool.filter(function (movie) {
        return movie.search.indexOf(keyword) !== -1;
      }) : pool.slice(0, 24);

      searchResults.innerHTML = results.slice(0, 120).map(cardTemplate).join('');
      if (searchTitle) {
        searchTitle.textContent = keyword ? '搜索结果：' + query : '热门搜索';
      }
      if (searchEmpty) {
        searchEmpty.classList.toggle('is-visible', results.length === 0);
      }
    }

    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var value = searchInput.value.trim();
      var url = value ? './search.html?q=' + encodeURIComponent(value) : './search.html';
      window.history.replaceState(null, '', url);
      renderSearch(value);
    });

    renderSearch(initialQuery);
  }
}());
