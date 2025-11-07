document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('categoriesTrack');
    const cards = document.querySelectorAll('.category-card');
    const indicatorsContainer = document.getElementById('categoryIndicators');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    
    // Calculate how many cards to show at once based on screen width
    function getCardsPerView() {
        if (window.innerWidth < 576) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    }
    
    let cardsPerView = getCardsPerView();
    let currentPosition = 0;
    let autoScrollInterval;
    let isScrollingForward = true; // Direction flag
    
    // Create indicators based on number of cards and cards per view
    function createIndicators() {
        indicatorsContainer.innerHTML = '';
        const totalSlides = Math.ceil(cards.length / cardsPerView);
        
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'category-indicator';
            if (i === 0) indicator.classList.add('active');
            
            indicator.addEventListener('click', () => {
                goToSlide(i);
            });
            
            indicatorsContainer.appendChild(indicator);
        }
    }
    
    // Update track position with smooth transition
    function updateTrackPosition() {
        const cardWidth = cards[0].offsetWidth + 20; // card width + gap
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = `translateX(-${currentPosition * cardWidth * cardsPerView}px)`;
        
        // Update active indicator
        const indicators = document.querySelectorAll('.category-indicator');
        const activeIndex = Math.floor(currentPosition);
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === activeIndex);
        });
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        const maxPosition = Math.ceil(cards.length / cardsPerView) - 1;
        currentPosition = Math.min(Math.max(slideIndex, 0), maxPosition);
        updateTrackPosition();
        resetAutoScroll();
    }
    
    // Scroll to next set of cards (forward direction)
    function scrollNext() {
        const maxPosition = Math.ceil(cards.length / cardsPerView) - 1;
        if (currentPosition < maxPosition) {
            currentPosition++;
        } else {
            // If at the end, create seamless loop by jumping to start without animation
            track.style.transition = 'none';
            currentPosition = 0;
            updateTrackPosition();
            // Force reflow
            void track.offsetWidth;
            // Restore transition
            track.style.transition = 'transform 0.5s ease-in-out';
        }
        updateTrackPosition();
    }
    
    // Scroll to previous set of cards (backward direction)
    function scrollPrev() {
        const maxPosition = Math.ceil(cards.length / cardsPerView) - 1;
        if (currentPosition > 0) {
            currentPosition--;
        } else {
            // If at the start, create seamless loop by jumping to end without animation
            track.style.transition = 'none';
            currentPosition = maxPosition;
            updateTrackPosition();
            // Force reflow
            void track.offsetWidth;
            // Restore transition
            track.style.transition = 'transform 0.5s ease-in-out';
        }
        updateTrackPosition();
    }
    
    // Auto-scroll functionality with direction change
    function startAutoScroll() {
        autoScrollInterval = setInterval(() => {
            if (isScrollingForward) {
                scrollNext();
            } else {
                scrollPrev();
            }
        }, 3000); // Change slide every 3 seconds
    }
    
    // Change direction every 2 complete cycles
    function startDirectionChange() {
        setInterval(() => {
            isScrollingForward = !isScrollingForward;
        }, 6000); // Change direction every 6 seconds (2 cycles)
    }
    
    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        startAutoScroll();
    }
    
    // Event listeners for manual navigation
    scrollLeftBtn.addEventListener('click', () => {
        scrollPrev();
        resetAutoScroll();
        isScrollingForward = false; // Set direction to backward
    });
    
    scrollRightBtn.addEventListener('click', () => {
        scrollNext();
        resetAutoScroll();
        isScrollingForward = true; // Set direction to forward
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        cardsPerView = getCardsPerView();
        createIndicators();
        updateTrackPosition();
    });
    
    // Pause auto-scroll on hover
    track.addEventListener('mouseenter', () => {
        clearInterval(autoScrollInterval);
    });
    
    track.addEventListener('mouseleave', () => {
        startAutoScroll();
    });
    
    // Add touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - go forward
                scrollNext();
                isScrollingForward = true;
            } else {
                // Swipe right - go backward
                scrollPrev();
                isScrollingForward = false;
            }
            resetAutoScroll();
        }
    }
    
    // Initialize
    createIndicators();
    updateTrackPosition();
    startAutoScroll();
    startDirectionChange();
});