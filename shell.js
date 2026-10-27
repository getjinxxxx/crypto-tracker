/* shell.js — shared app chrome for every page.
 * 1) Loads theme.css (soft dark makeover) and injects shell chrome styles.
 * 2) Injects a floating menu button + slide-out sidebar drawer with nav to all tools.
 * 3) Hosts the "Update available" action inside the drawer (no fixed footer banner).
 * 4) Hides each page's own back/Home link (the drawer has Home) and footer update banners.
 * Non-destructive: only ADDS a button + overlay drawer; never rewrites a page's markup.
 * No emoji — text labels only, for a professional look.
 */
(function () {
  "use strict";
  if (window.__shellLoaded) return;
  window.__shellLoaded = true;

  var FILE = (location.pathname.split("/").pop() || "home.html").toLowerCase();
  var APP_VERSION = 143; // keep in sync with version.json

  var NAV = [
    { group: "Main" },
    { href: "home.html", label: "Home" },
    { group: "Tools" },
    { href: "index.html", label: "Crypto Tracker" },
    { href: "signals.html", label: "Market Signals" },
    { href: "salary.html", label: "Salary" },
    { href: "debt.html", label: "Debt Tracker" },
    { href: "receivables.html", label: "Receivables" },
    { href: "soa.html", label: "Statement of Account" },
    { href: "itinerary.html", label: "Itinerary" },
    { href: "kanban.html", label: "Kanban" },
    { group: "Account" },
    { href: "#lock", label: "Lock" }
  ];

  var themeCss =
    "#shellBtn{position:fixed;top:12px;left:12px;z-index:9000;width:44px;height:44px;border-radius:12px;" +
      "background:#1e2130;border:1px solid #2a2e40;color:#cfcffb;cursor:pointer;" +
      "display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(0,0,0,.5);padding:0;}" +
    "#shellBtn span{display:block;width:18px;height:2px;background:#cfcffb;border-radius:2px;position:relative;}" +
    "#shellBtn span::before,#shellBtn span::after{content:'';position:absolute;left:0;width:18px;height:2px;background:#cfcffb;border-radius:2px;}" +
    "#shellBtn span::before{top:-6px;}#shellBtn span::after{top:6px;}" +
    "#shellScrim{position:fixed;inset:0;z-index:8998;background:rgba(0,0,0,.55);display:none;}" +
    "#shellScrim.open{display:block;}" +
    "#shellNav{position:fixed;top:0;left:0;bottom:0;z-index:8999;width:260px;max-width:84vw;" +
      "background:#121319;border-right:1px solid #262a3a;padding:16px 12px;overflow-y:auto;" +
      "transform:translateX(-102%);transition:transform .2s ease;" +
      "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}" +
    "#shellNav.open{transform:translateX(0);box-shadow:0 0 40px rgba(0,0,0,.6);}" +
    "#shellNav .sh-brand{display:flex;align-items:center;gap:10px;padding:4px 8px 14px;color:#e8eaf2;}" +
    "#shellNav .sh-logo{width:30px;height:30px;border-radius:9px;background:linear-gradient(135deg,#8b8cf0,#b98bf0);" +
      "display:flex;align-items:center;justify-content:center;font-weight:800;color:#0b0b12;font-size:15px;}" +
    "#shellNav .sh-bname{font-weight:700;font-size:15px;}" +
    "#shellNav .sh-grp{color:#8b90a6;font-size:11px;text-transform:uppercase;letter-spacing:.6px;margin:14px 8px 6px;}" +
    "#shellNav a.sh-item{display:flex;align-items:center;gap:11px;padding:11px 12px;border-radius:11px;" +
      "color:#e8eaf2;text-decoration:none;font-size:14px;cursor:pointer;}" +
    "#shellNav a.sh-item:hover{background:#1e2130;}" +
    "#shellNav a.sh-item.active{background:rgba(139,140,240,.16);color:#a9a8ff;box-shadow:inset 0 0 0 1px rgba(139,140,240,.3);}" +
    "#shellNav .sh-close{position:absolute;top:12px;right:12px;background:none;border:none;color:#8b90a6;font-size:20px;cursor:pointer;line-height:1;}" +
    "#shellUpdate{display:none;margin:10px 4px 2px;padding:11px 12px;border-radius:11px;cursor:pointer;" +
      "background:linear-gradient(135deg,#8b8cf0,#b98bf0);color:#0b0b12;font-weight:700;font-size:13px;text-align:center;}" +
    /* Hide legacy per-page back/Home links and footer update banners (drawer replaces them) */
    "a.home,.topbar a.home,#backHome,.back-home{display:none !important;}" +
    "#updateBanner{display:none !important;}";

  function injectTheme() {
    var link = document.createElement("link");
    link.rel = "stylesheet"; link.href = "theme.css";
    document.head.appendChild(link);
    var s = document.createElement("style");
    s.id = "shellTheme"; s.textContent = themeCss;
    document.head.appendChild(s);
  }

  function buildNav() {
    var html = '<button class="sh-close" id="shellClose" aria-label="Close">&#215;</button>' +
      '<div class="sh-brand"><div class="sh-logo">D</div><div class="sh-bname">My Dashboard</div></div>';
    NAV.forEach(function (n) {
      if (n.group) { html += '<div class="sh-grp">' + n.group + '</div>'; return; }
      var active = (n.href.toLowerCase() === FILE) ? " active" : "";
      html += '<a class="sh-item' + active + '" href="' + n.href + '">' + n.label + '</a>';
    });
    html += '<div id="shellUpdate">Update available &mdash; tap to refresh</div>';

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
    btn.innerHTML = "<span></span>";
    document.body.appendChild(btn);

    function open() { nav.classList.add("open"); scrim.classList.add("open"); }
    function close() { nav.classList.remove("open"); scrim.classList.remove("open"); }
    btn.onclick = open;
    scrim.onclick = close;
    document.getElementById("shellClose").onclick = close;

    nav.querySelectorAll("a.sh-item").forEach(function (a) {
      if (a.getAttribute("href") === "#lock") {
        a.onclick = function (e) { e.preventDefault(); try { sessionStorage.removeItem("ctUnlocked"); } catch (x) {} location.reload(); };
      } else {
        a.addEventListener("click", close);
      }
    });
  }

  // ---- Update check: show an item inside the drawer instead of a fixed banner ----
  function checkUpdate() {
    fetch("version.json?ts=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || typeof j.version !== "number" || j.version <= APP_VERSION) return;
        var u = document.getElementById("shellUpdate");
        if (!u) return;
        u.style.display = "block";
        u.textContent = "Update available (v" + j.version + ") \u2014 tap to refresh";
        u.onclick = function () {
          u.textContent = "Updating\u2026";
          var done = function () { var url = new URL(location.href); url.searchParams.set("v", String(j.version) + "." + Date.now()); location.replace(url.toString()); };
          if (window.caches && caches.keys) { caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { return caches.delete(k); })); }).then(done, done); }
          else done();
        };
      })
      .catch(function () {});
  }

  function init() {
    injectTheme();
    buildNav();
    checkUpdate();
    setInterval(checkUpdate, 60000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
