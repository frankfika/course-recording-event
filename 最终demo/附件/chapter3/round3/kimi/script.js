// 倒计时功能
document.addEventListener('DOMContentLoaded', function() {
    // 设置倒计时结束时间（24小时后）
    const endTime = new Date().getTime() + (24 * 60 * 60 * 1000);
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = endTime - now;
        
        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            document.getElementById('countdown').textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            document.getElementById('countdown').textContent = '00:00:00';
        }
    }
    
    // 立即更新一次，然后每秒更新
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // 表单验证和提交
    const form = document.getElementById('registrationForm');
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const submitBtn = form.querySelector('.submit-btn');
    
    // 验证函数
    function validateName(name) {
        if (!name.trim()) {
            return '请输入姓名';
        }
        if (name.trim().length < 2) {
            return '姓名至少需要2个字符';
        }
        if (!/^[一-龥a-zA-Z\s]+$/.test(name.trim())) {
            return '姓名只能包含中文、英文和空格';
        }
        return '';
    }
    
    function validatePhone(phone) {
        if (!phone.trim()) {
            return '请输入手机号码';
        }
        if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
            return '请输入正确的手机号码';
        }
        return '';
    }
    
    // 实时验证
    nameInput.addEventListener('input', function() {
        const error = validateName(this.value);
        nameError.textContent = error;
        this.classList.toggle('error', error !== '');
        this.classList.toggle('success', error === '' && this.value.trim() !== '');
    });
    
    nameInput.addEventListener('blur', function() {
        const error = validateName(this.value);
        nameError.textContent = error;
        this.classList.toggle('error', error !== '');
    });
    
    phoneInput.addEventListener('input', function() {
        // 只允许输入数字
        this.value = this.value.replace(/[^\d]/g, '');
        
        const error = validatePhone(this.value);
        phoneError.textContent = error;
        this.classList.toggle('error', error !== '');
        this.classList.toggle('success', error === '' && this.value.trim() !== '');
    });
    
    phoneInput.addEventListener('blur', function() {
        const error = validatePhone(this.value);
        phoneError.textContent = error;
        this.classList.toggle('error', error !== '');
    });
    
    // 表单提交
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // 验证所有字段
        const nameErrorText = validateName(nameInput.value);
        const phoneErrorText = validatePhone(phoneInput.value);
        
        nameError.textContent = nameErrorText;
        phoneError.textContent = phoneErrorText;
        
        nameInput.classList.toggle('error', nameErrorText !== '');
        phoneInput.classList.toggle('error', phoneErrorText !== '');
        
        // 如果有错误，不提交
        if (nameErrorText || phoneErrorText) {
            // 滚动到第一个错误字段
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // 显示加载状态
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // 收集表单数据
        const formData = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            company: document.getElementById('company').value.trim(),
            position: document.getElementById('position').value.trim(),
            timestamp: new Date().toISOString()
        };
        
        try {
            // 模拟API提交（实际使用时替换为真实的API端点）
            await simulateFormSubmission(formData);
            
            // 显示成功消息
            showSuccessMessage('报名成功！我们会尽快与您联系。');
            
            // 重置表单
            form.reset();
            
            // 移除验证状态
            document.querySelectorAll('.error, .success').forEach(el => {
                el.classList.remove('error', 'success');
            });
            document.querySelectorAll('.error-message').forEach(el => {
                el.textContent = '';
            });
            
            // 滚动到页面顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
        } catch (error) {
            // 显示错误消息
            showErrorMessage('提交失败，请稍后重试。');
            console.error('Form submission error:', error);
        } finally {
            // 恢复按钮状态
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
    
    // 模拟表单提交函数
    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 模拟90%成功率
                if (Math.random() > 0.1) {
                    console.log('表单提交成功:', data);
                    resolve({ success: true, data });
                } else {
                    reject(new Error('网络错误'));
                }
            }, 2000); // 模拟2秒延迟
        });
    }
    
    // 显示成功消息
    function showSuccessMessage(message) {
        // 移除已存在的消息
        removeExistingMessages();
        
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i> 
            ${message}
        `;
        
        form.parentNode.insertBefore(successDiv, form);
        
        // 3秒后自动移除
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 5000);
    }
    
    // 显示错误消息
    function showErrorMessage(message) {
        // 移除已存在的消息
        removeExistingMessages();
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            background: #f8d7da;
            color: #721c24;
            padding: 15px;
            border-radius: 10px;
            margin-top: 20px;
            text-align: center;
            border: 1px solid #f5c6cb;
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i> 
            ${message}
        `;
        
        form.parentNode.insertBefore(errorDiv, form);
        
        // 5秒后自动移除
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    // 移除已存在的消息
    function removeExistingMessages() {
        const existingMessages = form.parentNode.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => {
            if (msg.parentNode) {
                msg.parentNode.removeChild(msg);
            }
        });
    }
    
    // 平滑滚动效果
    function smoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // 页面滚动动画
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // 观察需要动画的元素
        const animatedElements = document.querySelectorAll('.highlight-card, .instructor-card, .registration-card');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }
    
    // 初始化所有功能
    smoothScroll();
    initScrollAnimations();
    
    // 添加输入框焦点效果
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .form-group.focused label {
            color: #23877B;
            transform: translateY(-2px);
        }
        
        .form-group input.error {
            border-color: #e74c3c !important;
            background-color: #fdf2f2;
        }
        
        .form-group input.success {
            border-color: #27ae60 !important;
            background-color: #f2fdf5;
        }
        
        .highlight-card:hover .highlight-icon {
            transform: scale(1.1);
            transition: transform 0.3s ease;
        }
        
        .submit-btn:hover .fa-arrow-right {
            transform: translateX(5px);
            transition: transform 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});

// 页面加载完成后的额外效果
window.addEventListener('load', function() {
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // 添加滚动时的视差效果
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});