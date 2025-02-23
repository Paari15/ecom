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
    wishlistToggle.addEventListener('mouseleave', () => hideMiniPanel(wishlist-panel, wishlistTimeout));

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
            const price = parseFloat(item.dataset.price);

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
                <img src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg" alt="${item.name}" loading="lazy">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
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
            const price = parseFloat(item.dataset.price);

            if (e.target.checked) {
                if (compare.length < 3) {
                    compare.push({ id, name, price });
                } else {
                    e.target.checked = false;
                    showNotification('You can compare up to 3 gifts.');
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
                    <img src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg" alt="${item.name}" loading="lazy">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                `;
                compareList.appendChild(div);
            });
        } else {
            showNotification('Select gifts to compare!');
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
            const basePrice = parseFloat(item.dataset.price);
            const customizations = JSON.parse(item.dataset.customizations);
            const videoSrc = item.dataset.video;
            const reviews = item.querySelector('.reviews').innerHTML;

            modal.querySelector('.modal-title').textContent = name;
            modal.querySelector('.modal-price').textContent = `$${basePrice.toFixed(2)}`;
            modal.querySelector('.reviews-modal').innerHTML = reviews;
            const customizationOptions = modal.querySelector('.customization-options');
            customizationOptions.innerHTML = '';

            customizations.forEach((custom, i) => {
                const div = document.createElement('div');
                div.classList.add('customization-option');
                div.textContent = custom;
                div.dataset.custom = custom;
                div.setAttribute('aria-label', `Select ${custom} customization`);
                div.tabIndex = 0;
                customizationOptions.appendChild(div);
            });

            let selectedCustomizations = [];
            let price = basePrice;

            const updatePreview = () => {
                modal.querySelector('.modal-price').textContent = `$${price.toFixed(2)}`;
                modal.querySelector('.modal-3d-preview').style.background = `url('https://images.pexels.com/photos/3761519/pexels-photo-3761519.jpeg') center/cover no-repeat`; /* Free Pexels image */
            };

            const selectCustomization = (container) => {
                container.querySelectorAll('.customization-option').forEach(opt => {
                    const handler = (e) => {
                        e.preventDefault();
                        container.querySelector('.active')?.classList.remove('active');
                        opt.classList.add('active');
                        selectedCustomizations = Array.from(container.querySelectorAll('.active')).map(el => el.dataset.custom);
                        price = basePrice + (selectedCustomizations.length * 10); // Add $10 per customization
                        updatePreview();
                        showNotification(`Selected ${opt.dataset.custom} for ${name}`);
                    };
                    opt.addEventListener('click', handler);
                    opt.addEventListener('touchend', handler);
                    opt.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handler(e);
                        }
                    });
                });
            };

            selectCustomization(customizationOptions);
            customizationOptions.querySelector('.customization-option')?.classList.add('active');
            updatePreview();

            modal.style.display = 'flex';
            modal.querySelector('.modal-3d-preview').style.transform = 'rotateX(0deg) rotateY(0deg)';
            video.src = videoSrc;
            modal.scrollTop = 0;

            // Zoom controls
            let scale = 1;
            zoomInBtn.addEventListener('click', (e) => {
                e.preventDefault();
                scale = Math.min(2, scale + 0.1);
                updatePreview();
            });

            zoomInBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                scale = Math.min(2, scale + 0.1);
                updatePreview();
            });

            zoomOutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                scale = Math.max(1, scale - 0.1);
                updatePreview();
            });

            zoomOutBtn.addEventListener('touchend', (e) => {
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
        const price = parseFloat(modal.querySelector('.modal-price').textContent.replace('$', ''));
        const customizations = modal.querySelectorAll('.customization-option.active').length ? Array.from(modal.querySelectorAll('.customization-option.active')).map(el => el.dataset.custom).join(', ') : 'None';
        const id = Date.now().toString();

        cart.push({ id, name, price, customizations });
        total += price;
        updateCart();
        modal.style.display = 'none';
        miniCart.classList.add('active');
        showNotification(`${name} with ${customizations} added to cart!`);
        setTimeout(() => miniCart.classList.remove('active'), 2000);
    });

    modal.querySelector('.add-btn').addEventListener('touchend', (e) => {
        e.preventDefault();
        const name = modal.querySelector('.modal-title').textContent;
        const price = parseFloat(modal.querySelector('.modal-price').textContent.replace('$', ''));
        const customizations = modal.querySelectorAll('.customization-option.active').length ? Array.from(modal.querySelectorAll('.customization-option.active')).map(el => el.dataset.custom).join(', ') : 'None';
        const id = Date.now().toString();

        cart.push({ id, name, price, customizations });
        total += price;
        updateCart();
        modal.style.display = 'none';
        miniCart.classList.add('active');
        showNotification(`${name} with ${customizations} added to cart!`);
        setTimeout(() => miniCart.classList.remove('active'), 2000);
    });

    function updateCart() {
        cartList.innerHTML = '';
        miniCartContent.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg" alt="${item.name}" loading="lazy">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>Customizations: ${item.customizations}</p>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.name} from Cart">✕</button>
            `;
            cartList.appendChild(cartItem);

            const miniItem = document.createElement('div');
            miniItem.classList.add('mini-cart-item');
            miniItem.innerHTML = `
                <img src="https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg" alt="${item.name}" loading="lazy">
                <div>
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
            `;
            miniCartContent.appendChild(miniItem);
        });

        cartCountEls.forEach(el => {
            el.textContent = cart.length;
            el.style.transform = 'scale(1.2)';
            setTimeout(() => el.style.transform = 'scale(1)', 200);
        });
        cartTotalEls.forEach(el => el.textContent = `$${total.toFixed(2)}`);

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
            showNotification(`Proceeding to checkout with ${cart.length} items for $${total.toFixed(2)}. Use a platform like Shopify or Stripe for payments!`);
        } else {
            showNotification('Your cart is empty!');
        }
    });

    document.querySelector('.checkout-btn').addEventListener('touchend', (e) => {
        e.preventDefault();
        if (cart.length > 0) {
            showNotification(`Proceeding to checkout with ${cart.length} items for $${total.toFixed(2)}. Use a platform like Shopify or Stripe for payments!`);
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

        // Cache assets for offline use, including free images
        const cacheAssets = ['/', '/styles.css', '/script.js', 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg', 'https://images.pexels.com/photos/3761519/pexels-photo-3761519.jpeg'];
        caches.open('zenith-gifts').then(cache => cache.addAll(cacheAssets)).catch(err => console.error('Caching failed:', err));
    } else {
        console.warn('Service Workers and caching are disabled when running on file:// protocol. Use a local server (e.g., http://localhost) for full functionality.');
    }
});