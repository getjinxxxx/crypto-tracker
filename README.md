# Crypto Holdings Tracker

Simpleng BTC / ETH holdings tracker na may:

- Checkbox per row para i-mark ang **abang** entries (struck-through = naghihintay bumagsak ang presyo)
- Auto-computed totals: Active vs Abang per asset, plus grand total sa PHP
- Live market prices (BTC/ETH sa PHP at USD) gamit ang [CoinGecko API](https://www.coingecko.com/en/api)
- Auto-save sa device mo (localStorage) — hindi mawawala ang entries kahit isara mo

Isang file lang ito: `index.html`. Buksan mo lang sa kahit anong browser.

## Paano i-publish online (para gumana ang live prices at ma-access sa iPhone)

### Option A — Netlify Drop (pinakamabilis, walang account kailangan)
1. Pumunta sa https://app.netlify.com/drop
2. I-drag ang buong `Crypto Tracker` folder papunta sa page
3. Bibigyan ka ng live URL agad (hal. `https://random-name.netlify.app`)
4. Buksan ang URL na iyon sa Safari/Chrome sa iPhone mo

### Option B — GitHub Pages (permanent, libre)
1. Gumawa ng bagong repo sa GitHub (hal. `crypto-tracker`)
2. I-push ang folder na ito
3. Repo Settings → Pages → Source = `main` branch, root folder
4. Ang site mo: `https://<username>.github.io/crypto-tracker/`

## Local testing
```
npx serve .
```
Tapos buksan ang naka-print na `http://localhost:3000` sa browser.
