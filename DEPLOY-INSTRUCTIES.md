# Wizard hosten via GitHub Pages

Goed nieuws: dit is eenvoudiger dan eerder beschreven. Zolang je het bestand
host via een echt `https://`-adres (GitHub Pages volstaat), werkt elke
provider (DeepSeek, Claude eigen sleutel) gewoon rechtstreeks vanuit de
browser — **geen aparte proxy of tweede platform nodig.**

## Waarom eerder wél "Failed to fetch"?

Als je het HTML-bestand lokaal opent door erop te dubbelklikken, staat er
`file://...` in de adresbalk in plaats van `https://...`. Browsers behandelen
zo'n lokaal geopende pagina als een soort "leeg" origin en blokkeren daar
fetch-aanroepen naar externe API's vandaan, ongeacht wat de API zelf
toestaat. Zodra de pagina via een echte `https://`-server draait (zoals
GitHub Pages), verdwijnt die beperking vanzelf.

## Stap 1 — Repo klaarzetten

Zet `ondersteuningsniveau-wizard.html` (hernoem naar `index.html`) in je
GitHub-repo. Verder is er niets nodig — geen `api/`-map, geen
build-configuratie.

## Stap 2 — GitHub Pages aanzetten

1. Ga in je repo naar **Settings > Pages**
2. Bij "Source": kies **Deploy from a branch** → branch `main`, map
   `/ (root)` → **Save**
3. Na een paar minuten is de wizard bereikbaar op
   `https://jouwgebruikersnaam.github.io/jouw-repo/`

## Stap 3 — Sleutel invullen

Open je live wizard, ga naar **Instellingen**:

- **DeepSeek**: kies "DeepSeek" als provider, vul je DeepSeek API-sleutel in
  (endpoint en modelnaam staan al goed ingevuld)
- **Claude met eigen sleutel**: kies "Claude (eigen sleutel)", vul je
  Anthropic API-sleutel in (via console.anthropic.com)

Klaar. Geen Vercel, geen proxy-server, geen environment variables.

## Let op: sleutel is zichtbaar in de browser

Zoals ook in je eigen Turkse-woorden-trainer: de sleutel die je in
Instellingen invult, is zichtbaar in het netwerkverkeer van de browser van
iedereen die de pagina gebruikt. Prima voor persoonlijk gebruik of een
kleine kring vertrouwde collega's. Wil je de pagina breder delen, zet dan
een uitgavenlimiet op die sleutel in het dashboard van de betreffende
provider.

## Optioneel: proxy-server.js / api/chat.js

Deze bestanden staan er nog bij voor het geval je ooit een scenario tegenkomt
waarin een provider tóch CORS blokkeert vanaf een echte `https://`-host (in
tegenstelling tot het `file://`-probleem hierboven) — dan is een proxy alsnog
de oplossing. Voor het gewone gebruik van deze wizard is dat echter niet
nodig.
