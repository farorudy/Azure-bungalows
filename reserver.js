app.get('/reserver', (req, res) => {
  const lang = req.query.lang || 'fr';
  const bungalowId = req.query.bungalowId;

  res.send(`
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <title>Réserver un bungalow</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-800 py-12">
  <div class="max-w-3xl mx-auto px-4">
    <a href="/" class="inline-block mb-6 text-sky-600 hover:underline">← Retour à l'accueil</a>
    
    <h1 class="text-3xl font-bold mb-6">📝 Réserver un bungalow</h1>
    
    <form action="/submit-reservation" method="POST" class="bg-white p-6 rounded-xl shadow">
      <input type="hidden" name="bungalowId" value="${bungalowId || ''}">

      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 mb-1">Nom complet</label>
        <input type="text" name="name" required class="w-full border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600">
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
        <input type="email" name="email" required class="w-full border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600">
      </div>

      <div class="mb-4">
        <label class="block text-sm font-medium text-slate-700 mb-1">Dates souhaitées</label>
        <input type="text" name="dates" placeholder="ex: 10-15 juillet" required class="w-full border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-600">
      </div>

      <button type="submit" class="w-full py-3 bg-sky-600 text-white font-medium rounded-lg hover:bg-sky-700">
        Envoyer la demande
      </button>
    </form>
  </div>
<form id="paypal-form">
  <input type="hidden" name="bungalowId" value="${bungalowId}" />
  <input type="hidden" name="name" value="${name}" />
  <input type="hidden" name="email" value="${email}" />
  <input type="hidden" name="dates" value="${dates}" />

  <button type="submit" class="w-full py-3 bg-blue-600 text-white rounded-lg">
    Payer avec PayPal
  </button>
</form>

<script>
  document.getElementById('paypal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const response = await fetch('/create-paypal-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.redirect) {
      window.location.href = result.redirect;
    } else {
      alert("Erreur de paiement");
    }
  });
</script>
</body>
</html>
  `);
});
