
/*
document.addEventListener('DOMContentLoaded', function() {
    


    // Slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length > 0 && dots.length > 0) {
        let currentSlide = 0, slideInterval;
        const showSlide = (index) => {
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        };
        const nextSlide = () => showSlide((currentSlide + 1) % slides.length);
        const startSlideShow = () => { slideInterval = setInterval(nextSlide, 5000); };
        const stopSlideShow = () => clearInterval(slideInterval);
        dots.forEach(dot => dot.addEventListener('click', () => {
            stopSlideShow();
            showSlide(parseInt(dot.dataset.slide));
            startSlideShow();
        }));
        startSlideShow();
    }

    // Topbar & Cart Dropdowns
    const dropdowns = document.querySelectorAll('.js-dropdown');
    const cartIndicator = document.querySelector('.indicator--trigger--click');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.js-dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (event) => {
                event.preventDefault();
                dropdown.classList.toggle('topbar-dropdown--opened');
                dropdowns.forEach(other => {
                    if (other !== dropdown) other.classList.remove('topbar-dropdown--opened');
                });
            });
        }
    });

    if (cartIndicator) {
        const cartButton = cartIndicator.querySelector('.indicator-link');
        if (cartButton) {
            cartButton.addEventListener('click', (event) => {
                event.preventDefault();
                cartIndicator.classList.toggle('indicator--opened');
            });
        }
    }

 // Click outside listener for all dropdowns
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.js-dropdown')) {
            dropdowns.forEach(d => d.classList.remove('topbar-dropdown--opened'));
        }
        if (cartIndicator && !cartIndicator.contains(event.target)) {
            cartIndicator.classList.remove('indicator--opened');
        }
    });

});


*/ 
    /*BU DENEME AMAÇLIDIR*/

    // ========================================
    // YENİ VE GÜNCELLENMİŞ SEPET KODLARI
    // ========================================

    // 1. Sepeti localStorage'dan yükle veya boş bir dizi oluştur
