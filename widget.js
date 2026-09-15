// ============================================================
// Crypto Tracker — iPhone Home Screen widget (for the Scriptable app)
// Shows live BTC / ETH prices in PHP with 24h change.
//
// HOW TO USE:
// 1. Install the free "Scriptable" app from the App Store.
// 2. Open Scriptable, tap "+" to create a new script.
// 3. Paste this ENTIRE file into it. Name it "Crypto Tracker".
// 4. Go to your Home Screen, long-press an empty area, tap "+",
//    search "Scriptable", add a widget (Small or Medium).
// 5. Long-press the new widget, tap "Edit Widget",
//    choose Script = "Crypto Tracker".
// 6. Done. It refreshes automatically.
//
// To track different coins, edit the COINS list below
// (use CoinGecko ids: bitcoin, ethereum, solana, ripple, etc.).
// ============================================================

const COINS = [
  { id: "bitcoin",  sym: "BTC", color: new Color("#f7931a") },
  { id: "ethereum", sym: "ETH", color: new Color("#627eea") }
];

const PESO = "\u20b1";

async function fetchPrices() {
  const ids = COINS.map(c => c.id).join(",");
  const url = "https://api.coingecko.com/api/v3/simple/price?ids=" + ids +
              "&vs_currencies=php&include_24hr_change=true";
  const req = new Request(url);
  req.headers = { "Accept": "application/json" };
  return await req.loadJSON();
}

function fmt(n) {
  if (n == null || isNaN(n)) return "\u2014";
  return PESO + Math.round(n).toLocaleString("en-US");
}

async function buildWidget() {
  const w = new ListWidget();
  w.backgroundColor = new Color("#000000");
  w.setPadding(14, 14, 14, 14);

  // title
  const title = w.addText("Crypto Tracker");
  title.font = Font.semiboldSystemFont(12);
  title.textColor = new Color("#8e8e93");
  w.addSpacer(8);

  let data = {};
  let ok = true;
  try { data = await fetchPrices(); } catch (e) { ok = false; }

  if (!ok) {
    const err = w.addText("Could not load prices.");
    err.font = Font.systemFont(12);
    err.textColor = new Color("#ff6b6b");
    return w;
  }

  for (const c of COINS) {
    const d = data[c.id];
    if (!d) continue;

    const row = w.addStack();
    row.centerAlignContent();

    // colored dot
    const dot = row.addText("\u25CF");
    dot.font = Font.systemFont(10);
    dot.textColor = c.color;
    row.addSpacer(6);

    // symbol
    const sym = row.addText(c.sym);
    sym.font = Font.mediumSystemFont(14);
    sym.textColor = new Color("#f2f2f7");

    row.addSpacer();

    // price + change stacked
    const right = row.addStack();
    right.layoutVertically();

    const price = right.addText(fmt(d.php));
    price.font = Font.semiboldSystemFont(14);
    price.textColor = new Color("#f2f2f7");
    price.rightAlignText();

    const chg = d.php_24h_change;
    if (chg != null) {
      const up = chg >= 0;
      const ct = right.addText((up ? "\u25B2 +" : "\u25BC ") + chg.toFixed(2) + "%");
      ct.font = Font.systemFont(10);
      ct.textColor = up ? new Color("#34d399") : new Color("#ff6b6b");
      ct.rightAlignText();
    }

    w.addSpacer(8);
  }

  // last updated
  w.addSpacer(2);
  const upd = w.addText("Updated " + new Date().toLocaleTimeString());
  upd.font = Font.systemFont(9);
  upd.textColor = new Color("#5a5a5f");

  // refresh roughly every 15 minutes
  w.refreshAfterDate = new Date(Date.now() + 15 * 60 * 1000);
  return w;
}

const widget = await buildWidget();
if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  await widget.presentSmall();
}
Script.complete();
