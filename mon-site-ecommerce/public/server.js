require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const TelegramBot = require('node-telegram-bot-api');

// Initialisation de l'application Express
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuration du bot Telegram
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const bot = new TelegramBot(botToken, { polling: false });

// Route principale
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'running',
    message: 'API Sanoussy en ligne',
    endpoints: [
      'POST /api/order',
      'POST /api/contact'
    ]
  });
});

// Routes API
app.post('/api/order', async (req, res) => {
  try {
    const { productName, productID, customerNumber, whatsappNumber, comment } = req.body;

    // Validation des champs obligatoires
    if (!productName || !productID || !customerNumber) {
      return res.status(400).json({ 
        error: 'Veuillez remplir tous les champs obligatoires' 
      });
    }

    // Formatage du message pour Telegram
    const message = `🛍 Nouvelle commande:\n\n` +
                   `📦 Produit: ${productName}\n` +
                   `🔖 ID: ${productID}\n` +
                   `📱 Téléphone: ${customerNumber}\n` +
                   `📲 WhatsApp: ${whatsappNumber || 'Non fourni'}\n` +
                   `💬 Message: ${comment || 'Aucun message supplémentaire'}`;

    // Envoi du message via Telegram
    await bot.sendMessage(chatId, message);

    res.status(200).json({ 
      success: true, 
      message: 'Commande envoyée avec succès' 
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ 
      error: 'Une erreur est survenue lors de l\'envoi de la commande' 
    });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation des champs obligatoires
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        error: 'Veuillez remplir tous les champs obligatoires' 
      });
    }

    // Formatage du message pour Telegram
    const telegramMessage = `📩 Nouveau message de contact\n\n` +
                          `👤 Nom: ${name}\n` +
                          `📧 Email: ${email}\n` +
                          `📌 Sujet: ${subject}\n` +
                          `💬 Message:\n${message}`;

    // Envoi du message via Telegram
    await bot.sendMessage(chatId, telegramMessage);

    res.status(200).json({ 
      success: true, 
      message: 'Message envoyé avec succès' 
    });
  } catch (error) {
    console.error('Erreur:', error);
    res.status(500).json({ 
      error: 'Une erreur est survenue lors de l\'envoi du message' 
    });
  }
});

// Gestion des erreurs
app.use((req, res, next) => {
  res.status(404).json({ 
    error: 'Endpoint non trouvé' 
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erreur interne du serveur' 
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
