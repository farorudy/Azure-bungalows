app.post('/submit-reservation', (req, res) => {
  const { name, email, bungalowId, dates } = req.body;

  console.log("📩 Nouvelle demande de réservation :", { name, email, bungalowId, dates });

  res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Réservation envoyée</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-800 text-center py-20">
  <div class="max-w-md mx-auto px-4">
    <h1 class="text-3xl font-bold text-emerald-600 mb-4">✅ Demande envoyée !</h1>
    <p>Merci <strong>${name}</strong>, nous vous répondrons sous 24h à <strong>${email}</strong>.</p>
    <a href="/" class="mt-6 inline-block px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
      ← Retour à l'accueil
    </a>
  </div>
</body>
</html>
  `);
});
