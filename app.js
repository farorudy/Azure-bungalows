const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const PORT = 8080;
const paypal = require('paypal-rest-sdk');

// Configuration PayPal
paypal.configure({
  'mode': 'sandbox', // ou 'live' en production
  'client_id': 'AFcWxV21C7fd0v3bYYYRCpSSRl31AKAsF3zYYsXjhXBQAT9kkmkwtoAu',
  'client_secret': '3K7LWLR6TKWUJAPV'
});
// === Fonction pour lire data.json ===
function getData() {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'), 'utf8'));
  } catch (err) {
    console.error("❌ Erreur lecture data.json:", err.message);
    return { bungalows: [], gallery: [], contact: {} };
  }
}

// === Middleware ===
app.use(express.static(path.join(__dirname))); // Sert /images, /css, etc.
app.use(express.urlencoded({ extended: true })); // Pour les formulaires
app.use(express.json()); // <-- Ajoute ceci pour accepter le JSON

// === Route principale — Page d'accueil ===
app.get('/', (req, res) => {
  const data = getData();
  const bungalows = data.bungalows || [];
  const gallery = data.gallery || [];
  const contact = data.contact || {};

  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Azure Bungalows – Évasion, nature et confort moderne</title>
  <meta name="description" content="Séjournez en Guadeloupe dans nos bungalows élégants, climatisés, avec jardin tropical." />

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />

  <!-- Styles personnalisés -->
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; }
    .font-display { font-family: 'Playfair Display', serif; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800">

  <!-- Header -->
  <header class="sticky top-0 z-50 bg-white/70 backdrop-blur border-b border-slate-200">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2 font-semibold">
        <span class="inline-flex h-9 w-9 rounded-full bg-sky-600 text-white items-center justify-center">A</span>
        <span class="text-lg">Azure Bungalows</span>
      </a>
      <nav class="hidden md:flex items-center gap-6 text-slate-700">
        <a href="#presentation" class="hover:text-slate-900">Présentation</a>
        <a href="#logements" class="hover:text-slate-900">Logements</a>
        <a href="#galerie" class="hover:text-slate-900">Galerie</a>
        <a href="/disponibilite" class="hover:text-slate-900">Disponibilités</a>
        <a href="/reserver" class="ml-2 px-4 py-2 rounded-full bg-sky-600 text-white hover:bg-sky-700">Réserver</a>
      </nav>
    </div>
  </header>

  <!-- Hero -->
  <section class="relative">
    <img src="/images/maison/hero.jpg" alt="Villa et jardin tropical" class="absolute inset-0 h-full w-full object-cover">
    <div class="absolute inset-0 bg-black/50"></div>
    <div class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 text-white">
      <h1 class="text-5xl font-bold">Évasion, nature & confort moderne</h1>
      <p class="mt-4 text-lg text-white/90">
        Séjournez au cœur de la Guadeloupe : bungalows élégants, jardin tropical, clim & Wi-Fi.
        Réservez en direct, sans frais de plateforme.
      </p>
      <a href="/reserver" class="mt-8 inline-block bg-sky-600 text-white px-6 py-3 rounded-lg">Réserver maintenant</a>
    </div>
  </section>

  <!-- Logements -->
  <section id="logements" class="py-16 bg-slate-50">
    <div class="mx-auto max-w-7xl px-4">
      <h2 class="text-2xl font-semibold mb-6">Nos bungalows</h2>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        ${bungalows.map(b => `
          <article class="rounded-2xl overflow-hidden border border-slate-200 bg-white">
            <img src="${b.image}" alt="${b.name}" class="w-full h-48 object-cover" />
            <div class="p-4">
              <h3 class="font-semibold">${b.name}</h3>
              <p class="text-sm text-slate-600 mt-1">${b.size}</p>
              <div class="mt-3 flex items-center justify-between">
                <span class="text-slate-900 font-medium">${b.price}</span>
                <a href="/reserver?bungalowId=${b.id}" class="text-sky-700 hover:underline">Réserver</a>
              </div>
            </div>
          </article>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Galerie -->
  <section id="galerie" class="py-16 sm:py-24 bg-white">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold">Galerie photos</h2>
        <p class="mt-4 text-lg text-slate-600">Quelques images de nos espaces et de l’environnement.</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        ${gallery.map(img => `
          <a href="${img}" target="_blank" class="group relative block rounded-xl overflow-hidden border border-slate-200 bg-white">
            <img src="${img}" alt="Photo Azure Bungalows" class="h-40 w-full object-cover transition-transform duration-200 group-hover:scale-105" />
            <div class="absolute inset-0 ring-1 ring-inset ring-black/5"></div>
          </a>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section id="contact" class="py-16 bg-slate-50">
    <div class="mx-auto max-w-7xl px-4">
      <div class="grid md:grid-cols-2 gap-10">
        <div>
          <h2 class="text-3xl font-bold">Nous contacter</h2>
          <p class="mt-4 text-slate-600">Une question ? Besoin d’un conseil pour organiser votre séjour ?</p>
          <ul class="mt-6 space-y-3 text-slate-700">
            <li><strong>Email：</strong> <a href="mailto:${contact.email}" class="text-sky-700 hover:underline">${contact.email}</a></li>
            <li><strong>Téléphone：</strong> ${contact.phone}</li>
            <li><strong>Adresse：</strong> ${contact.location}</li>
          </ul>
        </div>
        <form method="post" action="/contact" class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-slate-600 mb-1">Nom *</label>
              <input name="name" required class="w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-sky-600 focus:border-sky-600" />
            </div>
            <div>
              <label class="block text-sm text-slate-600 mb-1">Email *</label>
              <input type="email" name="email" required class="w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-sky-600 focus:border-sky-600" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm text-slate-600 mb-1">Sujet *</label>
              <input name="subject" required class="w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-sky-600 focus:border-sky-600" />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm text-slate-600 mb-1">Message *</label>
              <textarea name="message" rows="4" required class="w-full rounded-lg border-slate-300 focus:ring-2 focus:ring-sky-600 focus:border-sky-600"></textarea>
            </div>
          </div>
          <button class="mt-4 w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold">Envoyer</button>
        </form>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-slate-200 bg-white py-8 text-sm text-slate-600 text-center">
    <p>&copy; ${new Date().getFullYear()} Azure Bungalows – Tous droits réservés.</p>
  </footer>

</body>
</html>
  `);
});

// === Page de disponibilité ===
app.get('/disponibilite', (req, res) => {
  try {
    const data = getData(); // ← charge data.json
    const bungalows = Array.isArray(data.bungalows) ? data.bungalows : [];

    res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Disponibilités – Azure Bungalows</title>
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <a href="/" class="inline-block mb-6 text-sky-600 hover:underline">← Retour à l'accueil</a>
    
    <h1 class="text-3xl font-bold mb-8">📅 Disponibilités</h1>
    
    ${bungalows.length > 0 ? `
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        ${bungalows.map(b => `
          <div class="bg-white p-6 rounded-xl shadow border border-slate-200">
            <h2 class="text-xl font-semibold">${b.name}</h2>
            <p class="text-sm text-slate-600 mt-1">${b.size}</p>
            <p class="mt-4 text-slate-900 font-medium">${b.price}</p>
            <a href="/reserver?bungalowId=${b.id}" class="mt-4 inline-block w-full text-center py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
              Réserver
            </a>
          </div>
        `).join('')}
      </div>
    ` : `
      <p class="text-slate-600">Aucun bungalow disponible pour le moment.</p>
    `}
  </div>
</body>
</html>
    `);
  } catch (err) {
    console.error("❌ Erreur dans /disponibilite:", err.message);
    res.status(500).send(`
      <h1>Erreur serveur</h1>
      <p>Impossible d'afficher les disponibilités.</p>
      <pre>${err.message}</pre>
      <a href="/">← Retour à l'accueil</a>
    `);
  }
});
// === Formulaire de réservation ===
app.get('/reserver', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Réserver</title>
  <!-- CORRIGÉ : Suppression des espaces dans l'URL de Tailwind -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script
    src="https://www.paypal.com/sdk/js?client-id=BAAUvJgFr4L06Nvzei3b8rd_Xm4bKZAEKDlKp6rqVaElBqEJSjMsyvvqEfLBdHxG532FO98LspA5vqs3z8&components=hosted-buttons&disable-funding=venmo&currency=EUR"
    crossorigin="anonymous"
    async>
  </script>
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-800 py-12">
  <div class="max-w-md mx-auto px-4">
    <a href="/" class="inline-block mb-6 text-sky-600 hover:underline">← Retour</a>
    <h1 class="text-2xl font-bold mb-6">📝 Réserver un bungalow</h1>
    <form id="paypal-form">
      <!-- CORRIGÉ : Ajout de la récupération dynamique du bungalowId -->
      <input type="hidden" name="bungalowId" id="bungalowId" value="" />
      <div class="mb-4">
        <label class="block mb-1">Nom</label>
        <input name="name" required class="w-full border-slate-300 rounded-lg" />
      </div>
      <div class="mb-4">
        <label class="block mb-1">Email</label>
        <input type="email" name="email" required class="w-full border-slate-300 rounded-lg" />
      </div>
      <div class="mb-4">
        <label class="block mb-1">Dates souhaitées</label>
        <input name="dates" placeholder="ex: 10-15 juillet" required class="w-full border-slate-300 rounded-lg" />
      </div>
      <button type="submit" class="w-full py-3 bg-blue-600 text-white rounded-lg">
        💳 Payer avec PayPal
      </button>
    </form>
    <div id="paypal-container-H6FFK4SK96XQA" class="mt-4"></div>
    <script>
      // CORRIGÉ : Récupération du bungalowId depuis l'URL
      document.addEventListener('DOMContentLoaded', function() {
        const urlParams = new URLSearchParams(window.location.search);
        const bungalowId = urlParams.get('bungalowId') || '';
        document.getElementById('bungalowId').value = bungalowId;

        // Affichage du bouton PayPal Hosted Buttons si le script est chargé
        if (window.paypal && paypal.HostedButtons) {
          paypal.HostedButtons({
            hostedButtonId: "H6FFK4SK96XQA"
          }).render("#paypal-container-H6FFK4SK96XQA");
        }
      });
    </script>
  </div>

  <!-- Footer -->
  <div class="text-center mt-8 text-gray-600">
      <p>© 2023 Azure Bungalows. Tous droits réservés.</p>
  </div>
</div>
  `);
});

// === Créer un paiement PayPal ===
app.post('/create-paypal-payment', (req, res) => {
  try {
    // Votre logique PayPal ici
    console.log("✅ Requête reçue sur /create-paypal-payment");
    const { bungalowId, name, email, dates } = req.body;
    const data = getData();
    const bungalow = data.bungalows.find(b => b.id === bungalowId);

    if (!bungalow) {
      return res.status(404).json({ error: "Bungalow non trouvé." });
    }

    // Montant à payer (en fonction du bungalow et de la durée du séjour)
    const price = parseFloat(bungalow.price.replace(' €/nuit', '')).toFixed(2); // "130.00"
    const totalAmount = (price * 1).toFixed(2); // Prix pour 1 nuit

    // Création de la payment en utilisant l'API de PayPal
    paypal.payment.create({
      intent: 'sale',
      payer: {
        payment_method: 'paypal'
      },
      transactions: [{
        amount: {
          total: totalAmount,
          currency: 'EUR',
          details: {
            subtotal: totalAmount,
            shipping: "0.00",
            tax: "0.00"
          }
        },
        description: `Réservation bungalow ${bungalow.name} - ${dates}`,
        custom: JSON.stringify({ bungalowId, name, email, dates }) // Infos supplémentaires
      }],
      redirect_urls: {
        return_url: `${req.protocol}://${req.get('host')}/success-paypal?amount=${price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/cancel-paypal`
      }
    }, (error, payment) => {
      if (error) {
        console.error("Erreur lors de la création du paiement PayPal:", error);
        return res.status(500).json({ error: "Erreur serveur lors de la création du paiement." });
      }
      // Recherche des URLs d'approbation
      const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
      if (!approvalUrl) {
        return res.status(500).json({ error: "Erreur lors de la redirection vers PayPal." });
      }
      // Envoi de l'URL d'approbation au client
      res.json({ approvalUrl: approvalUrl.href });
    });
  } catch (err) {
    console.error("❌ Erreur:", err);
    res.status(500).json({ error: "Erreur interne" });
  }
});

