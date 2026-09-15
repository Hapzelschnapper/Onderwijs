// api/chat.js
// ============================================================
// Vercel serverless function die als proxy dient naar DeepSeek.
// Los een CORS-probleem op: DeepSeek staat geen directe aanroepen
// vanuit de browser toe, dus deze functie doet dat namens jou,
// server-naar-server.
//
// DEPLOYEN (samen met de statische wizard in dezelfde GitHub-repo):
//   1. Zet dit bestand op het pad  api/chat.js  in je GitHub-repo
//      (naast bijv. index.html met de wizard).
//   2. Ga naar vercel.com, log in met je GitHub-account, en
//      importeer deze repo als nieuw project ("Add New... > Project").
//      Vercel herkent automatisch dat api/chat.js een serverless
//      functie is — je hoeft verder niets te configureren.
//   3. Voeg in het Vercel-dashboard, onder
//      Project Settings > Environment Variables, een variabele toe:
//         Naam:   DEEPSEEK_API_KEY
//         Waarde: jouw DeepSeek API-sleutel
//      NOOIT de sleutel in dit bestand zelf zetten als je een
//      publieke GitHub-repo gebruikt.
//   4. Na deploy krijg je een URL zoals:
//         https://jouw-project.vercel.app/api/chat
//      Vul dat in de wizard-app (Instellingen-tabblad) in als
//      "API-endpoint URL", met modelnaam bijv. deepseek-chat.
//      Het veld "API-sleutel" in de wizard mag je leeg laten of
//      iets willekeurigs invullen — die wordt genegeerd, de sleutel
//      komt uit de Vercel environment variable.
//
// Elke keer dat je naar GitHub pusht, deployt Vercel automatisch
// opnieuw — zowel de statische wizard als deze functie.
// ============================================================

export default async function handler(req, res) {
  // CORS-headers zodat de browser (waar de wizard in draait) deze functie mag aanroepen.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Gebruik POST' });
    return;
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'DEEPSEEK_API_KEY ontbreekt. Zet deze als environment variable in het Vercel-dashboard.' });
    return;
  }

  try {
    const upstreamResponse = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });

    const data = await upstreamResponse.json();
    res.status(upstreamResponse.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Proxy kon DeepSeek niet bereiken: ' + err.message });
  }
}
