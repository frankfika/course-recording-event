const countdownElement = document.getElementById("countdown");
const form = document.getElementById("registrationForm");
const modal = document.getElementById("successModal");
const closeModalButton = document.getElementById("closeModal");

const fieldConfig = {
    name: {
        input: document.getElementById("name"),
        error: document.getElementById("nameError"),
        validator(value) {
            if (!value) {
                return "请输入姓名";
            }

            if (value.length < 2) {
                return "姓名至少需要 2 个字";
            }

            if (!/^[\u4e00-\u9fa5a-zA-Z\s·]+$/.test(value)) {
                return "姓名仅支持中文、英文与空格";
            }

            return "";
        }
    },
    phone: {
        input: document.getElementById("phone"),
        error: document.getElementById("phoneError"),
        validator(value) {
            if (!value) {
                return "请输入手机号";
            }

            if (!/^1[3-9]\d{9}$/.test(value)) {
                return "请输入正确的 11 位手机号";
            }

            return "";
        }
    }
};

function startCountdown(durationInSeconds) {
    let remaining = durationInSeconds;

    const render = () => {
        const hours = String(Math.floor(remaining / 3600)).padStart(2, "0");
        const minutes = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
        const seconds = String(remaining % 60).padStart(2, "0");

        countdownElement.textContent = `${hours}:${minutes}:${seconds}`;

        if (remaining > 0) {
            remaining -= 1;
        }
    };

    render();
    window.setInterval(render, 1000);
}

function setFieldError(input, errorElement, message) {
    input.classList.toggle("is-error", Boolean(message));
    errorElement.textContent = message;
}

function validateField(key) {
    const config = fieldConfig[key];
    const normalizedValue = config.input.value.trim();
    const message = config.validator(normalizedValue);

    setFieldError(config.input, config.error, message);

    return !message;
}

function openModal() {
    modal.classList.add("is-visible");
    modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
    modal.classList.remove("is-visible");
    modal.setAttribute("aria-hidden", "true");
}

function bindFieldValidation() {
    Object.keys(fieldConfig).forEach((key) => {
        const { input } = fieldConfig[key];

        input.addEventListener("blur", () => validateField(key));
        input.addEventListener("input", () => {
            if (input.classList.contains("is-error")) {
                validateField(key);
            }
        });
    });
}

function bindFormSubmit() {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const isValid = Object.keys(fieldConfig).every((key) => validateField(key));

        if (!isValid) {
            return;
        }

        const submitButton = form.querySelector(".submit-button");
        const originalMarkup = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.innerHTML = "<span>提交中...</span><small>正在为您锁定课程席位</small>";

        window.setTimeout(() => {
            form.reset();
            Object.keys(fieldConfig).forEach((key) => setFieldError(fieldConfig[key].input, fieldConfig[key].error, ""));
            submitButton.disabled = false;
            submitButton.innerHTML = originalMarkup;
            openModal();
        }, 900);
    });
}

function initRevealAnimation() {
    const animatedBlocks = document.querySelectorAll(".section-block, .hero");

    if (!("IntersectionObserver" in window)) {
        animatedBlocks.forEach((element) => {
            element.style.opacity = "1";
            element.style.transform = "none";
        });
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0)";
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12
        }
    );

    animatedBlocks.forEach((element) => {
        element.style.opacity = "0";
        element.style.transform = "translateY(24px)";
        element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(element);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    startCountdown(23 * 60 * 60 + 59 * 60 + 59);
    bindFieldValidation();
    bindFormSubmit();
    initRevealAnimation();

    closeModalButton.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeModal();
        }
    });
});
