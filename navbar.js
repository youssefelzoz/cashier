// نوقف الأنيميشن في الصفحة كلها وقت التحميل عشان مفيش حاجة تعمل فلاش
document.body.classList.add('preload-transitions');

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('navbar-container');
    if (!container) return;

    // 1. 💡 جلب بيانات المستخدم لمعرفة الصلاحيات (RBAC)
    const currentUser = JSON.parse(localStorage.getItem('pos_current_user')) || { role: 'cashier' };
    const userRole = currentUser.role ? currentUser.role.trim().toLowerCase() : 'cashier';
    const isAdmin = (userRole === 'admin' || userRole === 'أدمن'); // التحقق هل هو أدمن ولا لأ

    const savedSettings = JSON.parse(localStorage.getItem('pos_settings'));
    const storeName = savedSettings?.storeName || 'تك ستور';
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // زرار الموبايل العائم (بنزرعه برا السايد بار عشان يفضل باين)
    if (!document.getElementById('mobileToggleBtn')) {
        document.body.insertAdjacentHTML('beforeend', `
            <button class="mobile-toggle-btn" id="mobileToggleBtn" onclick="toggleMobileMenu()">
                <i class="bi bi-list"></i>
            </button>
        `);
    }

    // 2. 💡 بناء القائمة الأساسية (المبيعات تظهر للكل)
    let sidebarHTML = `
        <div class="sidebar">
            <div class="sidebar-header">
                <div class="sidebar-logo"><i class="bi bi-cpu-fill"></i> <span>${storeName}</span></div>
                <button class="toggle-btn" onclick="toggleSidebar()"><i class="bi bi-list"></i></button>
            </div>
            
            <ul class="nav-links">
                <li class="has-submenu" id="menu-sales">
                    <a class="nav-link" onclick="toggleSubmenu('menu-sales')">
                        <i class="bi bi-cart-check"></i> <span>المبيعات</span>
                        <i class="bi bi-chevron-down menu-arrow"></i>
                    </a>
                    <ul class="nav-item-group">
                        <li><a href="index.html" class="nav-link ${currentPage === 'index.html' ? 'active' : ''}"><i class="bi bi-shop"></i> نقطة البيع (POS)</a></li>
                        <li><a href="sales.html" class="nav-link ${currentPage === 'sales.html' ? 'active' : ''}"><i class="bi bi-receipt"></i> سجل الفواتير</a></li>
                        <li><a href="sales-return.html" class="nav-link ${currentPage === 'sales-return.html' ? 'active' : ''}"><i class="bi bi-arrow-return-left"></i> مرتجعات المبيعات</a></li>
                    </ul>
                </li>
    `;

    // 3. 💡 بناء القوائم الإدارية (تضاف للأدمن فقط!)
    if (isAdmin) {
        sidebarHTML += `
                <li class="has-submenu" id="menu-purchases">
                    <a class="nav-link" onclick="toggleSubmenu('menu-purchases')">
                        <i class="bi bi-bag-plus"></i> <span>المشتريات</span>
                        <i class="bi bi-chevron-down menu-arrow"></i>
                    </a>
                    <ul class="nav-item-group">
                        <li><a href="purchases.html" class="nav-link ${currentPage === 'purchases.html' ? 'active' : ''}"><i class="bi bi-bag-check"></i> فاتورة مشتريات</a></li>
                        <li><a href="purchases-return.html" class="nav-link ${currentPage === 'purchases-return.html' ? 'active' : ''}"><i class="bi bi-arrow-return-right"></i> مرتجعات مشتريات</a></li>
                    </ul>
                </li>

                <li class="has-submenu" id="menu-inventory">
                    <a class="nav-link" onclick="toggleSubmenu('menu-inventory')">
                        <i class="bi bi-box-seam"></i> <span>المخزون</span>
                        <i class="bi bi-chevron-down menu-arrow"></i>
                    </a>
                    <ul class="nav-item-group">
                        <li><a href="stock-add.html" class="nav-link ${currentPage === 'stock-add.html' ? 'active' : ''}"><i class="bi bi-node-plus"></i> إذن إضافة</a></li>
                        <li><a href="stock-issue.html" class="nav-link ${currentPage === 'stock-issue.html' ? 'active' : ''}"><i class="bi bi-node-minus"></i> إذن صرف</a></li>
                        <li><a href="stock-transfer.html" class="nav-link ${currentPage === 'stock-transfer.html' ? 'active' : ''}"><i class="bi bi-arrow-left-right"></i> تحويل مخزني</a></li>
                    </ul>
                </li>

                <li class="has-submenu" id="menu-vouchers">
                    <a class="nav-link" onclick="toggleSubmenu('menu-vouchers')">
                        <i class="bi bi-cash-stack"></i> <span>السندات المالية</span>
                        <i class="bi bi-chevron-down menu-arrow"></i>
                    </a>
                    <ul class="nav-item-group">
                        <li><a href="receipt.html" class="nav-link ${currentPage === 'receipt.html' ? 'active' : ''}"><i class="bi bi-box-arrow-in-down"></i> سند قبض</a></li>
                        <li><a href="payment.html" class="nav-link ${currentPage === 'payment.html' ? 'active' : ''}"><i class="bi bi-box-arrow-up"></i> سند دفع</a></li>
                        <li><a href="vouchers-history.html" class="nav-link ${currentPage === 'vouchers-history.html' ? 'active' : ''}"><i class="bi bi-journal-text"></i> سجل السندات المالية</a></li>
                    </ul>
                </li>

                <li class="has-submenu" id="menu-admin">
                    <a class="nav-link" onclick="toggleSubmenu('menu-admin')">
                        <i class="bi bi-shield-lock"></i> <span>الإدارة</span>
                        <i class="bi bi-chevron-down menu-arrow"></i>
                    </a>
                    <ul class="nav-item-group">
                        <li><a href="products.html" class="nav-link ${currentPage === 'products.html' ? 'active' : ''}"><i class="bi bi-tags"></i> الأصناف</a></li>
                        <li><a href="contacts.html" class="nav-link ${currentPage === 'contacts.html' ? 'active' : ''}"><i class="bi bi-person-lines-fill"></i> العملاء والموردين</a></li>
                        <li><a href="reports.html" class="nav-link ${currentPage === 'reports.html' ? 'active' : ''}"><i class="bi bi-bar-chart-fill"></i> التقارير المالية</a></li>
                    </ul>
                </li>
        `;
    }

    // 4. 💡 بناء الفوتر (الإعدادات للأدمن فقط، والخروج للكل)
    sidebarHTML += `
            </ul>
            <div class="sidebar-footer">
    `;

    if (isAdmin) {
        sidebarHTML += `
                <a href="settings.html" class="nav-link ${currentPage === 'settings.html' ? 'active' : ''}">
                    <i class="bi bi-gear-fill"></i> <span>الإعدادات</span>
                </a>
        `;
    }

    sidebarHTML += `
                <a href="javascript:void(0)" class="nav-link logout-btn" onclick="logout()">
                    <i class="bi bi-box-arrow-right"></i> <span>خروج</span>
                </a>
            </div>
        </div>
    `;

    // حقن القائمة في الصفحة
    container.innerHTML = sidebarHTML;

    // فتح المجموعة النشطة أوتوماتيك بسلاسة
    setTimeout(() => {
        const activeLink = document.querySelector('.nav-item-group .active');
        if (activeLink) {
            const parentId = activeLink.closest('.has-submenu').id;
            toggleSubmenu(parentId);
        }
    }, 100);

    if (localStorage.getItem('pos_sidebar_collapsed') === 'true' && window.innerWidth > 950) {
        container.classList.add('collapsed');
    }
});

