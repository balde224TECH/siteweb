form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Récupérer les valeurs du formulaire
    const productName = document.getElementById('productName').value;
    const whatsappNumber = document.getElementById('whatsappNumber').value;
    const productID = document.getElementById('productID').value;
    const customerNumber = document.getElementById('customerNumber').value;
    const comment = document.getElementById('comment').value;

    // Vérifier que tous les champs sont remplis
    if (!productName || !whatsappNumber || !productID || !customerNumber) {
        showAlert('Veuillez remplir tous les champs obligatoires du formulaire.', 'danger');
        return;
    }

    // Afficher un indicateur de chargement
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
    submitBtn.disabled = true;

    try {
        // 🛠️ Envoi vers ton serveur Express via fetch API
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productName,
                productID,
                customerNumber,
                whatsappNumber,
                comment,
                serviceType: 'aipod'
            })
        });

        const data = await response.json();

        if (data.success) {
            showAlert('Commande envoyée! Nous vous contacterons bientôt.', 'success');
            form.reset();
        } else {
            showAlert(`Erreur: ${data.error || 'Une erreur est survenue'}`, 'danger');
        }
    } catch (error) {
        console.error('Erreur:', error);
        showAlert('Une erreur réseau est survenue. Veuillez vérifier votre connexion et réessayer.', 'danger');
    } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});
