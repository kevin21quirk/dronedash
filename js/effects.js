/* ==========================================================
   PSS Premium Effects: loader, cursor, smooth scroll,
   magnetic buttons, marquee, counters, parallax, text reveal
   ========================================================== */
(function () {
    'use strict';

    const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- 1. PAGE LOADER ---------- */
    function injectLoader() {
        if (document.getElementById('pssLoader')) return;
        const loader = document.createElement('div');
        loader.id = 'pssLoader';
        loader.className = 'pss-loader';
        loader.innerHTML = `
            <div class="pss-loader-inner">
                <svg class="pss-loader-drone" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <g>
                        <circle cx="40" cy="40" r="22" class="prop prop-tl"/>
                        <circle cx="160" cy="40" r="22" class="prop prop-tr"/>
                        <circle cx="40" cy="160" r="22" class="prop prop-bl"/>
                        <circle cx="160" cy="160" r="22" class="prop prop-br"/>
                        <line x1="55" y1="55" x2="100" y2="100" class="arm"/>
                        <line x1="145" y1="55" x2="100" y2="100" class="arm"/>
                        <line x1="55" y1="145" x2="100" y2="100" class="arm"/>
                        <line x1="145" y1="145" x2="100" y2="100" class="arm"/>
                        <rect x="80" y="80" width="40" height="40" rx="6" class="body"/>
                    </g>
                </svg>
                <div class="pss-loader-text">PRECISION SKY SOLUTIONS</div>
                <div class="pss-loader-bar"><span></span></div>
            </div>`;
        document.body.appendChild(loader);

        window.addEventListener('load', function () {
            setTimeout(function () {
                loader.classList.add('done');
                setTimeout(function () { loader.remove(); }, 800);
            }, 600);
        });
    }

    /* ---------- 2. CUSTOM CURSOR ---------- */
    function initCursor() {
        if (isTouch) return;
        const dot = document.createElement('div');
        const ring = document.createElement('div');
        dot.className = 'pss-cursor-dot';
        ring.className = 'pss-cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        let mx = 0, my = 0, rx = 0, ry = 0;
        document.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
        });
        function animate() {
            rx += (mx - rx) * 0.15;
            ry += (my - ry) * 0.15;
            ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
            requestAnimationFrame(animate);
        }
        animate();

        const hoverSel = 'a, button, .btn, .nav-link, .filter-btn, .mega-menu-item, .portfolio-card, input, select, textarea';
        document.addEventListener('mouseover', function (e) {
            if (e.target.closest(hoverSel)) ring.classList.add('hover');
        });
        document.addEventListener('mouseout', function (e) {
            if (e.target.closest(hoverSel)) ring.classList.remove('hover');
        });
        document.addEventListener('mousedown', function () { ring.classList.add('click'); });
        document.addEventListener('mouseup', function () { ring.classList.remove('click'); });
        document.addEventListener('mouseleave', function () {
            dot.style.opacity = 0; ring.style.opacity = 0;
        });
        document.addEventListener('mouseenter', function () {
            dot.style.opacity = 1; ring.style.opacity = 1;
        });
    }

    /* ---------- 3. SMOOTH SCROLL (Lenis) ---------- */
    function initSmoothScroll() {
        if (reduceMotion || typeof Lenis === 'undefined') return;
        const lenis = new Lenis({
            duration: 1.1,
            easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
            smoothWheel: true,
            smoothTouch: false
        });
        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
        window.lenis = lenis;
    }

    /* ---------- 4. MAGNETIC BUTTONS ---------- */
    function initMagnetic() {
        if (isTouch || reduceMotion) return;
        const targets = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-large, .modal-close, .filter-btn');
        targets.forEach(function (el) {
            el.addEventListener('mousemove', function (e) {
                const r = el.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
            });
            el.addEventListener('mouseleave', function () {
                el.style.transform = '';
            });
        });
    }

    /* ---------- 5. NUMBER COUNTERS ---------- */
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        if (!counters.length) return;
        const animate = function (el) {
            const target = parseInt(el.getAttribute('data-target'), 10);
            const duration = 1800;
            const start = performance.now();
            const startVal = 0;
            function tick(now) {
                const p = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.floor(startVal + (target - startVal) * eased).toLocaleString();
                if (p < 1) requestAnimationFrame(tick);
                else el.textContent = target.toLocaleString() + '+';
            }
            requestAnimationFrame(tick);
        };
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    animate(en.target);
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.4 });
        counters.forEach(function (c) { io.observe(c); });
    }

    /* ---------- 6. IMAGE PARALLAX ---------- */
    function initParallax() {
        if (reduceMotion) return;
        const items = document.querySelectorAll('[data-parallax], .service-detail-image img, .industry-detail-image-large img, .about-story-content + .cell img');
        if (!items.length) return;
        function update() {
            const vh = window.innerHeight;
            items.forEach(function (img) {
                const r = img.getBoundingClientRect();
                if (r.bottom < 0 || r.top > vh) return;
                const speed = parseFloat(img.dataset.parallaxSpeed || '0.15');
                const offset = (r.top + r.height / 2 - vh / 2) * -speed;
                img.style.transform = `translate3d(0, ${offset}px, 0) scale(1.08)`;
            });
        }
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update);
        update();
    }

    /* ---------- 7. CHARACTER-STAGGER TEXT REVEAL ---------- */
    function initTextReveal() {
        if (reduceMotion) return;
        const targets = document.querySelectorAll('.hero-title, .page-hero-title, .section-title, .cta-title');
        targets.forEach(function (el) {
            if (el.dataset.split) return;
            el.dataset.split = '1';
            const text = el.textContent;
            el.textContent = '';
            const words = text.split(/\s+/);
            words.forEach(function (word, wi) {
                const wSpan = document.createElement('span');
                wSpan.className = 'split-word';
                word.split('').forEach(function (ch, i) {
                    const c = document.createElement('span');
                    c.className = 'split-char';
                    c.style.transitionDelay = (i * 0.025 + wi * 0.05) + 's';
                    c.textContent = ch;
                    wSpan.appendChild(c);
                });
                el.appendChild(wSpan);
                if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
            });
        });

        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (en.isIntersecting) {
                    en.target.classList.add('split-in');
                    io.unobserve(en.target);
                }
            });
        }, { threshold: 0.2 });
        targets.forEach(function (t) { io.observe(t); });
    }

    /* ---------- 8. MARQUEE INJECTION ---------- */
    function injectMarquee() {
        if (document.querySelector('.pss-marquee')) return;
        const cta = document.querySelector('.cta-section');
        const stats = document.querySelector('.stats-section');
        const anchor = stats || cta;
        if (!anchor) return;
        const items = ['Aerial Cinematography', 'Precision Mapping', 'Cinematic Capture', 'CAA Certified', '4K / 6K RAW', 'Real Estate', 'Inspections', 'Events', 'Thermal Imaging', '24h Turnaround'];
        const repeat = 3;
        let inner = '';
        for (let r = 0; r < repeat; r++) {
            items.forEach(function (i) {
                inner += `<span class="pss-marquee-item">${i}</span><span class="pss-marquee-dot">✦</span>`;
            });
        }
        const wrap = document.createElement('section');
        wrap.className = 'pss-marquee';
        wrap.innerHTML = `<div class="pss-marquee-track">${inner}</div>`;
        anchor.parentNode.insertBefore(wrap, anchor);
    }

    /* ---------- INIT ---------- */
    document.addEventListener('DOMContentLoaded', function () {
        injectLoader();
        injectMarquee();
        initCursor();
        initSmoothScroll();
        initMagnetic();
        initCounters();
        initParallax();
        initTextReveal();
    });
})();
