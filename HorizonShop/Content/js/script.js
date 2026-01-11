document.addEventListener('DOMContentLoaded', function() {


    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    if (slides.length > 0 && dots.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const showSlide = (index) => {
            // Mevcut aktif sınıfları temizle
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            
            // Yeni slaytı aktif yap
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        };

        const nextSlide = () => {
            let nextIndex = (currentSlide + 1) % slides.length;
            showSlide(nextIndex);
        };

        // Otomatik geçişi başlat (5 saniyede bir)
        const startSlideShow = () => { 
            slideInterval = setInterval(nextSlide, 5000); 
        };

        const stopSlideShow = () => { 
            clearInterval(slideInterval); 
        };

        // Noktalara tıklayınca geçiş yap
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopSlideShow();
                showSlide(index);
                startSlideShow();
            });
        });

        // Başlat
        startSlideShow();
    }


    const dropdowns = document.querySelectorAll('.js-dropdown');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.js-dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation(); // Tıklamanın yukarı taşmasını engelle

                // Bu menüyü aç/kapat
                dropdown.classList.toggle('topbar-dropdown--opened');

                // Diğer açık olan menüleri kapat
                dropdowns.forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('topbar-dropdown--opened');
                    }
                });
            });
        }
    });


    const cartIndicator = document.querySelector('.indicator--trigger--click');
    
    if (cartIndicator) {
        const cartLink = cartIndicator.querySelector('.indicator-link');
        
        if (cartLink) {
            cartLink.addEventListener('click', (e) => {
                // Linkin sayfaya gitmesini engelle, sadece menüyü aç
                e.preventDefault(); 
                e.stopPropagation(); 

                // Sepet menüsünü aç/kapat
                cartIndicator.classList.toggle('indicator--opened');
            });
        }
    }


    document.addEventListener('click', (event) => {
        // Topbar menülerini kapat
        if (!event.target.closest('.js-dropdown')) {
            dropdowns.forEach(d => d.classList.remove('topbar-dropdown--opened'));
        }
        
        // Sepet menüsünü kapat
        if (cartIndicator && !cartIndicator.contains(event.target)) {
            cartIndicator.classList.remove('indicator--opened');
        }
    });


    let lastScrollTop = 0;
    const header = document.querySelector('header');
    
    if (header) {
        const headerHeight = header.offsetHeight;
        window.addEventListener('scroll', function() {
            let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (currentScrollTop > lastScrollTop && currentScrollTop > headerHeight) {
                // Aşağı kaydırırken gizle
                header.classList.add('header-hidden');
            } else {
                // Yukarı kaydırırken göster
                header.classList.remove('header-hidden');
            }
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; 
        });
    }

});