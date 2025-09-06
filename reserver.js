app.get('/reserver', (req, res) => {
  const lang = req.query.lang || 'fr';
  const bungalowId = req.query.bungalowId || '';

  res.send(`
<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <title>Réserver un bungalow</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script
    src="https://www.paypal.com/sdk/js?client-id=BAAUvJgFr4L06Nvzei3b8rd_Xm4bKZAEKDlKp6rqVaElBqEJSjMsyvvqEfLBdHxG532FO98LspA5vqs3z8&components=hosted-buttons&disable-funding=venmo&currency=EUR"
    crossorigin="anonymous"
    async>
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-800 py-12">
  <div class="max-w-3xl mx-auto px-4">
    <a href="/" class="inline-block mb-6 text-sky-600 hover:underline">← Retour à l'accueil</a>
    
    <h1 class="text-3xl font-bold mb-6">📝 Réserver un bungalow</h1>
    
    <form id="reservation-form" class="bg-white p-6 rounded-xl shadow">
      <input type="hidden" name="bungalowId" value="${bungalowId}">
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

    <div class="mt-8">
      <h2 class="text-xl font-semibold mb-4">Ou payez directement avec PayPal :</h2>
      <form id="paypal-form">
        <input type="hidden" name="bungalowId" value="${bungalowId}" />
        <input type="hidden" name="name" id="paypal-name" />
        <input type="hidden" name="email" id="paypal-email" />
        <input type="hidden" name="dates" id="paypal-dates" />
        <button type="submit" class="w-full py-3 bg-blue-600 text-white rounded-lg">
          Payer avec PayPal
        </button>
      </form>
      <div id="paypal-container-H6FFK4SK96XQA" class="mt-4"></div>
    </div>
  </div>

<script>
  // Synchronise les champs du formulaire principal avec le formulaire PayPal
  const resForm = document.getElementById('reservation-form');
  resForm.addEventListener('input', () => {
    document.getElementById('paypal-name').value = resForm.elements['name'].value;
    document.getElementById('paypal-email').value = resForm.elements['email'].value;
    document.getElementById('paypal-dates').value = resForm.elements['dates'].value;
  });

  // Affichage du bouton PayPal Hosted Buttons si le script est chargé
  document.addEventListener('DOMContentLoaded', function() {
    if (window.paypal && paypal.HostedButtons) {
      paypal.HostedButtons({
        hostedButtonId: "H6FFK4SK96XQA"
      }).render("#paypal-container-H6FFK4SK96XQA");
    }
  });

  document.getElementById('paypal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('/create-paypal-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (result.redirect) {
        window.location.href = result.redirect;
      } else if (result.approvalUrl) {
        window.location.href = result.approvalUrl;
      } else {
        alert("Erreur de paiement");
      }
    } catch (error) {
      alert("Erreur réseau ou serveur.");
    }
  });
</script>
</body>
</html>
  `);
});
