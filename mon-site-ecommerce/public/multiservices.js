document.addEventListener('DOMContentLoaded', function() {
    // Form submission for Telegram
    const problemForm = document.getElementById('problemForm');
    problemForm.addEventListener('submit', function(e) {
        e.preventDefault();
        sendProblem('telegram');
    });
});

function sendViaWhatsApp() {
    sendProblem('whatsapp');
}

fetch('/api/service-request', { // Utilisez une route différente si nécessaire
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name,
    phone,
    serviceType, // Type de service technique
    problem: problem, // Description du problème
    serviceCategory: 'tech' // Catégorie de service
  })
})
function sendProblem(service) {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const serviceType = document.getElementById('service').value;
    const problem = document.getElementById('problem').value;
    
    if(!name || !phone || !serviceType || !problem) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    const message = `🔧 *Demande de service TechSolution* 🔧\n\n` +
                   `👤 *Nom:* ${name}\n` +
                   `📞 *Téléphone:* ${phone}\n` +
                   `🛠 *Service demandé:* ${serviceType}\n\n` +
                   `❗ *Description du problème:*\n${problem}\n\n` +
                   `Nous vous contacterons rapidement pour une solution!`;
    
    const encodedMessage = encodeURIComponent(message);
    
    if(service === 'telegram') {
        window.location.href = `https://t.me/yourtelegram?text=${encodedMessage}`;
    } else {
        window.location.href = `https://wa.me/224664278708?text=${encodedMessage}`;
    }
}
