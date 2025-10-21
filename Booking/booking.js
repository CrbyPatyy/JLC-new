const form = document.getElementById('bookingForm');
const steps = document.querySelectorAll('.form-section');
const stepIndicators = document.querySelectorAll('.step');
const nextStep1 = document.getElementById('nextStep1');
const nextStep2 = document.getElementById('nextStep2');
const nextStep3 = document.getElementById('nextStep3');
const backStep2 = document.getElementById('backStep2');
const backStep3 = document.getElementById('backStep3');
const backStep4 = document.getElementById('backStep4');
const confirmBooking = document.getElementById('confirmBooking');
const guestCount = document.getElementById('guestCount');
const guestsInput = document.getElementById('guestsInput');
const decreaseGuests = document.getElementById('decreaseGuests');
const increaseGuests = document.getElementById('increaseGuests');
const summaryCheckin = document.getElementById('summaryCheckin');
const summaryCheckout = document.getElementById('summaryCheckout');
const summaryNights = document.getElementById('summaryNights');
const summaryGuests = document.getElementById('summaryGuests');
const summaryRoom = document.getElementById('summaryRoom');
const summaryName = document.getElementById('summaryName');
const summaryTotal = document.getElementById('summaryTotal');
const totalAmount = document.getElementById('totalAmount');
const paymentTotalAmount = document.getElementById('paymentTotalAmount');
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');
const paymentOptions = document.querySelectorAll('.payment-option');
const paymentMethodInput = document.getElementById('paymentMethod');
let currentStep = 1;
let guestCountValue = 2;
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
checkinInput.min = today.toISOString().split('T')[0];
checkoutInput.min = tomorrow.toISOString().split('T')[0];
function updateGuestCount() {
    guestCount.textContent = guestCountValue + (guestCountValue === 1 ? ' Guest' : ' Guests');
    guestsInput.value = guestCountValue;
    decreaseGuests.disabled = guestCountValue <= 1;
    increaseGuests.disabled = guestCountValue >= 10;
}
decreaseGuests.addEventListener('click', () => {
    if (guestCountValue > 1) {
        guestCountValue--;
        updateGuestCount();
    }
});
increaseGuests.addEventListener('click', () => {
    if (guestCountValue < 10) {
        guestCountValue++;
        updateGuestCount();
    }
});
function showStep(step) {
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`step${step}`).classList.add('active');
    stepIndicators.forEach(indicator => {
        indicator.classList.toggle('active', parseInt(indicator.dataset.step) === step);
    });
    currentStep = step;
    // Update payment total when showing step 4
    if (step === 4) {
        paymentTotalAmount.textContent = totalAmount.textContent;
    }
}
function validateStep1() {
    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;
    document.getElementById('checkin-error').classList.remove('show');
    document.getElementById('checkout-error').classList.remove('show');
    checkinInput.classList.remove('error');
    checkoutInput.classList.remove('error');
    let isValid = true;
    if (!checkin) {
        document.getElementById('checkin-error').classList.add('show');
        checkinInput.classList.add('error');
        isValid = false;
    }
    if (!checkout) {
        document.getElementById('checkout-error').textContent = 'Please select check-out date';
        document.getElementById('checkout-error').classList.add('show');
        checkoutInput.classList.add('error');
        isValid = false;
    } else if (new Date(checkout) <= new Date(checkin)) {
        document.getElementById('checkout-error').classList.add('show');
        checkoutInput.classList.add('error');
        isValid = false;
    }
    return isValid;
}
function validateStep2() {
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    ['firstName', 'lastName', 'email', 'phone'].forEach(field => {
        document.getElementById(`${field}-error`).classList.remove('show');
        document.getElementById(field).classList.remove('error');
    });
    let isValid = true;
    if (!firstName) {
        document.getElementById('firstName-error').classList.add('show');
        document.getElementById('firstName').classList.add('error');
        isValid = false;
    }
    if (!lastName) {
        document.getElementById('lastName-error').classList.add('show');
        document.getElementById('lastName').classList.add('error');
        isValid = false;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.getElementById('email-error').classList.add('show');
        document.getElementById('email').classList.add('error');
        isValid = false;
    }
    if (!phone || !/^\+?[\d\s\-\(\)]{10,}$/.test(phone)) {
        document.getElementById('phone-error').classList.add('show');
        document.getElementById('phone').classList.add('error');
        isValid = false;
    }
    return isValid;
}
function validateStep4() {
    const selectedMethod = paymentMethodInput.value;
    if (!selectedMethod) {
        alert('Please select a payment method');
        return false;
    }
    return true;
}
function updateSummary() {
    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;
    const roomType = document.getElementById('roomType').value;
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    if (checkin) {
        summaryCheckin.textContent = new Date(checkin).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    }
    if (checkout) {
        summaryCheckout.textContent = new Date(checkout).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
        const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
        summaryNights.textContent = nights;
    }
    summaryGuests.textContent = guestCountValue;
    const roomOptions = {
        'standard': 'Standard',
        'deluxe': 'Deluxe',
        'suite': 'Suite',
        'family': 'Family'
    };
    summaryRoom.textContent = roomOptions[roomType] || 'Deluxe';
    summaryName.textContent = (firstName && lastName) ? `${firstName} ${lastName}` : '-';
    calculateTotal();
}
function calculateTotal() {
    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;
    const roomType = document.getElementById('roomType').value;
    if (!checkin || !checkout) return;
    const nights = Math.ceil((new Date(checkout) - new Date(checkin)) / (1000 * 60 * 60 * 24));
    const roomPrices = {
        'standard': 120,
        'deluxe': 180,
        'suite': 280,
        'family': 220
    };
    const pricePerNight = roomPrices[roomType] || 180;
    const total = nights * pricePerNight;
    summaryTotal.textContent = `₱${total.toLocaleString()}`;
    totalAmount.textContent = `₱${total.toLocaleString()}`;
}
// Payment method selection
paymentOptions.forEach(option => {
    option.addEventListener('click', () => {
        paymentOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        paymentMethodInput.value = option.dataset.method;
    });
});
nextStep1.addEventListener('click', () => {
    if (validateStep1()) {
        updateSummary();
        showStep(2);
    }
});
nextStep2.addEventListener('click', () => {
    if (validateStep2()) {
        updateSummary();
        showStep(3);
    }
});
nextStep3.addEventListener('click', () => {
    showStep(4);
});
backStep2.addEventListener('click', () => showStep(1));
backStep3.addEventListener('click', () => showStep(2));
backStep4.addEventListener('click', () => showStep(3));
checkinInput.addEventListener('change', () => {
    if (checkinInput.value) {
        const nextDay = new Date(checkinInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        checkoutInput.min = nextDay.toISOString().split('T')[0];
        if (checkoutInput.value && new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
            checkoutInput.value = '';
        }
    }
    if (currentStep >= 3) calculateTotal();
});
checkoutInput.addEventListener('change', () => {
    if (currentStep >= 3) calculateTotal();
});
document.getElementById('roomType').addEventListener('change', () => {
    if (currentStep >= 3) calculateTotal();
});
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateStep2() || !validateStep4()) return;
    const formData = new FormData(form);
    formData.append("nights", summaryNights.textContent);
    formData.append("totalAmount", totalAmount.textContent);
    const confirmButton = document.getElementById("confirmBooking");
    const defaultState = confirmButton.querySelector(".state--default");
    const bookedState = confirmButton.querySelector(".state--sent");
    // 🔹 Show "Booked" animation first
    confirmButton.disabled = true;
    defaultState.style.display = "none";
    bookedState.style.display = "flex";
    // 🔹 Wait 1 second before actually saving to DB
    setTimeout(() => {
        fetch("save_booking.php", {
            method: "POST",
            body: formData
        })
        .then(res => res.text())
        .then(data => {
            if (data.trim() === "success") {
                // ✅ Smooth delay before alert
                setTimeout(() => {
                    Swal.fire({
                        title: "✅ Booking Confirmed!",
                        text: "Booking has been saved successfully!",
                        icon: "success",
                        confirmButtonColor: "#2D9D92"
                    }).then(() => {
                        // Reset form after user clicks OK
                        form.reset();
                        showStep(1);
                        guestCountValue = 2;
                        updateGuestCount();
                        summaryCheckin.textContent = "-";
                        summaryCheckout.textContent = "-";
                        summaryNights.textContent = "0";
                        summaryGuests.textContent = "2";
                        summaryRoom.textContent = "Deluxe";
                        summaryName.textContent = "-";
                        summaryTotal.textContent = "₱0";
                        totalAmount.textContent = "₱0";
                        paymentMethodInput.value = "";
                        paymentOptions.forEach(opt => opt.classList.remove('selected'));
                        // Reset button
                        confirmButton.disabled = false;
                        bookedState.style.display = "none";
                        defaultState.style.display = "flex";
                    });
                }, 600);
            } else {
                Swal.fire("⚠️ Error", "Error saving booking: " + data, "error");
                confirmButton.disabled = false;
                bookedState.style.display = "none";
                defaultState.style.display = "flex";
            }
        })
        .catch(err => {
            Swal.fire("⚠️ Connection Failed", err.toString(), "error");
            confirmButton.disabled = false;
            bookedState.style.display = "none";
            defaultState.style.display = "flex";
        });
    }, 1000); // small delay before processing
});
updateGuestCount();