/*


    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    // 2. Gerekli HTML elementlerini seç
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCountBubbles = document.querySelectorAll('.indicator-value'); // Tüm sayaçları seç (header + sayfa)
    
    // Elementleri seç (sadece varlarsa)
    const dropcartList = document.querySelector('.dropcart-products-list');
    const dropcartTotals = document.querySelector('.dropcart-totals table tbody');
    const cartPageTable = document.querySelector('.cart-table-body');
    const cartPageTotalsSubtotal = document.querySelector('.cart-totals-subtotal');
    const cartPageTotalsShipping = document.querySelector('.cart-totals-shipping');
    const cartPageTotalsTax = document.querySelector('.cart-totals-tax');
    const cartPageTotalsTotal = document.querySelector('.cart-totals-total');
    
    const cartEmptyMessage = '<p class="dropcart-empty">There are no items in your cart.</p>';
    const shippingCost = 25.00; // Sabit kargo ücreti
    const taxRate = 0.10; // Vergi oranı (%0)

    // 3. Sepete Ekle Butonlarına tıklama olayı atama
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.card');
            
            const product = {
                id: card.dataset.productId,
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
                image: card.dataset.image,
                quantity: 1
            };
            addToCart(product);
        });
    });

    // 4. Sepete Ekleme Fonksiyonu
    function addToCart(productToAdd) {
        const existingProduct = cart.find(item => item.id === productToAdd.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(productToAdd);
        }
        saveAndRenderCart();
    }

    // 5. Sepeti Kaydetme ve Arayüzü Güncelleme Ana Fonksiyonu
    function saveAndRenderCart() {
        // Sepeti tarayıcı hafızasına kaydet
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        
        // Arayüzleri güncelle
        renderDropdownCart(); // Header'daki küçük sepeti güncelle
        renderCartPage();     // Sepet sayfasını (eğer açıksa) güncelle
        updateCartCount();    // İkon üzerindeki sayıyı güncelle
    }

    // 6. İkon üzerindeki sayıyı günceller
    function updateCartCount() {
        let totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountBubbles.forEach(bubble => {
            bubble.textContent = totalQuantity;
        });
    }

    // 7. AÇILIR SEPETİ (DROPDOWN) çizer
    function renderDropdownCart() {
        // Eğer sayfada açılır sepet yoksa, fonksiyonu durdur
        if (!dropcartList || !dropcartTotals) return;

        if (cart.length === 0) {
            dropcartList.innerHTML = cartEmptyMessage;
            dropcartTotals.innerHTML = '<tr><th>Total</th><td>$0.00</td></tr>';
            return;
        }

        dropcartList.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            const productHtml = `
                <div class="dropcart-product">
                    <img src="${window.location.pathname.includes('/pages/') ? '../' + item.image : item.image}" alt="${item.name}">
                    <div class="dropcart-product-info">
                        <a href="#">${item.name}</a>
                        <div class="dropcart-product-meta">
                            <span>${item.quantity} x $${item.price.toFixed(2)}</span>
                        </div>
                        <a href="#" class="dropcart-product-remove" data-id="${item.id}">Remove</a>
                    </div>
                </div>`;
            dropcartList.innerHTML += productHtml;
        });
        dropcartTotals.innerHTML = `<tr><th>Total</th><td>$${subtotal.toFixed(2)}</td></tr>`;
        
        // Dropdown içindeki 'Remove' butonlarına olay ekle
        addDropdownEventListeners();
    }

    // 8. SEPET SAYFASINI (VIEW-CART.HTML) çizer
    function renderCartPage() {
        // Eğer sepet sayfası elementleri yoksa, fonksiyonu durdur
        if (!cartPageTable || !cartPageTotalsSubtotal) return;

        if (cart.length === 0) {
            cartPageTable.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 40px;">Your cart is empty.</td></tr>';
            cartPageTotalsSubtotal.textContent = '$0.00';
            cartPageTotalsShipping.textContent = '$0.00';
            cartPageTotalsTax.textContent = '$0.00';
            cartPageTotalsTotal.textContent = '$0.00';
            return;
        }
        
        cartPageTable.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            const productHtml = `
                <tr>
                    <td><img src="${item.image.startsWith('http') ? item.image : '../' + item.image}" alt="${item.name}"></td>
                    <td>
                        <a href="#" class="product-name">${item.name}</a>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <div class="cart-quantity-controls-page">
                            <button class="cart-quantity-btn-page cart-quantity-sub-page" data-id="${item.id}">-</button>
                            <input type="text" class="cart-quantity-input-page" value="${item.quantity}" readonly>
                            <button class="cart-quantity-btn-page cart-quantity-add-page" data-id="${item.id}">+</button>
                        </div>
                    </td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td><button class="cart-remove-btn-page" data-id="${item.id}">&times;</button></td>
                </tr>`;
            cartPageTable.innerHTML += productHtml;
        });

        // Sayfadaki toplamları güncelle
        const tax = subtotal * taxRate;
        const total = subtotal + shippingCost + tax;
        cartPageTotalsSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        cartPageTotalsShipping.textContent = `$${shippingCost.toFixed(2)}`;
        cartPageTotalsTax.textContent = `$${tax.toFixed(2)}`;
        cartPageTotalsTotal.textContent = `$${total.toFixed(2)}`;

        // Sepet sayfasındaki butonlara olay ekle
        addCartPageEventListeners();
    }

    // 9. Dropdown içindeki butonlara olay atar
    function addDropdownEventListeners() {
        document.querySelectorAll('.dropcart-product-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                updateQuantity(e.target.dataset.id, 0); // Miktar 0 = Sil
            });
        });
    }
    
    // 10. Sepet sayfasındaki butonlara olay atar
    function addCartPageEventListeners() {
        document.querySelectorAll('.cart-quantity-add-page').forEach(button => {
            button.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, 1));
        });
        document.querySelectorAll('.cart-quantity-sub-page').forEach(button => {
            button.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, -1));
        });
        document.querySelectorAll('.cart-remove-btn-page').forEach(button => {
            button.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, 0));
        });
        
        // "Update Cart" butonu (aslında otomatik güncelleniyor, ama senkronizasyon için)
        const updateButton = document.querySelector('.btn-update-cart');
        if (updateButton) {
            updateButton.addEventListener('click', () => {
                // Sadece arayüzü yeniden çiz (veriler zaten güncel)
                saveAndRenderCart(); 
            });
        }
    }

    // 11. Miktar Güncelleme Ana Fonksiyonu
    function updateQuantity(productId, change) {
        const productIndex = cart.findIndex(item => item.id === productId);
        if (productIndex === -1) return;

        if (change === 0) {
            // Ürünü siliyoruz
            cart.splice(productIndex, 1);
        } else {
            // Miktarı artır/azalt
            cart[productIndex].quantity += change;
            // Miktar 0'a düşerse sil
            if (cart[productIndex].quantity <= 0) {
                cart.splice(productIndex, 1);
            }
        }
        
        // Değişiklikleri kaydet ve tüm arayüzleri yeniden çiz
        saveAndRenderCart();
    }

    // Sayfa ilk yüklendiğinde tüm sepet arayüzlerini (varsa) çiz
    saveAndRenderCart();
*/


