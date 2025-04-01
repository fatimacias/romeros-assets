// script.js

// Example: Code to update modal image source (if using a modal for gallery)
const galleryModal = document.getElementById('galleryModal');
if (galleryModal) {
  galleryModal.addEventListener('show.bs.modal', function (event) {
    const triggerImage = event.relatedTarget;
    const imageSrc = triggerImage.getAttribute('data-bs-image');
    const modalImage = document.getElementById('modalImage');
    modalImage.src = imageSrc;
  });
}

const form = document.getElementById('form');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(form);
  const hCaptcha = form.querySelector('textarea[name=h-captcha-response]').value;

    if (!hCaptcha) {
        e.preventDefault();
        alert("Please fill out captcha field")
        return
    }

  // ✅ IMPORTANTE: agregar tu access_key
  formData.append("access_key", "615b9bb3-75d8-4128-bdfa-3a486a7d2cea");

  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: json
  })
  .then(async (response) => {
    const json = await response.json();

    if (response.status === 200) {
const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
confirmationModal.show();

    } else {
      alert(json.message || "Something went wrong!");
    }
  })
  .catch((error) => {
    console.error(error);
    alert("Something went wrong while sending the message.");
  })
  .finally(() => {
    form.reset();
    hcaptcha.reset(); // 👈 Resetea el captcha visual
  });
});

const confirmationModalElement = document.getElementById('confirmationModal');

confirmationModalElement.addEventListener('hidden.bs.modal', function () {
  // Scroll to top smoothly after modal closes
  window.scrollTo({ top: 0, behavior: "smooth" });
});