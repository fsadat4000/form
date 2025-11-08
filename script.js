// ذخیره کاربران در localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];

// المنت‌های DOM
const registerContainer = document.querySelector('.register-container');
const loginContainer = document.querySelector('.login-container');
const showLoginLink = document.getElementById('showLogin');
const showRegisterLink = document.getElementById('showRegister');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const successModal = document.getElementById('successModal');
const continueToLoginBtn = document.getElementById('continueToLogin');
const welcomeScreen = document.getElementById('welcomeAnimation');
const welcomeMessage = document.getElementById('welcomeMessage');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

// نمایش فرم ورود
showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
});

// نمایش فرم ثبت نام
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    registerContainer.classList.remove('hidden');
});

// مدیریت فرم ثبت نام
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    // اعتبارسنجی
    if (!validateForm(fullName, email, password, confirmPassword)) {
        return;
    }
    
    // بررسی وجود کاربر
    if (users.find(user => user.email === email)) {
        showError('این ایمیل قبلاً ثبت شده است');
        return;
    }
    
    // ایجاد کاربر جدید
    const newUser = {
        id: Date.now(),
        fullName,
        email,
        password,
        username: email.split('@')[0],
        createdAt: new Date().toISOString()
    };
    
    // ذخیره کاربر
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // نمایش پیام موفقیت
    showSuccessModal();
});

// مدیریت فرم ورود
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // یافتن کاربر
    const user = users.find(u => 
        (u.email === username || u.username === username) && 
        u.password === password
    );
    
    if (user) {
        showWelcomeAnimation(user.fullName);
    } else {
        showError('نام کاربری یا رمز عبور اشتباه است');
    }
});

// ادامه به صفحه ورود بعد از ثبت نام موفق
continueToLoginBtn.addEventListener('click', () => {
    successModal.classList.remove('active');
    registerContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
    registerForm.reset();
});

// اعتبارسنجی فرم
function validateForm(fullName, email, password, confirmPassword) {
    if (fullName.length < 3) {
        showError('نام و نام خانوادگی باید حداقل ۳ کاراکتر باشد');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showError('لطفا یک ایمیل معتبر وارد کنید');
        return false;
    }
    
    if (password.length < 6) {
        showError('رمز عبور باید حداقل ۶ کاراکتر باشد');
        return false;
    }
    
    if (password !== confirmPassword) {
        showError('رمز عبور و تکرار آن مطابقت ندارند');
        return false;
    }
    
    const passwordStrength = checkPasswordStrength(password);
    if (passwordStrength < 2) {
        showError('لطفا رمز عبور قوی‌تری انتخاب کنید');
        return false;
    }
    
    return true;
}

// بررسی ایمیل
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// بررسی قدرت رمز عبور
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
}

// نمایش خطا
function showError(message) {
    // ایجاد و نمایش پیام خطا
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ef4444;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // حذف خودکار پس از 5 ثانیه
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

// نمایش مودال موفقیت
function showSuccessModal() {
    successModal.classList.add('active');
}

// نمایش انیمیشن خوش آمدگویی
function showWelcomeAnimation(userName) {
    welcomeMessage.textContent = `خوش آمدید ${userName}!`;
    welcomeScreen.classList.add('active');
    
    // انتقال بعد از اتمام انیمیشن
    setTimeout(() => {
        welcomeScreen.classList.remove('active');
        loginForm.reset();
        // در اینجا می‌توانید کاربر را به صفحه اصلی هدایت کنید
        alert(`با موفقیت وارد شدید ${userName} عزیز!`);
    }, 3000);
}

// نمایش/مخفی کردن رمز عبور
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.parentNode.querySelector('.password-toggle i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// بررسی قدرت رمز عبور در زمان تایپ
passwordInput.addEventListener('input', function() {
    const password = this.value;
    const strength = checkPasswordStrength(password);
    
    // به‌روزرسانی نوار قدرت
    updateStrengthBar(strength);
    
    // بررسی تطابق رمز عبور
    if (confirmPasswordInput.value) {
        validatePasswordMatch();
    }
});

confirmPasswordInput.addEventListener('input', validatePasswordMatch);

function validatePasswordMatch() {
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    
    if (confirmPassword && password !== confirmPassword) {
        confirmPasswordInput.style.borderColor = '#ef4444';
    } else if (confirmPassword) {
        confirmPasswordInput.style.borderColor = '#10b981';
    } else {
        confirmPasswordInput.style.borderColor = '#e5e7eb';
    }
}

function updateStrengthBar(strength) {
    let width = 0;
    let color = '#ef4444';
    let text = 'ضعیف';
    
    switch(strength) {
        case 0:
        case 1:
            width = 25;
            color = '#ef4444';
            text = 'ضعیف';
            break;
        case 2:
            width = 50;
            color = '#f59e0b';
            text = 'متوسط';
            break;
        case 3:
            width = 75;
            color = '#10b981';
            text = 'قوی';
            break;
        case 4:
        case 5:
            width = 100;
            color = '#10b981';
            text = 'بسیار قوی';
            break;
    }
    
    strengthFill.style.width = `${width}%`;
    strengthFill.style.background = color;
    strengthText.textContent = `قدرت رمز عبور: ${text}`;
    strengthText.style.color = color;
}

// مقداردهی اولیه
document.addEventListener('DOMContentLoaded', function() {
    // بررسی اگر کاربری وجود دارد
    if (users.length > 0) {
        console.log(`${users.length} کاربر در سیستم ثبت شده است`);
    }
    
    // انیمیشن ورود اولیه
    setTimeout(() => {
        document.querySelector('.form-container').style.opacity = '1';
    }, 300);
});