document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 1. SLIDER, TOPBAR, KAYAN HEADER KODLARI
    // ========================================

    // Slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    if (slides.length > 0 && dots.length > 0) {
        let currentSlide = 0, slideInterval;
        const showSlide = (index) => {
            if (!slides[index]) return;
            slides.forEach(s => s.classList.remove('active'));
            dots.forEach(d => d.classList.remove('active'));
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        };
        const nextSlide = () => showSlide((currentSlide + 1) % slides.length);
        const startSlideShow = () => { slideInterval = setInterval(nextSlide, 5000); };
        const stopSlideShow = () => clearInterval(slideInterval);
        dots.forEach(dot => dot.addEventListener('click', () => {
            stopSlideShow();
            showSlide(parseInt(dot.dataset.slide));
            startSlideShow();
        }));
        startSlideShow();
    }

    // Topbar & Cart Dropdowns
    const dropdowns = document.querySelectorAll('.js-dropdown');
    const cartIndicator = document.querySelector('.indicator--trigger--click');

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.js-dropdown-toggle');
        if (toggle) {
            toggle.addEventListener('click', (event) => {
                event.preventDefault();
                dropdown.classList.toggle('topbar-dropdown--opened');
                dropdowns.forEach(other => {
                    if (other !== dropdown) other.classList.remove('topbar-dropdown--opened');
                });
            });
        }
    });

    if (cartIndicator) {
        const cartButton = cartIndicator.querySelector('.indicator-link');
        if (cartButton) {
            cartButton.addEventListener('click', (event) => {
                
                // Hatalı 'if' kontrolü buradan kaldırıldı.
                
                // Linkin varsayılan davranışını (sayfayı yenilemeyi) her zaman engelle:
                event.preventDefault();
                // Menüyü her zaman aç/kapat:
                cartIndicator.classList.toggle('indicator--opened');
            });
        }
    }

    //Kayan Header Kodu
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    if (header) {
        const headerHeight = header.offsetHeight;
        window.addEventListener('scroll', function() {
            let currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScrollTop > lastScrollTop && currentScrollTop > headerHeight) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop; 
        });
    }

    // ========================================
    // 2. YENİ SEPET VE KUPON KODLARI
    // ========================================

    // 1. Sepeti ve İndirimleri Tutan Değişkenler
    let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
    let discountPercent = 0;
    let couponApplied = false;

    // 2. Gerekli HTML elementlerini seç
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const cartCountBubbles = document.querySelectorAll('.indicator-value');
    
    // Açılır Sepet Elementleri
    const dropcartList = document.querySelector('.dropcart-products-list');
    const dropcartTotals = document.querySelector('.dropcart-totals table tbody');
    
    // Sepet Sayfası Elementleri
    const cartPageTable = document.querySelector('.cart-table-body');
    const cartPageTotalsSubtotal = document.querySelector('.cart-totals-subtotal');
    const cartPageTotalsDiscount = document.querySelector('.cart-totals-discount'); // Kupon için
    const cartPageTotalsShipping = document.querySelector('.cart-totals-shipping');
    const cartPageTotalsTax = document.querySelector('.cart-totals-tax');
    const cartPageTotalsTotal = document.querySelector('.cart-totals-total');
    
    const cartEmptyMessage = '<p class="dropcart-empty">There are no items in your cart.</p>';
    const shippingCost = 25.00;
    const taxRate = 0.12;

    // 3. Sepete Ekle Butonlarına tıklama olayı atama
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const card = event.target.closest('.card');
            if (!card) return;
            
            const product = {
                id: card.dataset.productId,
                name: card.dataset.name,
                price: parseFloat(card.dataset.price),
                image: card.dataset.image,
                quantity: 1
            };
            addToCart(product);
        });
    });

    // 4. Sepete Ekleme Fonksiyonu
    function addToCart(productToAdd) {
        const existingProduct = cart.find(item => item.id === productToAdd.id);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(productToAdd);
        }
        saveAndRenderCart();
    }

    // 5. Sepeti Kaydetme ve Arayüzü Güncelleme Ana Fonksiyonu
    function saveAndRenderCart() {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        renderDropdownCart();
        renderCartPage();
        updateCartCount();
    }

    // 6. İkon üzerindeki sayıyı günceller
    function updateCartCount() {
        let totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountBubbles.forEach(bubble => {
            bubble.textContent = totalQuantity;
        });
    }

    // 7. AÇILIR SEPETİ (DROPDOWN) çizer
    function renderDropdownCart() {
        if (!dropcartList || !dropcartTotals) return; 

        if (cart.length === 0) {
            dropcartList.innerHTML = cartEmptyMessage;
            dropcartTotals.innerHTML = '<tr><th>Total</th><td>$0.00</td></tr>';
            return;
        }

        dropcartList.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            const imagePath = window.location.pathname.includes('/pages/') ? '../' + item.image : item.image;
            const productHtml = `
                <div class="dropcart-product">
                    <img src="${imagePath}" alt="${item.name}">
                    <div class="dropcart-product-info">
                        <a href="#">${item.name}</a>
                        <div class="dropcart-product-meta">
                            <span>${item.quantity} x $${item.price.toFixed(2)}</span>
                        </div>
                        <a href="#" class="dropcart-product-remove" data-id="${item.id}">Remove</a>
                    </div>
                </div>`;
            dropcartList.innerHTML += productHtml;
        });
        dropcartTotals.innerHTML = `<tr><th>Total</th><td>$${subtotal.toFixed(2)}</td></tr>`;
        
        addDropdownEventListeners();
    }

    // 8. SEPET SAYFASINI (VIEW-CART.HTML) çizer
    function renderCartPage() {
        if (!cartPageTable || !cartPageTotalsSubtotal) return; 

        if (cart.length === 0) {
            cartPageTable.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 40px;">Your cart is empty.</td></tr>';
            cartPageTotalsSubtotal.textContent = '$0.00';
            if (cartPageTotalsDiscount) cartPageTotalsDiscount.textContent = '$0.00';
            cartPageTotalsShipping.textContent = '$0.00';
            cartPageTotalsTax.textContent = '$0.00';
            cartPageTotalsTotal.textContent = '$0.00';
            return;
        }
        
        cartPageTable.innerHTML = '';
        let subtotal = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            const imagePath = window.location.pathname.includes('/pages/') ? '../' + item.image : item.image;
            const productHtml = `
                <tr>
                    <td><img src="${imagePath}" alt="${item.name}"></td>
                    <td><a href="#" class="product-name">${item.name}</a></td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <div class="cart-quantity-controls-page">
                            <button class="cart-quantity-btn-page cart-quantity-sub-page" data-id="${item.id}">-</button>
                            <input type="text" class="cart-quantity-input-page" value="${item.quantity}" readonly>
                            <button class="cart-quantity-btn-page cart-quantity-add-page" data-id="${item.id}">+</button>
                        </div>
                    </td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td><button class="cart-remove-btn-page" data-id="${item.id}">&times;</button></td>
                </tr>`;
            cartPageTable.innerHTML += productHtml;
        });

        // Sayfadaki toplamları (Kupon dahil) güncelle
        const discountAmount = subtotal * discountPercent;
        const subtotalAfterDiscount = subtotal - discountAmount;
        const tax = subtotalAfterDiscount * taxRate;
        const total = subtotalAfterDiscount + (cart.length > 0 ? shippingCost : 0) + tax;

        cartPageTotalsSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        if (cartPageTotalsDiscount) cartPageTotalsDiscount.textContent = `-$${discountAmount.toFixed(2)}`;
        cartPageTotalsShipping.textContent = `$${(cart.length > 0 ? shippingCost : 0).toFixed(2)}`;
        cartPageTotalsTax.textContent = `$${tax.toFixed(2)}`;
        cartPageTotalsTotal.textContent = `$${total.toFixed(2)}`;
        
        addCartPageEventListeners();
    }

    // 9. Dropdown içindeki 'Remove' butonlarına olay atar
    function addDropdownEventListeners() {
        document.querySelectorAll('.dropcart-product-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Kapanmayı engeller
                updateQuantity(e.target.dataset.id, 0); 
            });
        });
    }
    
    // 10. Sepet sayfasındaki '+', '-', 'Remove' butonlarına olay atar
    function addCartPageEventListeners() {
        document.querySelectorAll('.cart-quantity-add-page').forEach(button => {
            button.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, 1));
        });
        document.querySelectorAll('.cart-quantity-sub-page').forEach(button => {
            button.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, -1));
        });
        document.querySelectorAll('.cart-remove-btn-page').forEach(button => {
            button.addEventListener('click', (e) => updateQuantity(e.target.dataset.id, 0));
        });
        
        const updateButton = document.querySelector('.btn-update-cart');
        if (updateButton) {
            updateButton.addEventListener('click', () => {
                saveAndRenderCart(); 
            });
        }
    }

    // 11. Miktar Güncelleme Ana Fonksiyonu
    function updateQuantity(productId, change) {
        const productIndex = cart.findIndex(item => item.id === productId);
        if (productIndex === -1) return;

        if (change === 0) {
            cart.splice(productIndex, 1);
        } else {
            cart[productIndex].quantity += change;
            if (cart[productIndex].quantity <= 0) {
                cart.splice(productIndex, 1);
            }
        }
        
        saveAndRenderCart();
    }

    // 12. KUPON KODU İŞLEVSELLİĞİ
    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    const couponInput = document.getElementById('coupon-code-input');

    if (applyCouponBtn && couponInput) {
        applyCouponBtn.addEventListener('click', function() {
            const couponCode = couponInput.value.trim().toUpperCase();

            if (couponCode === 'SALE10' && !couponApplied) {
                discountPercent = 0.10; // %10 İndirim
                couponApplied = true;
                couponInput.value = 'SALE10 Applied!';
                couponInput.disabled = true;
                applyCouponBtn.disabled = true;
                saveAndRenderCart(); 
            } else if (couponApplied) {
                couponInput.value = 'Coupon already applied';
            } else {
                couponInput.value = '';
                couponInput.placeholder = 'Invalid coupon code!';
                couponInput.classList.add('invalid-coupon');
                setTimeout(() => {
                    couponInput.classList.remove('invalid-coupon');
                    couponInput.placeholder = 'Coupon Code';
                }, 2000);
            }
        });
    }

    // 13. Dışarı Tıklama Olayı (Tüm menüleri kapatır)
    document.addEventListener('click', (event) => {
        // Topbar menülerini kapat
        if (!event.target.closest('.js-dropdown')) {
            dropdowns.forEach(d => d.classList.remove('topbar-dropdown--opened'));
        }
        
        // Sepet menüsünü kapat (DÜZELTME BURADA)
        if (cartIndicator && 
            !cartIndicator.contains(event.target) && 
            !event.target.closest('.add-to-cart-btn')) { // Sepete ekle butonu hariç
            
            cartIndicator.classList.remove('indicator--opened');
        }
    });

    // ========================================
    // 3. YENİ CHECKOUT SAYFASI KODLARI
    // ========================================
    
    const checkoutForm = document.getElementById('checkout-form');
    
    // SADECE Checkout sayfasındaysak bu kodları çalıştır
    if (checkoutForm) {
        
        // 1. Sipariş özetini ve toplamları yükle
        function renderCheckoutOrder() {
            const orderTableBody = document.querySelector('.checkout-order-table-body');
            const summarySubtotal = document.querySelector('.summary-subtotal .cart-totals-subtotal');
            const summaryShipping = document.querySelector('.summary-shipping .cart-totals-shipping');
            const summaryTax = document.querySelector('.summary-tax .cart-totals-tax');
            const summaryTotal = document.querySelector('.summary-total .cart-totals-total');
            
            if (!orderTableBody) return; // Element yoksa dur

            orderTableBody.innerHTML = '';
            let subtotal = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                const productHtml = `
                    <tr>
                        <td>${item.name} &times; ${item.quantity}</td>
                        <td>$${itemTotal.toFixed(2)}</td>
                    </tr>`;
                orderTableBody.innerHTML += productHtml;
            });

            const discountAmount = subtotal * discountPercent;
            const subtotalAfterDiscount = subtotal - discountAmount;
            const tax = subtotalAfterDiscount * taxRate;
            const total = subtotalAfterDiscount + (cart.length > 0 ? shippingCost : 0) + tax;

            summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
            // İndirim varsa onu da göster
            if (discountAmount > 0) {
                const discountRow = `
                    <tr class="summary-discount">
                        <th>Discount (SALE10)</th>
                        <td style="color: #28a745;">-$${discountAmount.toFixed(2)}</td>
                    </tr>`;
                orderTableBody.innerHTML += discountRow;
            }
            summaryShipping.textContent = `$${(cart.length > 0 ? shippingCost : 0).toFixed(2)}`;
            summaryTax.textContent = `$${tax.toFixed(2)}`;
            summaryTotal.textContent = `$${total.toFixed(2)}`;
        }
        
        // 2. Ödeme yöntemleri arasında geçiş (toggle) yap
        function setupPaymentToggles() {
            document.querySelectorAll('input[name="payment-method"]').forEach(radio => {
                radio.addEventListener('change', function() {
                    // Önce tüm detayları gizle
                    document.querySelectorAll('.payment-method-details').forEach(detail => {
                        detail.style.display = 'none';
                    });
                    // Sadece seçili olanın detayını göster
                    this.closest('.payment-method').querySelector('.payment-method-details').style.display = 'block';
                });
            });
        }
        
        // 3. (İsteğiniz) Üye Girişi Kontrolü - DEMO
        function checkUserLogin() {
            // BURASI SİZİN GERÇEK SİSTEMİNİZLE DEĞİŞMELİ
            // Bu, giriş yapmış bir kullanıcıyı simüle eder:
            const demoUser = {
                loggedIn: true,
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                country: "",
                address: "",
                city: "",
                postcode: ""
            };
            // const demoUser = { loggedIn: false }; // Çıkış yapmış halini test etmek için bunu kullanın

            if (demoUser.loggedIn) {
                document.getElementById('checkout-first-name').value = demoUser.firstName;
                document.getElementById('checkout-last-name').value = demoUser.lastName;
                document.getElementById('checkout-email').value = demoUser.email;
                document.getElementById('checkout-phone').value = demoUser.phone;
                document.getElementById('checkout-country').value = demoUser.country;
                document.getElementById('checkout-address-1').value = demoUser.address;
                document.getElementById('checkout-city').value = demoUser.city;
                document.getElementById('checkout-postcode').value = demoUser.postcode;
            }
        }

        // 4. Form Doğrulama (Validation)
        checkoutForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Formun gönderilmesini engelle
            
            let isValid = true;
            const errorMessage = document.getElementById('checkout-error-message');
            errorMessage.innerHTML = '';
            errorMessage.style.display = 'none';

            // Tüm 'invalid' sınıflarını temizle
            document.querySelectorAll('.invalid-field').forEach(el => el.classList.remove('invalid-field'));

            // Gerekli alanları (ID) kontrol et
            const requiredFields = [
                'checkout-first-name', 'checkout-last-name', 'checkout-country',
                'checkout-address-1', 'checkout-city', 'checkout-postcode',
                'checkout-email', 'checkout-phone'
            ];

            requiredFields.forEach(id => {
                const input = document.getElementById(id);
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('invalid-field');
                }
            });

            // Kredi Kartı seçiliyse onu da doğrula
            if (document.getElementById('payment-card').checked) {
                const cardNumber = document.getElementById('card-number');
                const cardExpiry = document.getElementById('card-expiry');
                const cardCvc = document.getElementById('card-cvc');

                // Basit bir kart numarası kontrolü (16 haneden azsa)
                if (cardNumber.value.replace(/\s/g, '').length < 16) {
                    isValid = false;
                    cardNumber.classList.add('invalid-field');
                    errorMessage.innerHTML += '<li>Card Number must be at least 16 digits.</li>';
                }
                // Basit CVC kontrolü (3 haneden azsa)
                if (cardCvc.value.length < 3) {
                    isValid = false;
                    cardCvc.classList.add('invalid-field');
                    errorMessage.innerHTML += '<li>CVC must be at least 3 digits.</li>';
                }
                // Basit Tarih kontrolü
                if (!cardExpiry.value.match(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)) {
                    isValid = false;
                    cardExpiry.classList.add('invalid-field');
                    errorMessage.innerHTML += '<li>Expiry Date must be in MM/YY format.</li>';
                }
            }
            
            // Şartları kontrol et
            if (!document.getElementById('checkout-terms').checked) {
                isValid = false;
                errorMessage.innerHTML += '<li>You must accept the terms and conditions.</li>';
            }

            if (isValid) {
                // Her şey yolundaysa
                alert('Order Placed Successfully! (This is a demo)');
                // Burada sepeti temizleyip ana sayfaya yönlendirebilirsiniz
                cart = []; // Sepeti boşalt
                discountPercent = 0; // İndirimi sıfırla
                saveAndRenderCart(); // Boş sepeti kaydet
                // 3 saniye sonra ana sayfaya git
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 3000);
            } else {
                // Hata varsa
                errorMessage.style.display = 'block';
                window.scrollTo(0, document.body.scrollHeight); // Hata mesajını görmek için sayfanın altına kaydır
            }
        });

        // Checkout sayfasını çalıştıran fonksiyonlar
        renderCheckoutOrder(); // 1. Sipariş özetini doldur
        setupPaymentToggles(); // 2. Ödeme yöntemlerini ayarla
        checkUserLogin(); // 3. Üye girişi varsa formu doldur (DEMO)
    }

    // Dışarı Tıklama Olayı (Tüm menüleri kapatır)
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.js-dropdown')) {
            dropdowns.forEach(d => d.classList.remove('topbar-dropdown--opened'));
        }
        if (cartIndicator && 
            !cartIndicator.contains(event.target) && 
            !event.target.closest('.add-to-cart-btn')) { 
            
            cartIndicator.classList.remove('indicator--opened');
        }
    });



    // ========================================
    // 4. HABER DETAYI "READ MORE" BUTONU (YENİ)
    // ========================================
    const readMoreBtn = document.getElementById('read-more-toggle-btn');
    const hiddenContent = document.getElementById('read-more-content');

    // Sadece bu elementler sayfada varsa çalışır (diğer sayfalarda hata vermez)
    if (readMoreBtn && hiddenContent) {
        
        readMoreBtn.addEventListener('click', function() {
            // 'visible' sınıfını ekle/kaldır
            const isVisible = hiddenContent.classList.toggle('visible');
            
            // Butonun metnini değiştir
            if (isVisible) {
                readMoreBtn.textContent = 'Read Less';
            } else {
                readMoreBtn.textContent = 'Read More';
            }
        });
    }


    // SAYFA İLK YÜKLENDİĞİNDE tüm sepetleri (dropdown ve sayfa) çiz
    saveAndRenderCart();

}); // <-- TÜM KODLAR BU PARANTEZİN İÇİNDE BİTMELİ