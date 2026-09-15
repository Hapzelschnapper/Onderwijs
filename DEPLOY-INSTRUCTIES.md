# Wizard hosten via GitHub

Je hebt twee onderdelen die *apart* gehost moeten worden, omdat GitHub Pages
alleen statische bestanden serveert (geen server-code kan draaien):

| Onderdeel | Wat het is | Waar het draait |
|---|---|---|
| `ondersteuningsniveau-wizard.html` | De wizard zelf (HTML/CSS/JS) | GitHub Pages |
| `api/chat.js` | Proxy naar DeepSeek (lost CORS op) | Vercel (gratis) |

## Stap 1 — Repo klaarzetten

Zet in je GitHub-repo:
```
jouw-repo/
├── index.html          (hernoem de wizard hiernaar toe, of laat als is)
└── api/
    └── chat.js
```

## Stap 2 — GitHub Pages aanzetten (voor de wizard)

1. Ga in je repo naar **Settings > Pages**
2. Kies bij "Source" de branch waar de bestanden op staan (meestal `main`)
3. Na een paar minuten is de wizard bereikbaar op
   `https://jouwgebruikersnaam.github.io/jouw-repo/`

## Stap 3 — Vercel koppelen (voor de proxy)

1. Ga naar [vercel.com](https://vercel.com) en log in met je GitHub-account
2. Klik **Add New... > Project** en importeer dezelfde repo
3. Vercel herkent `api/chat.js` automatisch als serverless functie —
   verder hoef je niets aan te passen in de build-instellingen
4. Ga naar **Project Settings > Environment Variables** en voeg toe:
   - Naam: `DEEPSEEK_API_KEY`
   - Waarde: jouw DeepSeek API-sleutel
5. Klik **Deploy**. Je krijgt een URL zoals `https://jouw-project.vercel.app`

## Stap 4 — Wizard instellen

Open de wizard (via GitHub Pages), ga naar het **Instellingen**-tabblad:

- Provider: **Aangepast endpoint**
- Endpoint URL: `https://jouw-project.vercel.app/api/chat`
- Modelnaam: `deepseek-chat`
- API-sleutel: mag leeg/willekeurig — wordt genegeerd, de proxy gebruikt
  de sleutel uit de Vercel environment variable

## Belangrijk over veiligheid

- Zet je DeepSeek-sleutel **nooit** rechtstreeks in `api/chat.js` als je
  een publieke GitHub-repo gebruikt — gebruik altijd de environment
  variable in Vercel.
- Elke keer dat je naar GitHub pusht, deployt Vercel automatisch opnieuw.
- Wil je liever alles privé testen zonder hosting? Gebruik dan
  `proxy-server.js` lokaal met Node.js (zie de comments in dat bestand).
