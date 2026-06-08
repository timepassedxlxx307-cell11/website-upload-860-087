(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // mobile nav
  const menuToggle = $('[data-menu-toggle]');
  const nav = $('[data-nav]');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => nav.classList.toggle('is-open'));
  }

  // hero slider
  const hero = $('[data-hero-carousel]');
  if (hero) {
    const slides = $$('[data-hero-slide]', hero);
    const dotsHost = $('[data-hero-dots]', hero);
    const prevBtn = $('[data-hero-prev]', hero);
    const nextBtn = $('[data-hero-next]', hero);
    let index = slides.findIndex(s => s.classList.contains('is-active'));
    if (index < 0) index = 0;
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.className = 'hero-dot' + (i === index ? ' active' : '');
      b.type = 'button';
      b.addEventListener('click', () => show(i));
      dotsHost && dotsHost.appendChild(b);
      return b;
    });
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach((s, i) => s.classList.toggle('is-active', i === index));
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
    }
    prevBtn && prevBtn.addEventListener('click', () => show(index - 1));
    nextBtn && nextBtn.addEventListener('click', () => show(index + 1));
    setInterval(() => show(index + 1), 5000);
  }

  // search page
  const searchForm = $('#global-search-form');
  const searchInput = $('#search-input');
  const resultBox = $('#search-results');
  const statsBox = $('#search-stats');
  if (searchForm && searchInput && resultBox) {
    const params = new URLSearchParams(location.search);
    const initial = (params.get('q') || '').trim();
    searchInput.value = initial;
    fetch('assets/movies-index.json').then(r => r.json()).then(data => {
      function card(item) {
        return `
          <article class="card">
            <a class="card-poster" href="movie/movie-${item.id}.html"><img src="assets/posters/${item.poster}" alt="${item.title}"></a>
            <div class="card-body">
              <div class="meta-row"><span class="pill">${item.type}</span><span class="muted">${item.region} · ${item.year}</span></div>
              <h3><a href="movie/movie-${item.id}.html">${item.title}</a></h3>
              <p>${item.oneLine || item.summary}</p>
              <div class="chip-row">${(item.tags || []).slice(0,3).map(t => `<span class="chip">${t}</span>`).join('')}</div>
            </div>
          </article>`;
      }
      function run(q) {
        q = (q || '').trim().toLowerCase();
        const result = !q ? data.slice(0, 40) : data.filter(it => {
          const hay = [it.title, it.type, it.region, it.genre, it.year, ...(it.tags || []), it.oneLine, it.summary].join(' ').toLowerCase();
          return hay.includes(q);
        });
        resultBox.innerHTML = result.slice(0, 120).map(card).join('') || '<div class="text-block">没有找到匹配的影片，请换个关键词。</div>';
        statsBox.textContent = q ? `找到 ${result.length} 条结果` : `展示 ${result.length} 条热门结果`;
      }
      run(initial);
      searchForm.addEventListener('submit', e => { e.preventDefault(); run(searchInput.value); const url = new URL(location.href); url.searchParams.set('q', searchInput.value); history.replaceState({}, '', url); });
      searchInput.addEventListener('input', () => { if (searchInput.value.trim().length >= 2) run(searchInput.value); });
    }).catch(() => {
      resultBox.innerHTML = '<div class="text-block">搜索数据加载失败。</div>';
    });
  }
})();