// === Page de succès PayPal ===
app.get('/paypal-success', (req, res) => {
  const { paymentId, PayerID } = req.query;

  // On pourrait ici vérifier le paiement avec PayPal et enregistrer la réservation

  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Merci pour votre réservation</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-800 py-12">
  <div class="max-w-md mx-auto px-4">
    <a href="/" class="inline-block mb-6 text-sky-600 hover:underline">← Retour à l'accueil</a>
    <h1 class="text-2xl font-bold mb-4">✅ Merci pour votre réservation !</h1>
    <p class="mb-4">Votre paiement a été reçu. Vous allez recevoir un email de confirmation sous peu.</p>
    <p class="text-sm text-slate-500">ID de paiement : ${paymentId}</p>
  </div>
</body>
</html>
  `);
});

// === Page d'annulation PayPal ===
app.get('/paypal-cancel', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Réservation annulée</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-800 py-12">
  <div class="max-w-md mx-auto px-4">
    <a href="/" class="inline-block mb-6 text-sky-600 hover:underline">← Retour à l'accueil</a>
    <h1 class="text-2xl font-bold mb-4">❌ Réservation annulée</h1>
    <p class="mb-4">Votre réservation a été annulée. Si vous avez des questions, n'hésitez pas à nous contacter.</p>
  </div>
</body>
</html>
  `);
});

app.listen(8080, '127.0.0.1', () => {
  console.log('✅ Serveur Express démarré sur http://127.0.0.1:8080');
});