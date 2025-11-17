// 语言切换功能
let currentLang = 'en';

// 滚动到下载区域
function scrollToDownload() {
    const downloadSection = document.getElementById('download');
    if (downloadSection) {
        downloadSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 打开GitHub仓库
function openGitHub() {
    window.open('https://github.com/zkbwallet/zkbwallet', '_blank');
}

// 下载应用
function downloadApp(platform) {
    if (platform === 'ios') {
        // 这里可以替换为实际的App Store链接
        alert('iOS版本即将在App Store上线，敬请期待！');
        // window.open('https://apps.apple.com/app/zkbwallet', '_blank');
    } else if (platform === 'android') {
        // 这里可以替换为实际的Google Play链接
        alert('Android版本即将在Google Play上线，敬请期待！');
        // window.open('https://play.google.com/store/apps/details?id=com.zkbwallet.app', '_blank');
    }
}

// 下载APK
function downloadAPK() {
    // 打开APK下载链接
    window.open('https://206.238.196.207:36345/down/8nM8IMhGC9JU.apk', '_blank');
}

function switchLanguage(lang) {
    currentLang = lang;
    
    // 添加切换动画
    const switcher = document.querySelector('.language-switcher');
    if (switcher) {
        switcher.classList.add('switching');
        setTimeout(() => {
            switcher.classList.remove('switching');
        }, 300);
    }
    
    // 更新所有带有data属性的元素
    const elements = document.querySelectorAll('[data-en][data-zh]');
    elements.forEach(element => {
        if (element.hasAttribute('data-' + lang)) {
            element.textContent = element.getAttribute('data-' + lang);
        }
    });
    
    // 更新placeholder属性
    const inputs = document.querySelectorAll('input[data-en-placeholder][data-zh-placeholder]');
    inputs.forEach(input => {
        if (input.hasAttribute('data-' + lang + '-placeholder')) {
            input.placeholder = input.getAttribute('data-' + lang + '-placeholder');
        }
    });
    
    // 更新语言按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // 保存语言选择到本地存储
    localStorage.setItem('preferred-language', lang);
    
    // 更新HTML lang属性
    document.documentElement.lang = lang;
}

// 导航栏功能
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 初始化语言
    const savedLang = localStorage.getItem('preferred-language') || 'en';
    switchLanguage(savedLang);
    
    // 语言切换按钮事件
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });

    // 移动端菜单切换
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // 点击导航链接时关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // 平滑滚动到锚点
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // 考虑固定导航栏高度
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // 观察需要动画的元素
    const animatedElements = document.querySelectorAll('.feature-card, .dev-feature, .business-feature, .user-feature-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // 数字计数动画
    function animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent.replace(/[^\d]/g, ''));
            const suffix = stat.textContent.replace(/[\d]/g, '');
            let current = 0;
            const increment = target / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + suffix;
            }, 30);
        });
    }

    // 当统计区域进入视口时开始计数动画
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(statsSection);
    }

    // 按钮点击效果
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 创建涟漪效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // 添加涟漪效果样式
    const style = document.createElement('style');
    style.textContent = `
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // 模拟钱包数据更新
    function updateWalletData() {
        const balanceElement = document.querySelector('.balance-amount');
        const tokenBalances = document.querySelectorAll('.token-balance');
        
        if (balanceElement) {
            // 模拟价格波动
            const baseBalance = 2.45;
            const variation = (Math.random() - 0.5) * 0.1;
            const newBalance = (baseBalance + variation).toFixed(2);
            balanceElement.textContent = newBalance + ' ETH';
        }
        
        tokenBalances.forEach((balance, index) => {
            if (index === 1) { // USDC 余额
                const baseBalance = 1250;
                const variation = (Math.random() - 0.5) * 50;
                const newBalance = Math.floor(baseBalance + variation);
                balance.textContent = newBalance.toLocaleString() + '.00';
            }
        });
    }

    // 每30秒更新一次钱包数据
    setInterval(updateWalletData, 30000);

    // 添加页面加载动画
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    // 添加触摸手势支持（移动端）
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // 向左滑动 - 关闭菜单
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    }

    // 添加页面可见性检测
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 页面隐藏时暂停动画
            document.body.style.animationPlayState = 'paused';
        } else {
            // 页面显示时恢复动画
            document.body.style.animationPlayState = 'running';
        }
    });

    // 添加错误处理
    window.addEventListener('error', function(e) {
        console.error('页面错误:', e.error);
    });

    // 添加性能监控
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('页面加载时间:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
            }, 0);
        });
    }
});

// 添加一些实用的工具函数
const Utils = {
    // 防抖函数
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 节流函数
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // 格式化数字
    formatNumber: function(num) {
        return new Intl.NumberFormat('zh-CN').format(num);
    },

    // 生成随机ID
    generateId: function() {
        return Math.random().toString(36).substr(2, 9);
    }
};

// 导出工具函数供全局使用
window.Utils = Utils;
