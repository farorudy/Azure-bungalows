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
  const bungalowId = req.query.bungalowId;
  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Réserver</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-800 py-12">
  <div class="max-w-md mx-auto px-4">
    <a href="/" class="inline-block mb-6 text-sky-600 hover:underline">← Retour</a>
    <h1 class="text-2xl font-bold mb-6">📝 Réserver un bungalow</h1>
    <form method="post" action="/submit-reservation" class="bg-white p-6 rounded-xl shadow">
      <input type="hidden" name="bungalowId" value="${bungalowId || ''}" />
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
      <button type="submit" class="w-full py-3 bg-sky-600 text-white rounded-lg">Envoyer la demande</button>
    </form>
  </div>
</body>
</html>
  `);
});

// === Traitement du formulaire ===
app.post('/submit-reservation', (req, res) => {
  const { name, email, bungalowId, dates } = req.body;
  console.log("📩 Demande de réservation :", { name, email, bungalowId, dates });
  res.send(`
    <h1>✅ Demande envoyée !</h1>
    <p>Merci ${name}, nous vous répondrons sous 24h.</p>
    <a href="/">← Retour à l'accueil</a>
  `);
});
app.post('/create-paypal-payment', (req, res) => {
  const { bungalowId, name, email, dates } = req.body;

  const data = getData();
  const bungalow = data.bungalows.find(b => b.id == bungalowId);

  if (!bungalow) {
    return res.status(400).send('Bungalow non trouvé');
  }

  // Prix en centimes → euros (ex: 130 €)
  const price = parseFloat(bungalow.price.replace(' €/nuit', '')) * 100; // 13000 centimes

  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": `${req.protocol}://${req.get('host')}/success-paypal`,
      "cancel_url": `${req.protocol}://${req.get('host')}/cancel-paypal`
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": bungalow.name,
          "sku": bungalow.id,
          "price": price.toFixed(2),
          "currency": "EUR",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "EUR",
        "total": price.toFixed(2)
      },
      "description": `Réservation du ${dates} pour ${bungalow.name}`
    }]
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.error("❌ Erreur PayPal:", error);
      res.status(500).send("Erreur de paiement");
    } else {
      // Redirige vers l’URL PayPal
      for (let link of payment.links) {
        if (link.rel === 'approval_url') {
          return res.json({ redirect: link.href });
        }
      }
      res.status(500).send("Impossible de générer le lien PayPal");
    }
  });
});
app.get('/reserved', (req, res) => {
  res.send(`
    <h1>✅ Réservation confirmée !</h1>
    <p>Merci, nous vous répondrons sous 24h.</p>
    <a href="/">← Retour à l'accueil</a>
  `);
});
// === Formulaire de contact ===
app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log("📩 Message reçu :", { name, email, subject, message });
  res.send(`
    <h1>Merci ${name} !</h1>
    <p>Nous vous répondrons sous 24h à ${email}.</p>
    <a href="/">← Retour à l'accueil</a>
  `);
});
app.post('/create-paypal-payment', (req, res) => {
  const { bungalowId, name, email, dates } = req.body;

  const data = getData();
  const bungalow = data.bungalows.find(b => b.id == bungalowId);

  if (!bungalow) {
    return res.status(400).send('Bungalow non trouvé');
  }

  // Prix en centimes → euros (ex: 130 €)
  const price = parseFloat(bungalow.price.replace(' €/nuit', '')) * 100; // 13000 centimes

  const create_payment_json = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": `${req.protocol}://${req.get('host')}/success-paypal`,
      "cancel_url": `${req.protocol}://${req.get('host')}/cancel-paypal`
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": bungalow.name,
          "sku": bungalow.id,
          "price": price.toFixed(2),
          "currency": "EUR",
          "quantity": 1
        }]
      },
      "amount": {
        "currency": "EUR",
        "total": price.toFixed(2)
      },
      "description": `Réservation du ${dates} pour ${bungalow.name}`
    }]
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.error("❌ Erreur PayPal:", error);
      res.status(500).send("Erreur de paiement");
    } else {
      // Redirige vers l’URL PayPal
      for (let link of payment.links) {
        if (link.rel === 'approval_url') {
          return res.json({ redirect: link.href });
        }
      }
      res.status(500).send("Impossible de générer le lien PayPal");
    }
  });
});
app.get('/success-paypal', (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
      "amount": {
        "currency": "EUR",
        "total": "130.00" // Tu peux le rendre dynamique
      }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
    if (error) {
      console.error("❌ Échec du paiement:", error);
      res.send(`
        <h1>❌ Paiement échoué</h1>
        <p>Une erreur est survenue lors de la confirmation.</p>
        <a href="/">← Retour à l'accueil</a>
      `);
    } else {
      console.log("✅ Paiement réussi:", payment);
      res.send(`
        <h1>✅ Paiement confirmé !</h1>
        <p>Merci, votre réservation est validée.</p>
        <a href="/">← Retour à l'accueil</a>
      `);
    }
  });
});

app.get('/cancel-paypal', (req, res) => {
  res.send(`
    <h1>❌ Paiement annulé</h1>
    <p>Vous pouvez réessayer quand vous voulez.</p>
    <a href="/">← Retour à l'accueil</a>
  `);
});
// === Démarrer le serveur ===
app.listen(PORT, '127.0.0.1', () => {
  console.log(`✅ Serveur Express démarré sur http://127.0.0.1:${PORT}`);
});
