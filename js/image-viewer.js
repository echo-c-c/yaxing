// Image Viewer Script
document.addEventListener('DOMContentLoaded', function() {
    // Create viewer elements
    const viewerOverlay = document.createElement('div');
    viewerOverlay.className = 'image-viewer-overlay';
    viewerOverlay.innerHTML = `
        <div class="image-viewer-container">
            <button class="image-viewer-close">&times;</button>
            <div class="image-viewer-content">
                <div class="image-viewer-nav-container">
                    <button class="image-viewer-prev">&lt;</button>
                    <img src="" alt="" class="image-viewer-img">
                    <button class="image-viewer-next">&gt;</button>
                </div>
                <div class="image-viewer-caption"></div>
            </div>
        </div>
    `;
    document.body.appendChild(viewerOverlay);

    // Add CSS to head
    const style = document.createElement('style');
    style.textContent = `
        .image-viewer-overlay {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }
        .image-viewer-container {
            position: relative;
            max-width: 90%;
            max-height: 90%;
        }
        .image-viewer-content {
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .image-viewer-nav-container {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
        }
        .image-viewer-img {
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            border: 2px solid white;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
        .image-viewer-caption {
            color: white;
            margin-top: 15px;
            padding: 10px 20px;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 5px;
            max-width: 100%;
            text-align: center;
            font-size: 16px;
        }
        .image-viewer-close,
        .image-viewer-prev,
        .image-viewer-next {
            position: relative;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 25px;
            font-size: 24px;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: background-color 0.3s;
            z-index: 10;
        }
        .image-viewer-close:hover,
        .image-viewer-prev:hover,
        .image-viewer-next:hover {
            background-color: rgba(0, 0, 0, 0.9);
        }
        .image-viewer-close {
            position: absolute;
            top: -25px;
            right: -25px;
            z-index: 1001;
        }
        .image-viewer-prev {
            margin-right: 10px;
        }
        .image-viewer-next {
            margin-left: 10px;
        }
        @media (max-width: 768px) {
            .image-viewer-close {
                top: 10px;
                right: 10px;
                width: 40px;
                height: 40px;
                font-size: 20px;
            }
            .image-viewer-prev,
            .image-viewer-next {
                width: 40px;
                height: 40px;
                font-size: 18px;
                background: rgba(0, 0, 0, 0.7);
                display: flex !important;
                margin: 0 5px;
            }
            .image-viewer-nav-container {
                gap: 5px;
            }
            .image-viewer-caption {
                font-size: 14px;
                padding: 8px 15px;
            }
        }
        
        @media (max-width: 480px) {
            .image-viewer-container {
                max-width: 95%;
            }
            .image-viewer-close {
                top: 5px;
                right: 5px;
                width: 36px;
                height: 36px;
                font-size: 18px;
            }
            .image-viewer-prev,
            .image-viewer-next {
                width: 36px;
                height: 36px;
                font-size: 16px;
                opacity: 0.9;
                background: rgba(0, 0, 0, 0.7);
                display: flex !important;
                margin: 0 2px;
            }
            .image-viewer-caption {
                font-size: 12px;
                padding: 6px 10px;
                max-width: 90%;
            }
        }
    `;
    document.head.appendChild(style);

    // Get elements
    const viewer = document.querySelector('.image-viewer-overlay');
    const viewerImg = viewer.querySelector('.image-viewer-img');
    const viewerCaption = viewer.querySelector('.image-viewer-caption');
    const closeBtn = viewer.querySelector('.image-viewer-close');
    const prevBtn = viewer.querySelector('.image-viewer-prev');
    const nextBtn = viewer.querySelector('.image-viewer-next');

    let currentCategory = null;
    let currentIndex = 0;
    let categoryImages = [];

    // Find all product categories and make images clickable
    document.querySelectorAll('.product-category').forEach(category => {
        const images = Array.from(category.querySelectorAll('.product-item img'));
        
        images.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                const imgTitle = img.closest('.product-item').querySelector('.product-info h4')?.textContent || img.alt;
                openViewer(images, index, imgTitle);
            });
        });
    });

    // Open viewer function
    function openViewer(images, index, title) {
        categoryImages = images;
        currentIndex = index;
        updateViewer();
        viewer.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when viewer is open
    }

    // Update viewer function
    function updateViewer() {
        const img = categoryImages[currentIndex];
        viewerImg.src = img.src;
        viewerImg.alt = img.alt;
        
        const imgTitle = img.closest('.product-item')?.querySelector('.product-info h4')?.textContent || img.alt;
        viewerCaption.textContent = imgTitle;
        
        // Show/hide navigation buttons based on number of images
        const showNav = categoryImages.length > 1;
        prevBtn.style.display = showNav ? 'flex' : 'none';
        nextBtn.style.display = showNav ? 'flex' : 'none';
    }

    // Close viewer
    closeBtn.addEventListener('click', function() {
        viewer.style.display = 'none';
        document.body.style.overflow = '';
    });

    // Navigate to previous image
    prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + categoryImages.length) % categoryImages.length;
        updateViewer();
    });

    // Navigate to next image
    nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % categoryImages.length;
        updateViewer();
    });

    // Close on overlay click
    viewer.addEventListener('click', function(e) {
        if (e.target === viewer) {
            viewer.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Touch swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    viewerImg.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);
    
    viewerImg.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);
    
    function handleSwipe() {
        if (categoryImages.length <= 1) return;
        
        const threshold = 50; // minimum distance for swipe
        if (touchEndX < touchStartX - threshold) { 
            // Swipe left, go to next image
            currentIndex = (currentIndex + 1) % categoryImages.length;
            updateViewer();
        } else if (touchEndX > touchStartX + threshold) { 
            // Swipe right, go to previous image
            currentIndex = (currentIndex - 1 + categoryImages.length) % categoryImages.length;
            updateViewer();
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (viewer.style.display === 'flex') {
            if (e.key === 'Escape') {
                viewer.style.display = 'none';
                document.body.style.overflow = '';
            } else if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + categoryImages.length) % categoryImages.length;
                updateViewer();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % categoryImages.length;
                updateViewer();
            }
        }
    });
    
    // Handle window resize to adjust buttons visibility
    window.addEventListener('resize', function() {
        if (viewer.style.display === 'flex') {
            updateViewer();
        }
    });
}); 