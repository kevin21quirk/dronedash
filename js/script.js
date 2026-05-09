$(document).ready(function() {
    $(document).foundation();

    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Hero video rotation with HLS.js
    const video1 = document.getElementById('heroVideo1');
    const video2 = document.getElementById('heroVideo2');
    let currentVideo = 1;

    // Initialize HLS for video 1 (only if video element exists)
    if (video1 && typeof Hls !== 'undefined') {
        if (Hls.isSupported()) {
            const hls1 = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls1.loadSource(video1.getAttribute('data-hls'));
            hls1.attachMedia(video1);
            hls1.on(Hls.Events.MANIFEST_PARSED, function() {
                video1.play().catch(e => console.log('Video 1 autoplay prevented:', e));
            });
        } else if (video1.canPlayType('application/vnd.apple.mpegurl')) {
            video1.src = video1.getAttribute('data-hls');
            video1.play().catch(e => console.log('Video 1 autoplay prevented:', e));
        }
    }

    // Initialize HLS for video 2 (only if video element exists)
    if (video2 && typeof Hls !== 'undefined') {
        if (Hls.isSupported()) {
            const hls2 = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls2.loadSource(video2.getAttribute('data-hls'));
            hls2.attachMedia(video2);
        } else if (video2.canPlayType('application/vnd.apple.mpegurl')) {
            video2.src = video2.getAttribute('data-hls');
        }
    }

    function switchVideo() {
        if (!video1 || !video2) return;
        if (currentVideo === 1) {
            video1.classList.remove('active');
            video2.classList.add('active');
            video2.play();
            currentVideo = 2;
        } else {
            video2.classList.remove('active');
            video1.classList.add('active');
            video1.play();
            currentVideo = 1;
        }
    }

    // Switch videos every 8 seconds (only if both videos exist)
    if (video1 && video2) {
        setInterval(switchVideo, 8000);
    }

    $('.btn-contact, #getQuoteBtn').click(function(e) {
        if ($(this).hasClass('btn-contact') || $(this).attr('id') === 'getQuoteBtn') {
            e.preventDefault();
            
            const droneElement = $('<div class="drone-flying"><svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><g fill="#3672cc"><circle cx="80" cy="80" r="35" fill="#5a9fd4" opacity="0.6"/><circle cx="320" cy="80" r="35" fill="#5a9fd4" opacity="0.6"/><circle cx="80" cy="220" r="35" fill="#5a9fd4" opacity="0.6"/><circle cx="320" cy="220" r="35" fill="#5a9fd4" opacity="0.6"/><rect x="70" y="70" width="20" height="20" rx="3" fill="#2a5ba8"/><rect x="310" y="70" width="20" height="20" rx="3" fill="#2a5ba8"/><rect x="70" y="210" width="20" height="20" rx="3" fill="#2a5ba8"/><rect x="310" y="210" width="20" height="20" rx="3" fill="#2a5ba8"/><line x1="95" y1="80" x2="160" y2="120" stroke="#3672cc" stroke-width="10" stroke-linecap="round"/><line x1="305" y1="80" x2="240" y2="120" stroke="#3672cc" stroke-width="10" stroke-linecap="round"/><line x1="95" y1="220" x2="160" y2="180" stroke="#3672cc" stroke-width="10" stroke-linecap="round"/><line x1="305" y1="220" x2="240" y2="180" stroke="#3672cc" stroke-width="10" stroke-linecap="round"/><ellipse cx="200" cy="150" rx="60" ry="40" fill="#2a5ba8"/><rect x="170" y="130" width="60" height="40" rx="8" fill="#3672cc"/><circle cx="200" cy="165" r="18" fill="#1a1a1a"/><circle cx="200" cy="165" r="12" fill="#4a4a4a"/><polygon points="180,190 220,190 210,210 190,210" fill="#5a9fd4"/><polygon points="185,210 215,210 210,220 190,220" fill="#3672cc"/><rect x="190" y="120" width="20" height="8" rx="2" fill="#ff4444"/></g></svg></div>');
            $('body').append(droneElement);
            
            setTimeout(function() {
                droneElement.remove();
            }, 3500);
            
            $('#quoteModal').addClass('active');
            $('body').css('overflow', 'hidden');
            initModalVideo();
        }
    });

    const MUX_PLAYBACK_ID = 'maver7qtAkM1D851kcQFFmj01BcWGYFlrIB8tlSDLHRA';
    let modalHls = null;

    function initModalVideo() {
        const overlay = document.querySelector('#quoteModal .modal-overlay');
        if (!overlay) return;
        let video = overlay.querySelector('.modal-bg-video');
        if (!video) {
            video = document.createElement('video');
            video.className = 'modal-bg-video';
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.autoplay = true;
            overlay.insertBefore(video, overlay.firstChild);
        }
        const src = `https://stream.mux.com/${MUX_PLAYBACK_ID}.m3u8`;
        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            if (modalHls) { modalHls.destroy(); modalHls = null; }
            modalHls = new Hls();
            modalHls.loadSource(src);
            modalHls.attachMedia(video);
            modalHls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play().catch(function(){});
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.play().catch(function(){});
        }
    }

    function destroyModalVideo() {
        if (modalHls) { modalHls.destroy(); modalHls = null; }
        const video = document.querySelector('#quoteModal .modal-bg-video');
        if (video) { try { video.pause(); } catch(e){} video.remove(); }
    }

    $('#closeModal').click(function(e) {
        $('#quoteModal').removeClass('active');
        $('body').css('overflow', 'auto');
        destroyModalVideo();
    });

    $('.quote-modal .modal-overlay').click(function(e) {
        if (e.target === this) {
            $('#quoteModal').removeClass('active');
            $('body').css('overflow', 'auto');
            destroyModalVideo();
        }
    });

    $('select').on('change', function() {
        if ($(this).val() !== '') {
            $(this).addClass('has-value');
        } else {
            $(this).removeClass('has-value');
        }
    });

    $('#quoteForm').submit(function(e) {
        e.preventDefault();
        
        $('#quoteModal').removeClass('active');
        
        setTimeout(function() {
            $('#thankYouModal').addClass('active');
        }, 300);
        
        $('#quoteForm')[0].reset();
        $('select').removeClass('has-value');
    });

    $('#closeThankYou, #closeThankYouBtn').click(function(e) {
        $('#thankYouModal').removeClass('active');
        $('body').css('overflow', 'auto');
    });

    $('.thank-you-modal .modal-overlay').click(function(e) {
        if (e.target === this) {
            $('#thankYouModal').removeClass('active');
            $('body').css('overflow', 'auto');
        }
    });

    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            $('.quote-modal, .thank-you-modal, .info-modal').removeClass('active');
            $('body').css('overflow', 'auto');
        }
    });

    // Info popup modal for mega menu items without dedicated sections
    $(document).on('click', '.info-popup-trigger', function(e) {
        e.preventDefault();
        const $trigger = $(this);
        const icon = $trigger.data('icon') || 'fas fa-info-circle';
        const title = $trigger.data('title') || 'More Info';
        const content = $trigger.data('content') || '';
        $('#infoModalIcon').attr('class', icon + ' info-modal-icon');
        $('#infoModalTitle').text(title);
        $('#infoModalText').text(content);
        $('#infoModal').addClass('active');
        $('body').css('overflow', 'hidden');
    });

    $('#closeInfoModal, #infoModalClose2').click(function() {
        $('#infoModal').removeClass('active');
        $('body').css('overflow', 'auto');
    });

    $('.info-modal .modal-overlay').click(function(e) {
        if (e.target === this) {
            $('#infoModal').removeClass('active');
            $('body').css('overflow', 'auto');
        }
    });

    // Portfolio: apply filter from URL query parameter on load
    if (window.location.pathname.indexOf('portfolio') !== -1) {
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        if (filterParam) {
            setTimeout(function() {
                const $btn = $('.filter-btn[data-filter="' + filterParam + '"]');
                if ($btn.length) {
                    $btn.trigger('click');
                    $('html, body').animate({
                        scrollTop: $('.portfolio-filter-section').offset().top - 100
                    }, 600);
                }
            }, 300);
        }
    }

    const nav = $('#mainNav');
    const navToggle = $('#navToggle');
    const navMenu = $('#navMenu');
    
    $(window).scroll(function() {
        if ($(window).scrollTop() > 100) {
            nav.addClass('scrolled');
        } else {
            nav.removeClass('scrolled');
        }
    });

    navToggle.click(function() {
        $(this).toggleClass('active');
        navMenu.toggleClass('active');
        
        const spans = $(this).find('span');
        if ($(this).hasClass('active')) {
            spans.eq(0).css('transform', 'rotate(45deg) translateY(8px)');
            spans.eq(1).css('opacity', '0');
            spans.eq(2).css('transform', 'rotate(-45deg) translateY(-8px)');
        } else {
            spans.css({
                'transform': 'none',
                'opacity': '1'
            });
        }
    });

    $('.nav-link').click(function(e) {
        const href = $(this).attr('href');
        
        if (href && href.startsWith('#') && href.length > 1) {
            e.preventDefault();
            const target = $(href);
            
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - 80
                }, 800);
                
                navMenu.removeClass('active');
                navToggle.removeClass('active');
                navToggle.find('span').css({
                    'transform': 'none',
                    'opacity': '1'
                });
            }
        }
    });

    $(window).scroll(function() {
        const scrollPos = $(window).scrollTop() + 100;
        
        $('.nav-link').each(function() {
            const href = $(this).attr('href');
            if (href && href.startsWith('#') && href.length > 1) {
                const target = $(href);
                if (target.length) {
                    if (target.offset().top <= scrollPos && target.offset().top + target.outerHeight() > scrollPos) {
                        $('.nav-link').removeClass('active');
                        $(this).addClass('active');
                    }
                }
            }
        });
    });

    const statNumbers = $('.stat-number');
    let statsAnimated = false;

    function animateStats() {
        statNumbers.each(function() {
            const $this = $(this);
            const target = parseInt($this.data('target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(function() {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                $this.text(Math.floor(current) + '+');
            }, 16);
        });
    }

    function checkStats() {
        if (!statsAnimated) {
            const statsSection = $('.stats-section');
            if (statsSection.length) {
                const statsTop = statsSection.offset().top;
                const windowBottom = $(window).scrollTop() + $(window).height();
                
                // Trigger when stats section is 50% visible
                if (windowBottom > statsTop + (statsSection.outerHeight() / 2)) {
                    animateStats();
                    statsAnimated = true;
                }
            }
        }
    }

    $(window).scroll(checkStats);
    
    // Check on page load and after a delay
    $(window).on('load', function() {
        setTimeout(checkStats, 100);
        setTimeout(checkStats, 1000);
    });
    
    // Also check after DOM is ready
    setTimeout(checkStats, 100);

    $('.portfolio-item').hover(
        function() {
            $(this).css('z-index', '10');
        },
        function() {
            $(this).css('z-index', '1');
        }
    );

    $('#contactForm').submit(function(e) {
        e.preventDefault();
        
        $('#thankYouModal').addClass('active');
        $('body').css('overflow', 'hidden');
        
        this.reset();
    });

    $('.newsletter-form').submit(function(e) {
        e.preventDefault();
        const email = $(this).find('input[type="email"]').val();
        alert('Thank you for subscribing! We will keep you updated.');
        this.reset();
    });

    // Navigation stays visible at all times (removed hide-on-scroll behavior)

    $('.service-item, .portfolio-item, .industry-block').each(function(index) {
        $(this).css('animation-delay', (index * 0.1) + 's');
    });

    const heroVideo = $('.hero-video');
    if (heroVideo.length) {
        heroVideo[0].playbackRate = 0.8;
    }

    $(window).on('load', function() {
        $('body').addClass('loaded');
    });

    const parallaxElements = $('.hero-content, .about-image');
    $(window).scroll(function() {
        const scrolled = $(window).scrollTop();
        parallaxElements.each(function() {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            $(this).css('transform', 'translateY(' + yPos + 'px)');
        });
    });

    $('.service-link, .btn').on('mouseenter', function(e) {
        const x = e.pageX - $(this).offset().left;
        const y = e.pageY - $(this).offset().top;
        
        $(this).append('<span class="ripple"></span>');
        $('.ripple').css({
            top: y + 'px',
            left: x + 'px'
        }).addClass('animate');
        
        setTimeout(() => {
            $('.ripple').remove();
        }, 600);
    });

    if ($(window).width() > 768) {
        $('.industry-block').each(function(index) {
            $(this).hover(
                function() {
                    $(this).siblings().css('filter', 'grayscale(50%) brightness(0.7)');
                },
                function() {
                    $(this).siblings().css('filter', 'none');
                }
            );
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-item, .portfolio-item, .industry-block').forEach(el => {
        observer.observe(el);
    });

    $('.filter-btn').click(function() {
        const filter = $(this).data('filter');
        
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        
        if (filter === 'all') {
            $('.portfolio-card').fadeIn(400);
        } else {
            $('.portfolio-card').each(function() {
                if ($(this).data('category') === filter) {
                    $(this).fadeIn(400);
                } else {
                    $(this).fadeOut(400);
                }
            });
        }
    });

    const stickyElements = document.querySelectorAll('.sticky-element');
    
    function updateStickyElements() {
        stickyElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const parentRect = element.parentElement.getBoundingClientRect();
            
            if (rect.top <= 120 && parentRect.bottom > window.innerHeight / 2) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    $(window).scroll(updateStickyElements);
    updateStickyElements();

    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        const sections = document.querySelectorAll('section');
        
        sections.forEach((section, index) => {
            if (index > 0) {
                const prevSection = sections[index - 1];
                const sectionObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.transform = 'translateY(0)';
                            entry.target.style.opacity = '1';
                        }
                    });
                }, {
                    threshold: 0.1,
                    rootMargin: '-50px'
                });
                
                sectionObserver.observe(section);
            }
        });
    }

    // Chatbot functionality (only on home page)
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
        const chatbotWidget = document.getElementById('chatbotWidget');
        const chatbotToggle = document.getElementById('chatbotToggle');
        const chatbotMinimize = document.getElementById('chatbotMinimize');
        const chatbotInput = document.getElementById('chatbotInput');
        const chatbotSend = document.getElementById('chatbotSend');
        const chatbotMessages = document.getElementById('chatbotMessages');
        const logo = document.querySelector('.logo');
        const logoImage = document.querySelector('.logo-image');
        
        // Exit if chatbot elements don't exist
        if (!chatbotWidget || !chatbotToggle || !chatbotMinimize || !chatbotInput || !chatbotSend || !chatbotMessages) {
            return;
        }
        
        let chatbotShown = false;

        // Show chatbot when scrolling down
        $(window).scroll(function() {
            const scrollTop = $(window).scrollTop();
            
            if (scrollTop > 200 && !chatbotShown) {
                // Show chatbot
                chatbotWidget.classList.add('visible');
                chatbotShown = true;
            } else if (scrollTop <= 200 && chatbotShown) {
                // Hide chatbot when scrolling back to top
                chatbotWidget.classList.remove('visible');
                chatbotWidget.classList.remove('open');
                chatbotShown = false;
            }
        });

        // Toggle chatbot window
        chatbotToggle.addEventListener('click', () => {
            chatbotWidget.classList.toggle('open');
        });

        // Minimize chatbot
        chatbotMinimize.addEventListener('click', () => {
            chatbotWidget.classList.remove('open');
        });

        // Send message
        function sendMessage() {
            const message = chatbotInput.value.trim();
            if (message === '') return;

            // Add user message
            const userMessageHTML = `
                <div class="chatbot-message user-message">
                    <div class="message-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="message-content">
                        <p>${message}</p>
                    </div>
                </div>
            `;
            chatbotMessages.insertAdjacentHTML('beforeend', userMessageHTML);
            chatbotInput.value = '';

            // Scroll to bottom
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

            // Simulate bot response
            setTimeout(() => {
                const botResponse = getBotResponse(message);
                const botMessageHTML = `
                    <div class="chatbot-message bot-message">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <p>${botResponse}</p>
                        </div>
                    </div>
                `;
                chatbotMessages.insertAdjacentHTML('beforeend', botMessageHTML);
                chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            }, 800);
        }

        // Simple bot response logic
        function getBotResponse(message) {
            const lowerMessage = message.toLowerCase();
            
            if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('quote')) {
                return "Our pricing varies based on project scope and requirements. Click 'Get a Quote' to receive a personalized estimate, or visit our Contact page to discuss your specific needs!";
            } else if (lowerMessage.includes('service') || lowerMessage.includes('what do you')) {
                return "We offer Commercial Real Estate photography, Wedding & Event coverage, Construction Inspection, Cinematic Production, and 3D Mapping & Surveying. Check out our Services page for more details!";
            } else if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('call')) {
                return "You can reach us through our Contact page, or call us directly. We typically respond within 24 hours!";
            } else if (lowerMessage.includes('portfolio') || lowerMessage.includes('work') || lowerMessage.includes('example')) {
                return "Check out our Portfolio page to see examples of our aerial photography and videography work across various industries!";
            } else if (lowerMessage.includes('certified') || lowerMessage.includes('license') || lowerMessage.includes('legal')) {
                return "Yes! We are fully FAA Part 107 certified and insured. Safety and compliance are our top priorities.";
            } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
                return "Hello! How can I help you learn more about our drone services today?";
            } else {
                return "That's a great question! For detailed information, please visit our Contact page or request a quote. Our team will be happy to assist you!";
            }
        }

        // Event listeners
        chatbotSend.addEventListener('click', sendMessage);
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});
