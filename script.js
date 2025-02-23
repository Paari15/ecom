document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const cartToggle = document.querySelector('.cart-toggle');
    const wishlistToggle = document.querySelector('.wishlist-toggle');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    const cartList = document.querySelector('.cart-list');
    const cartCountEls = document.querySelectorAll('.cart-count');
    const wishlistCountEls = document.querySelectorAll('.wishlist-count');
    const cartTotalEls = document.querySelectorAll('.cart-total');
    const miniCart = document.querySelector('.mini-cart');
    const miniCartContent = document.querySelector('.mini-cart-content');
    const viewCartBtn = document.querySelector('.view-cart-btn');
    const wishlistPanel = document.querySelector('.wishlist-panel');
    const wishlistContent = document.querySelector('.wishlist-content');
    const viewWishlistBtn = document.querySelector('.view-wishlist-btn');
    const modal = document.querySelector('.product-modal');
    const closeModal = document.querySelector('.close-modal');
    const videoBtn = document.querySelector('.video-btn');
    const videoFullscreen = document.querySelector('.video-fullscreen');
    const video = videoFullscreen.querySelector('video');
    const closeVideo = document.querySelector('.close-video');
    const compareModal = document.querySelector('.compare-modal');
    const closeCompare = document.querySelector('.close-compare');
    const compareList = document.querySelector('.compare-list');
    const searchInput = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-btn');
    const spotlightItem = document.querySelector('.spotlight-item');
    const cartSticky = document.querySelector('.cart-sticky');
    const openCartBtn = document.querySelector('.open-cart-btn');
    const notification = document.querySelector('.notification');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    let cart = [];
    let wishlist = [];
    let compare = [];
    let total = 0;
    let miniTimeout, wishlistTimeout;

    // Sticky Header Shrink
    window.addEventListener('scroll', () => {
        header.classList.toggle('shrink', window.scrollY > 50);
        cartSticky.classList.toggle('hidden', window.scrollY < 100 || cart.length === 0);
    });

    // Parallax & Particle Hero
    const layers = document.querySelectorAll('.parallax-layer');
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX - window.innerWidth / 2) / 50;
        const y = (e.clientY - window.innerHeight / 2) / 50;
        layers.forEach((layer, i) => {
            const speed = (i + 1) * 0.1;
            layer.style.transform = `translate(${x * speed}px, ${y * speed}px) scale(1.${i + 2})`;
        });
    });

    // Lazy Load Sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.lazy-load, .hero-content').forEach(el => observer.observe(el));

    // Spotlight Feature
    const products = document.querySelectorAll('.product-item');
    let spotlightIndex = 0;
    function updateSpotlight() {
        const item = products[spotlightIndex];
        spotlightItem.innerHTML = `
            <h3>${item.querySelector('h3').textContent}</h3>
            <p>Spotlight: ${item.querySelector('p').textContent}</p>
            <div class="reviews">${item.querySelector('.reviews').innerHTML}</div>
        `;
        spotlightIndex = (spotlightIndex + 1) % products.length;
    }
    updateSpotlight();
    setInterval(updateSpotlight, 5000);

    // Cart & Wishlist Toggle
    cartToggle.addEventListener('click', () => toggleOverlay(cartOverlay, miniCart, wishlistPanel));
    wishlistToggle.addEventListener('click', () => toggleOverlay(cartOverlay, wishlistPanel, miniCart));
    openCartBtn.addEventListener('click', () => toggleOverlay(cartOverlay, miniCart, wishlistPanel));

    function toggleOverlay(overlay, showPanel, hidePanel) {
        if (overlay.style.display === 'flex') {
            overlay.style.display = 'none';
            overlay.setAttribute('aria-hidden', 'true');
        } else {
            overlay.style.display = 'flex';
            overlay.setAttribute('aria-hidden', 'false');
            showPanel.classList.add('active');
            hidePanel.classList.remove('active');
        }
    }

    cartToggle.addEventListener('mouseenter', () => showMiniPanel(miniCart, miniTimeout));
    wishlistToggle.addEventListener('mouseenter', () => showMiniPanel(wishlistPanel, wishlistTimeout));

    cartToggle.addEventListener('mouseleave', () => hideMiniPanel(miniCart, miniTimeout));
    wishlistToggle.addEventListener('mouseleave', () => hideMiniPanel(wishlistPanel, wishlistTimeout));

    miniCart.addEventListener('mouseenter', () => clearTimeout(miniTimeout));
    wishlistPanel.addEventListener('mouseenter', () => clearTimeout(wishlistTimeout));

    miniCart.addEventListener('mouseleave', () => hideMiniPanel(miniCart, miniTimeout));
    wishlistPanel.addEventListener('mouseleave', () => hideMiniPanel(wishlistPanel, wishlistTimeout));

    viewCartBtn.addEventListener('click', () => {
        cartOverlay.style.display = 'flex';
        cartOverlay.setAttribute('aria-hidden', 'false');
        miniCart.classList.remove('active');
    });

    viewWishlistBtn.addEventListener('click', () => {
        cartOverlay.style.display = 'flex';
        cartOverlay.setAttribute('aria-hidden', 'false');
        wishlistPanel.classList.remove('active');
    });

    closeCart.addEventListener('click', () => {
        cartOverlay.style.display = 'none';
        cartOverlay.setAttribute('aria-hidden', 'true');
    });

    function showMiniPanel(panel, timeout) {
        if (panel === miniCart && cart.length > 0 || panel === wishlistPanel && wishlist.length > 0) {
            clearTimeout(timeout);
            panel.classList.add('active');
        }
    }

    function hideMiniPanel(panel, timeout) {
        timeout = setTimeout(() => panel.classList.remove('active'), 300);
    }

    // Hero Button Scroll
    document.querySelector('.hero-btn').addEventListener('click', () => {
        document.querySelector('#products').scrollIntoView({ behavior: 'smooth' });
    });

    // Search Functionality
    searchBtn.addEventListener('click', () => filterBySearch());
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') filterBySearch();
    });

    function filterBySearch() {
        const query = searchInput.value.toLowerCase();
        products.forEach(item => {
            const name = item.querySelector('h3').textContent.toLowerCase();
            item.classList.toggle('hidden', !name.includes(query));
        });
    }

    // Filter Products
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            products.forEach(item => {
                item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
            });
        });
    });

    // Wishlist Add
    document.querySelectorAll('.wishlist-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.product-item');
            const id = item.dataset.id;
            const name = item.querySelector('h3').textContent;
            const price = parseInt(item.dataset.price);

            if (!wishlist.some(w => w.id === id)) {
                wishlist.push({ id, name, price });
                btn.classList.add('active');
                updateWishlist();
                showNotification(`${name} added to wishlist!`);
            }
        });
    });

    function updateWishlist() {
        wishlistContent.innerHTML = '';
        wishlist.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('wishlist-item');
            div.innerHTML = `
                <img src="https://via.placeholder.com/50" alt="${item.name}" loading="lazy">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                </div>
            `;
            wishlistContent.appendChild(div);
        });
        wishlistCountEls.forEach(el => {
            el.textContent = wishlist.length;
            el.style.transform = 'scale(1.2)';
            setTimeout(() => el.style.transform = 'scale(1)', 200);
        });
    }

    // Compare Products
    document.querySelectorAll('.compare-check').forEach(check => {
        check.addEventListener('change', (e) => {
            const item = e.target.closest('.product-item');
            const id = item.dataset.id;
            const name = item.querySelector('h3').textContent;
            const price = parseInt(item.dataset.price);

            if (e.target.checked) {
                if (compare.length < 3) {
                    compare.push({ id, name, price });
                } else {
                    e.target.checked = false;
                    showNotification('You can compare up to 3 products.');
                }
            } else {
                compare = compare.filter(c => c.id !== id);
            }
            document.querySelector('.compare-count').textContent = compare.length;
        });
    });

    document.querySelector('.compare-btn').addEventListener('click', () => {
        if (compare.length > 0) {
            compareModal.style.display = 'flex';
            compareList.innerHTML = '';
            compare.forEach(item => {
                const div = document.createElement('div');
                div.classList.add('compare-item');
                div.innerHTML = `
                    <img src="https://via.placeholder.com/200" alt="${item.name}" loading="lazy">
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                `;
                compareList.appendChild(div);
            });
        } else {
            showNotification('Select products to compare!');
        }
    });

    closeCompare.addEventListener('click', () => {
        compareModal.style.display = 'none';
    });

    // Explore Buttons & Modal
    document.querySelectorAll('.explore-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const item = e.target.closest('.product-item');
            const id = item.dataset.id;
            const name = item.querySelector('h3').textContent;
            const basePrice = parseInt(item.dataset.price);
            const colors = JSON.parse(item.dataset.colors);
            const sizes = JSON.parse(item.dataset.sizes);
            const videoSrc = item.dataset.video;
            const reviews = item.querySelector('.reviews').innerHTML;

            modal.querySelector('.modal-title').textContent = name;
            modal.querySelector('.modal-price').textContent = `$${basePrice}`;
            modal.querySelector('.reviews-modal').innerHTML = reviews;
            const colorsDiv = modal.querySelector('.colors');
            const sizesDiv = modal.querySelector('.sizes');
            colorsDiv.innerHTML = '';
            sizesDiv.innerHTML = '';

            colors.forEach((color, i) => {
                const div = document.createElement('div');
                div.classList.add('color-opt');
                div.style.background = color.toLowerCase();
                div.dataset.color = color;
                div.setAttribute('aria-label', `${color} Color`);
                div.tabIndex = 0;
                colorsDiv.appendChild(div);
            });

            sizes.forEach((size, i) => {
                const div = document.createElement('div');
                div.classList.add('size-opt');
                div.textContent = size;
                div.dataset.size = size;
                div.setAttribute('aria-label', `${size} Size`);
                div.tabIndex = 0;
                sizesDiv.appendChild(div);
            });

            let selectedColor = colors[0];
            let selectedSize = sizes[0];
            let price = basePrice;
            let scale = 1;

            const updatePreview = () => {
                modal.querySelector('.modal-price').textContent = `$${price}`;
                modal.querySelector('.modal-3d-preview').style.background = selectedColor.toLowerCase();
                modal.querySelector('.modal-3d-preview').style.transform = `rotateX(0deg) rotateY(0deg) scale(${scale})`;
            };

            const selectOption = (container, className, callback) => {
                container.querySelectorAll(`.${className}`).forEach(opt => {
                    const handler = (e) => {
                        e.preventDefault(); // Prevent default touch behavior
                        container.querySelector('.active')?.classList.remove('active');
                        opt.classList.add('active');
                        callback(opt);
                        updatePreview();
                        showNotification(`Selected ${className === 'color-opt' ? 'color' : 'size'}: ${opt.dataset[className === 'color-opt' ? 'color' : 'size']}`);
                    };
                    opt.addEventListener('click', handler);
                    opt.addEventListener('touchend', handler); // Add touch support
                    opt.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handler(e);
                        }
                    });
                });
            };

            selectOption(colorsDiv, 'color-opt', opt => selectedColor = opt.dataset.color);
            selectOption(sizesDiv, 'size-opt', opt => {
                selectedSize = opt.dataset.size;
                price = basePrice + (selectedSize === 'Pro' || selectedSize === 'Max' ? 200 : 0);
            });

            colorsDiv.querySelector('.color-opt').classList.add('active');
            sizesDiv.querySelector('.size-opt').classList.add('active');
            updatePreview();

            modal.style.display = 'flex';
            modal.querySelector('.modal-3d-preview').style.transform = 'rotateX(0deg) rotateY(0deg)';
            video.src = videoSrc;

            // Ensure modal is scrollable on mobile
            modal.scrollTop = 0;

            // Zoom controls
            zoomInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                scale = Math.min(2, scale + 0.1);
                updatePreview();
            });

            zoomOutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                scale = Math.max(1, scale - 0.1);
                updatePreview();
            });
        });
    });

    // Close Modal
    closeModal.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'none';
        videoFullscreen.style.display = 'none';
        video.pause();
    });

    closeModal.addEventListener('touchend', (e) => {
        e.preventDefault();
        modal.style.display = 'none';
        videoFullscreen.style.display = 'none';
        video.pause();
    });

    // Video Button
    videoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        videoFullscreen.style.display = 'flex';
        video.play();
    });

    videoBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        videoFullscreen.style.display = 'flex';
        video.play();
    });

    closeVideo.addEventListener('click', (e) => {
        e.preventDefault();
        videoFullscreen.style.display = 'none';
        video.pause();
    });

    closeVideo.addEventListener('touchend', (e) => {
        e.preventDefault();
        videoFullscreen.style.display = 'none';
        video.pause();
    });

    // Add to Cart
    modal.querySelector('.add-btn').addEventListener('click', (e) => {
        e.preventDefault();
        const name = modal.querySelector('.modal-title').textContent;
        const price = parseInt(modal.querySelector('.modal-price').textContent.replace('$', ''));
        const color = modal.querySelector('.colors .active').dataset.color;
        const size = modal.querySelector('.sizes .active').dataset.size;
        const id = Date.now().toString(); // Unique ID for cart item

        cart.push({ id, name, price, color, size });
        total += price;
        updateCart();
        modal.style.display = 'none';
        miniCart.classList.add('active');
        showNotification(`${name} added to cart!`);
        setTimeout(() => miniCart.classList.remove('active'), 2000);
    });

    modal.querySelector('.add-btn').addEventListener('touchend', (e) => {
        e.preventDefault();
        const name = modal.querySelector('.modal-title').textContent;
        const price = parseInt(modal.querySelector('.modal-price').textContent.replace('$', ''));
        const color = modal.querySelector('.colors .active').dataset.color;
        const size = modal.querySelector('.sizes .active').dataset.size;
        const id = Date.now().toString(); // Unique ID for cart item

        cart.push({ id, name, price, color, size });
        total += price;
        updateCart();
        modal.style.display = 'none';
        miniCart.classList.add('active');
        showNotification(`${name} added to cart!`);
        setTimeout(() => miniCart.classList.remove('active'), 2000);
    });

    function updateCart() {
        cartList.innerHTML = '';
        miniCartContent.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="https://via.placeholder.com/100" alt="${item.name}" loading="lazy">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.color} - ${item.size}</p>
                    <p>$${item.price}</p>
                </div>
                <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.name} from Cart">✕</button>
            `;
            cartList.appendChild(cartItem);

            const miniItem = document.createElement('div');
            miniItem.classList.add('mini-cart-item');
            miniItem.innerHTML = `
                <img src="https://via.placeholder.com/50" alt="${item.name}" loading="lazy">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price}</p>
                </div>
            `;
            miniCartContent.appendChild(miniItem);
        });

        cartCountEls.forEach(el => {
            el.textContent = cart.length;
            el.style.transform = 'scale(1.2)';
            setTimeout(() => el.style.transform = 'scale(1)', 200);
        });
        cartTotalEls.forEach(el => el.textContent = `$${total}`);

        // Add remove functionality
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const id = e.target.dataset.id;
                const item = cart.find(i => i.id === id);
                total -= item.price;
                cart = cart.filter(i => i.id !== id);
                updateCart();
                showNotification(`${item.name} removed from cart.`);
            });
        });

        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                const id = e.target.dataset.id;
                const item = cart.find(i => i.id === id);
                total -= item.price;
                cart = cart.filter(i => i.id !== id);
                updateCart();
                showNotification(`${item.name} removed from cart.`);
            });
        });
    }

    // Checkout Button
    document.querySelector('.checkout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        if (cart.length > 0) {
            showNotification(`Proceeding to checkout with ${cart.length} items for $${total}`);
        } else {
            showNotification('Your cart is empty!');
        }
    });

    document.querySelector('.checkout-btn').addEventListener('touchend', (e) => {
        e.preventDefault();
        if (cart.length > 0) {
            showNotification(`Proceeding to checkout with ${cart.length} items for $${total}`);
        } else {
            showNotification('Your cart is empty!');
        }
    });

    // 3D Preview & Zoom Interaction
    document.querySelectorAll('.product-3d, .modal-3d-preview').forEach(el => {
        let isDragging = false;
        let startX, startY, rotateX = 0, rotateY = 0;
        let scale = 1;

        const startDrag = (x, y) => {
            isDragging = true;
            startX = x;
            startY = y;
            el.style.cursor = 'grabbing';
        };

        const moveDrag = (x, y) => {
            if (!isDragging) return;
            const deltaX = (x - startX) / 5;
            const deltaY = (y - startY) / 5;
            rotateY += deltaX;
            rotateX -= deltaY;
            rotateX = Math.max(-20, Math.min(20, rotateX));
            rotateY = Math.max(-20, Math.min(20, rotateY));
            el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
            startX = x;
            startY = y;
        };

        const endDrag = () => {
            isDragging = false;
            el.style.cursor = 'grab';
            if (!isDragging) {
                el.style.transform = `rotateX(0deg) rotateY(0deg) scale(${scale})`;
            }
        };

        el.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
        document.addEventListener('mousemove', (e) => moveDrag(e.clientX, e.clientY));
        document.addEventListener('mouseup', endDrag);

        el.addEventListener('touchstart', (e) => startDrag(e.touches[0].clientX, e.touches[0].clientY));
        el.addEventListener('touchmove', (e) => moveDrag(e.touches[0].clientX, e.touches[0].clientY));
        el.addEventListener('touchend', endDrag);

        el.addEventListener('wheel', (e) => {
            e.preventDefault();
            scale = Math.max(1, Math.min(2, scale - e.deltaY * 0.001));
            el.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
        });
    });

    // Zoom Controls in Modal
    document.querySelector('.zoom-in')?.addEventListener('click', (e) => {
        e.preventDefault();
        const preview = document.querySelector('.modal-3d-preview');
        let scale = parseFloat(preview.style.scale || 1);
        scale = Math.min(2, scale + 0.1);
        preview.style.scale = scale;
    });

    document.querySelector('.zoom-in')?.addEventListener('touchend', (e) => {
        e.preventDefault();
        const preview = document.querySelector('.modal-3d-preview');
        let scale = parseFloat(preview.style.scale || 1);
        scale = Math.min(2, scale + 0.1);
        preview.style.scale = scale;
    });

    document.querySelector('.zoom-out')?.addEventListener('click', (e) => {
        e.preventDefault();
        const preview = document.querySelector('.modal-3d-preview');
        let scale = parseFloat(preview.style.scale || 1);
        scale = Math.max(1, scale - 0.1);
        preview.style.scale = scale;
    });

    document.querySelector('.zoom-out')?.addEventListener('touchend', (e) => {
        e.preventDefault();
        const preview = document.querySelector('.modal-3d-preview');
        let scale = parseFloat(preview.style.scale || 1);
        scale = Math.max(1, scale - 0.1);
        preview.style.scale = scale;
    });

    // Notification System
    function showNotification(message) {
        notification.textContent = message;
        notification.classList.add('active');
        setTimeout(() => notification.classList.remove('active'), 3000);
    }

    // Accessibility: Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            modal.style.display = 'none';
            cartOverlay.style.display = 'none';
            cartOverlay.setAttribute('aria-hidden', 'true');
            videoFullscreen.style.display = 'none';
            video.pause();
            miniCart.classList.remove('active');
            wishlistPanel.classList.remove('active');
            compareModal.style.display = 'none';
        }
    });

    // PWA Setup (Only if not running on file://)
    if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
        navigator.serviceWorker.register('/sw.js').then(() => {
            console.log('Service Worker registered');
        }).catch(err => console.error('Service Worker failed:', err));

        // Cache assets for offline use
        const cacheAssets = ['/', '/styles.css', '/script.js', 'https://via.placeholder.com/100', 'https://via.placeholder.com/50'];
        caches.open('zenith-store').then(cache => cache.addAll(cacheAssets)).catch(err => console.error('Caching failed:', err));
    } else {
        console.warn('Service Workers and caching are disabled when running on file:// protocol. Use a local server (e.g., http://localhost) for full functionality.');
    }
});