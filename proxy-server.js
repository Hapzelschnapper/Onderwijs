// proxy-server.js
// ============================================================
// Minimale lokale proxy om de CORS-blokkade van DeepSeek (of een
// andere OpenAI-compatible API) te omzeilen bij gebruik van de
// ondersteuningsniveau-wizard buiten Claude.
//
// Waarom nodig? Browsers mogen van DeepSeek zelf geen directe
// aanroepen doen (CORS). Deze proxy draait op jouw eigen computer,
// ontvangt het verzoek van de wizard-app, en stuurt het namens jou
// door naar DeepSeek — dat is wél toegestaan (server-naar-server).
//
// GEBRUIK:
//   1. Zorg dat Node.js geïnstalleerd is (nodejs.org) — geen
//      andere installatie nodig, dit script gebruikt alleen
//      ingebouwde Node-modules.
//   2. Vul hieronder je DeepSeek API-sleutel in bij DEEPSEEK_API_KEY,
//      OF zet 'm als omgevingsvariabele voordat je start:
//        macOS/Linux:  export DEEPSEEK_API_KEY=sk-jouw-sleutel
//        Windows (cmd): set DEEPSEEK_API_KEY=sk-jouw-sleutel
//   3. Start de proxy in een terminal:
//        node proxy-server.js
//      Laat dit venster openstaan zolang je de wizard gebruikt.
//   4. Open de wizard-app (ondersteuningsniveau-wizard.html) en
//      zet in het Instellingen-tabblad:
//        Provider:     Aangepast endpoint
//        Endpoint URL: http://localhost:3001/chat
//        Modelnaam:    deepseek-chat
//        API-sleutel:  mag je leeg laten of iets invullen — wordt
//                      genegeerd, de proxy gebruikt de sleutel
//                      die hieronder/via de omgevingsvariabele is
//                      ingesteld.
// ============================================================

const http = require('http');
const https = require('https');

const PORT = 3001;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'VUL_HIER_JE_DEEPSEEK_SLEUTEL_IN';
const DEEPSEEK_HOST = 'api.deepseek.com';
const DEEPSEEK_PATH = '/chat/completions';

if (DEEPSEEK_API_KEY === 'VUL_HIER_JE_DEEPSEEK_SLEUTEL_IN') {
  console.warn('⚠️  Let op: je hebt nog geen DeepSeek API-sleutel ingevuld in dit script (of als DEEPSEEK_API_KEY omgevingsvariabele).');
}

const server = http.createServer((req, res) => {
  // CORS-headers zodat de browser (waar de wizard-app in draait) deze proxy mag aanroepen.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/chat') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Gebruik POST /chat' }));
    return;
  }

  let body = '';
  req.on('data', chunk => { body += chunk; });
  req.on('end', () => {
    const options = {
      hostname: DEEPSEEK_HOST,
      path: DEEPSEEK_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const upstreamReq = https.request(options, upstreamRes => {
      let data = '';
      upstreamRes.on('data', chunk => { data += chunk; });
      upstreamRes.on('end', () => {
        res.writeHead(upstreamRes.statusCode, { 'Content-Type': 'application/json' });
        res.end(data);
      });
    });

    upstreamReq.on('error', err => {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Proxy kon DeepSeek niet bereiken: ' + err.message }));
    });

    upstreamReq.write(body);
    upstreamReq.end();
  });
});

server.listen(PORT, () => {
  console.log(`✅ Proxy draait op http://localhost:${PORT}/chat`);
  console.log('   Zet dit adres in de wizard-app als "API-endpoint URL".');
  console.log('   Laat dit venster open staan zolang je de wizard gebruikt.');
});
