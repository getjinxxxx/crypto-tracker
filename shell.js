/* shell.js — shared app chrome for every page.
 * 1) Overrides the gold theme -> orange/amber across the whole app (CSS variables).
 * 2) Injects a floating hamburger button + slide-out sidebar drawer with nav to all tools.
 * Non-destructive: it only ADDS a fixed button + overlay drawer; it never touches a page's
 * own markup or layout, so existing functionality is untouched.
 */
(function () {
  "use strict";
  if (window.__shellLoaded) return;
  window.__shellLoaded = true;

  // Which page am I on? (used to mark the active nav item)
  var FILE = (location.pathname.split("/").pop() || "home.html").toLowerCase();

  var NAV = [
    { group: "Main" },
    { href: "home.html", icon: "\u25A0", label: "Home" },
    { group: "Tools" },
    { href: "index.html", icon: "\uD83D\uDCB5", label: "Crypto Tracker" },
    { href: "signals.html", icon: "\uD83D\uDCC8", label: "Market Signals" },
    { href: "salary.html", icon: "\uD83D\uDCB0", label: "Salary" },
    { href: "debt.html", icon: "\uD83E\uDDFE", label: "Debt Tracker" },
    { href: "receivables.html", icon: "\uD83E\uDD1D", label: "Receivables" },
    { href: "soa.html", icon: "\uD83D\uDCC4", label: "Statement of Account" },
    { href: "itinerary.html", icon: "\u2708\uFE0F", label: "Itinerary" },
    { href: "kanban.html", icon: "\uD83D\uDCCB", label: "Kanban" },
    { group: "Account" },
    { href: "#lock", icon: "\uD83D\uDD12", label: "Lock" }
  ];

  // ---- 1) Theme override: gold -> orange. Injected LAST so it wins the cascade. ----
  var themeCss =
    /* shell chrome (periwinkle accent to match theme.css) */
    "#shellBtn{position:fixed;top:10px;left:10px;z-index:9000;width:40px;height:40px;border-radius:12px;" +
      "background:#1e2130;border:1px solid #2a2e40;color:#a9a8ff;font-size:19px;cursor:pointer;" +
      "display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(0,0,0,.5);}" +
    "#shellScrim{position:fixed;inset:0;z-index:8998;background:rgba(0,0,0,.55);display:none;}" +
    "#shellScrim.open{display:block;}" +
    "#shellNav{position:fixed;top:0;left:0;bottom:0;z-index:8999;width:255px;max-width:82vw;" +
      "background:#121319;border-right:1px solid #262a3a;padding:16px 12px;overflow-y:auto;" +
      "transform:translateX(-102%);transition:transform .2s ease;" +
      "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}" +
    "#shellNav.open{transform:translateX(0);box-shadow:0 0 40px rgba(0,0,0,.6);}" +
    "#shellNav .sh-brand{display:flex;align-items:center;gap:10px;padding:4px 8px 14px;color:#e8eaf2;}" +
    "#shellNav .sh-logo{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#8b8cf0,#b98bf0);" +
      "display:flex;align-items:center;justify-content:center;font-weight:800;color:#0b0b12;font-size:15px;}" +
    "#shellNav .sh-bname{font-weight:700;font-size:15px;}" +
    "#shellNav .sh-grp{color:#8b90a6;font-size:11px;text-transform:uppercase;letter-spacing:.6px;margin:14px 8px 6px;}" +
    "#shellNav a.sh-item{display:flex;align-items:center;gap:11px;padding:10px 11px;border-radius:11px;" +
      "color:#e8eaf2;text-decoration:none;font-size:14px;cursor:pointer;}" +
    "#shellNav a.sh-item:hover{background:#1e2130;}" +
    "#shellNav a.sh-item.active{background:rgba(139,140,240,.16);color:#a9a8ff;box-shadow:inset 0 0 0 1px rgba(139,140,240,.3);}" +
    "#shellNav a.sh-item .sh-ico{width:20px;text-align:center;font-size:15px;}" +
    "#shellNav .sh-close{position:absolute;top:12px;right:12px;background:none;border:none;color:#8b90a6;font-size:20px;cursor:pointer;}";

  function injectTheme() {
    // External stylesheet does the full component makeover (loaded last = wins cascade).
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "theme.css";
    document.head.appendChild(link);
    // Shell chrome styles (button/drawer) still injected inline.
    var s = document.createElement("style");
    s.id = "shellTheme";
    s.textContent = themeCss;
    document.head.appendChild(s);
  }

  function buildNav() {
    var html = '<button class="sh-close" id="shellClose" aria-label="Close">\u2715</button>' +
      '<div class="sh-brand"><div class="sh-logo">D</div><div class="sh-bname">My Dashboard</div></div>';
    NAV.forEach(function (n) {
      if (n.group) { html += '<div class="sh-grp">' + n.group + '</div>'; return; }
      var active = (n.href.toLowerCase() === FILE) ? " active" : "";
      html += '<a class="sh-item' + active + '" href="' + n.href + '"><span class="sh-ico">' + n.icon + '</span>' + n.label + '</a>';
    });
    var nav = document.createElement("nav");
    nav.id = "shellNav";
    nav.innerHTML = html;
    document.body.appendChild(nav);

    var scrim = document.createElement("div");
    scrim.id = "shellScrim";
    document.body.appendChild(scrim);

    var btn = document.createElement("button");
    btn.id = "shellBtn";
    btn.setAttribute("aria-label", "Menu");
    btn.innerHTML = "\u2630";
    document.body.appendChild(btn);

    function open() { nav.classList.add("open"); scrim.classList.add("open"); }
    function close() { nav.classList.remove("open"); scrim.classList.remove("open"); }
    btn.onclick = open;
    scrim.onclick = close;
    document.getElementById("shellClose").onclick = close;

    // Lock link: clear the shared unlock flag and reload.
    nav.querySelectorAll('a.sh-item').forEach(function (a) {
      if (a.getAttribute("href") === "#lock") {
        a.onclick = function (e) { e.preventDefault(); try { sessionStorage.removeItem("ctUnlocked"); } catch (x) {} location.reload(); };
      } else {
        a.addEventListener("click", close);
      }
    });
  }

  function init() {
    injectTheme();
    buildNav();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
