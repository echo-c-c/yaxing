document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.carousel');
    const container = carousel.querySelector('.carousel-container');
    const slides = carousel.querySelectorAll('.carousel-slide');
    const prevButton = carousel.querySelector('.carousel-button.prev');
    const nextButton = carousel.querySelector('.carousel-button.next');
    const dotsContainer = carousel.querySelector('.carousel-dots');

    let currentSlide = 0;
    const totalSlides = slides.length;

    // 创建轮播点
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    // 更新轮播点状态
    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // 切换到指定幻灯片
    function goToSlide(index) {
        currentSlide = index;
        container.style.transform = `translateX(-${currentSlide * 33.333}%)`;
        updateDots();
    }

    // 下一张幻灯片
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }

    // 上一张幻灯片
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
    }

    // 添加按钮事件监听器
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    // 自动播放
    let autoplayInterval = setInterval(nextSlide, 5000);

    // 鼠标悬停时暂停自动播放
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    // 鼠标离开时恢复自动播放
    carousel.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });

    // 触摸事件支持
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        clearInterval(autoplayInterval);
    });

    carousel.addEventListener('touchmove', (e) => {
        touchEndX = e.touches[0].clientX;
    });

    carousel.addEventListener('touchend', () => {
        const difference = touchStartX - touchEndX;
        if (Math.abs(difference) > 50) {
            if (difference > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        autoplayInterval = setInterval(nextSlide, 5000);
    });
});