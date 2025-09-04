app.get('/reserved', (req, res) => {
  const lang = req.query.lang || 'fr';
  res.send(`
    <h1>✅ Réservation confirmée !</h1>
    <p>Merci, votre séjour est réservé.</p>
    <a href="/">← Retour</a>
  `);
});
