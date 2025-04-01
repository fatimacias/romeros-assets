document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const confirmationModalElement = document.getElementById('confirmationModal');
  const galleryModal = document.getElementById('galleryModal');

  // Mostrar imagen en el modal de galería (si se usa)
  if (galleryModal) {
    galleryModal.addEventListener('show.bs.modal', function (event) {
      const triggerImage = event.relatedTarget;
      const imageSrc = triggerImage.getAttribute('data-bs-image');
      const modalImage = document.getElementById('modalImage');
      modalImage.src = imageSrc;
    });
  }

  // Volver al top al cerrar el modal de confirmación
  if (confirmationModalElement) {
    confirmationModalElement.addEventListener('hidden.bs.modal', function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function initializeAddressAutocomplete() {
    if (addressInput && window.google && google.maps && google.maps.places) {
      const autocomplete = new google.maps.places.Autocomplete(addressInput, {
        types: ['address'],
        componentRestrictions: { country: 'us' }
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log("Dirección seleccionada:", place.formatted_address);
      });
    }
  }

  initializeAddressAutocomplete(); // ← se ejecuta solo si Google está presente

  // Envío del formulario
  if (form) {
    const accessKeyMeta = document.querySelector('meta[name="web3forms-access-key"]');
    const accessKey = accessKeyMeta ? accessKeyMeta.content : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const formData = new FormData(form);
      const hCaptchaValue = form.querySelector('textarea[name=h-captcha-response]')?.value;

      if (!hCaptchaValue) {
        alert("Please complete the captcha.");
        return;
      }

      formData.append("access_key", accessKey);

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
            const confirmationModal = new bootstrap.Modal(confirmationModalElement);
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
          if (typeof hcaptcha !== 'undefined') {
            hcaptcha.reset();
          }
        });
    });
  }
});