// دوال السايد بار العادية (للديسكتوب)
window.toggleSubmenu = function (id) {
    const container = document.getElementById('navbar-container');
    const targetMenu = document.getElementById(id);
    const targetGroup = targetMenu.querySelector('.nav-item-group');

    if (container.classList.contains('collapsed') && window.innerWidth > 950) {
        toggleSidebar();
    }

    document.querySelectorAll('.has-submenu').forEach(menu => {
        if (menu.id !== id) {
            menu.classList.remove('expanded');
            menu.querySelector('.nav-item-group').classList.remove('open');
        }
    });

    targetMenu.classList.toggle('expanded');
    targetGroup.classList.toggle('open');
};

window.toggleSidebar = function () {
    const container = document.getElementById('navbar-container');
    container.classList.toggle('collapsed');

    if (container.classList.contains('collapsed')) {
        document.querySelectorAll('.nav-item-group').forEach(g => g.classList.remove('open'));
        document.querySelectorAll('.has-submenu').forEach(m => m.classList.remove('expanded'));
    }

    localStorage.setItem('pos_sidebar_collapsed', container.classList.contains('collapsed'));
};

// دوال السايد بار العائم (للموبايل)
window.toggleMobileMenu = function () {
    const container = document.getElementById('navbar-container');
    const btnIcon = document.querySelector('#mobileToggleBtn i');

    container.classList.toggle('mobile-open');

    if (container.classList.contains('mobile-open')) {
        btnIcon.classList.replace('bi-list', 'bi-x-lg');
        document.getElementById('mobileToggleBtn').style.backgroundColor = '#ef4444'; // يقلب أحمر
    } else {
        btnIcon.classList.replace('bi-x-lg', 'bi-list');
        document.getElementById('mobileToggleBtn').style.backgroundColor = 'var(--sidebar-active)'; // يرجع أزرق
    }
};

// إغلاق السايد بار لو ضغطت بره في الشاشة الفاضية (للموبايل)
document.addEventListener('click', (e) => {
    const container = document.getElementById('navbar-container');
    const mobileBtn = document.getElementById('mobileToggleBtn');

    if (window.innerWidth <= 950 && container && container.classList.contains('mobile-open')) {
        if (!container.contains(e.target) && !mobileBtn.contains(e.target)) {
            toggleMobileMenu();
        }
    }
});

// 💡 5. دالة تسجيل الخروج الذكية (بتقفل القائمة المنسدلة الأول)
window.logout = function () {
    // نقفل المنيو بتاعة الموبايل الأول عشان المودال يبان براحته
    const container = document.getElementById('navbar-container');
    if (container && container.classList.contains('mobile-open')) {
        toggleMobileMenu();
    }

    // نظهر الـ SweetAlert بعد جزء صغير من الثانية عشان الأنيميشن يلحق يخلص
    setTimeout(() => {
        Swal.fire({
            title: 'تسجيل خروج؟',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'نعم، خروج',
            cancelButtonText: 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('pos_current_user');
                window.location.href = "login.html";
            }
        });
    }, 150);
};

// إرجاع الأنيميشن يشتغل طبيعي بعد ما كل حاجة اترسمت
setTimeout(() => {
    document.body.classList.remove('preload-transitions');
}, 150);