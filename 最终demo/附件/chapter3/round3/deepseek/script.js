// 表单验证和提交处理
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // 获取表单数据
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                company: document.getElementById('company').value.trim(),
                position: document.getElementById('position').value.trim(),
                timestamp: new Date().toISOString()
            };
            
            // 模拟提交成功
            showSuccessMessage();
            
            // 清空表单
            form.reset();
            
            // 这里可以添加实际的表单提交逻辑
            console.log('表单数据:', formData);
            // 实际项目中可以发送到服务器:
            // fetch('/api/register', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(formData)
            // })
        }
    });
    
    // 实时验证
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearError(this);
        });
    });
});

// 验证单个字段
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    switch (field.id) {
        case 'name':
            if (!value) {
                errorMessage = '姓名不能为空';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = '姓名至少需要2个字符';
                isValid = false;
            }
            break;
            
        case 'phone':
            if (!value) {
                errorMessage = '手机号码不能为空';
                isValid = false;
            } else if (!/^1[3-9]\d{9}$/.test(value)) {
                errorMessage = '请输入有效的手机号码';
                isValid = false;
            }
            break;
            
        case 'company':
            if (!value) {
                errorMessage = '公司名称不能为空';
                isValid = false;
            }
            break;
            
        case 'position':
            if (!value) {
                errorMessage = '职位不能为空';
                isValid = false;
            }
            break;
    }
    
    if (!isValid) {
        showError(field, errorMessage);
    } else {
        clearError(field);
    }
    
    return isValid;
}

// 验证整个表单
function validateForm() {
    const fields = ['name', 'phone', 'company', 'position'];
    let isValid = true;
    
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// 显示错误信息
function showError(field, message) {
    clearError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#e53e3e';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.5rem';
    errorDiv.textContent = message;
    
    field.style.borderColor = '#e53e3e';
    field.parentNode.appendChild(errorDiv);
}

// 清除错误信息
function clearError(field) {
    field.style.borderColor = '#e2e8f0';
    
    const errorDiv = field.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// 显示成功消息
function showSuccessMessage() {
    // 移除现有的成功消息
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.style.cssText = `
        background: #38a169;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
        margin: 1rem 0;
        animation: fadeInUp 0.6s ease-out;
    `;
    successDiv.innerHTML = `
        <i class="fas fa-check-circle" style="font-size: 1.5rem; margin-bottom: 0.5rem;"></i>
        <h3 style="margin-bottom: 0.5rem;">报名成功！</h3>
        <p>我们的课程顾问将尽快与您联系，请保持手机畅通</p>
    `;
    
    const form = document.getElementById('registrationForm');
    form.parentNode.insertBefore(successDiv, form);
    
    // 5秒后自动隐藏成功消息
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.style.opacity = '0';
            successDiv.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                if (successDiv.parentNode) {
                    successDiv.remove();
                }
            }, 500);
        }
    }, 5000);
}

// 添加键盘快捷键支持
document.addEventListener('keydown', function(e) {
    // Ctrl + Enter 提交表单
    if (e.ctrlKey && e.key === 'Enter') {
        const form = document.getElementById('registrationForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
});

// 添加输入框自动聚焦
const firstInput = document.querySelector('input');
if (firstInput) {
    setTimeout(() => {
        firstInput.focus();
    }, 100);
}