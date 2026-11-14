(function () {
  "use strict";

  var mount = document.getElementById("album-footer-mount");
  if (!mount || mount.children.length > 0) return;

  var isAlbum = window.location.pathname.indexOf("/albums/") !== -1;
  var prefix = isAlbum ? "../" : "";
  var slug = window.location.pathname.split("/").pop() || "index.html";
  var langPath = isAlbum ? "albums/" + slug : slug === "index.html" ? "" : slug;

  mount.innerHTML =
    '<footer class="footer-minimal">' +
    '  <div class="container">' +
    '    <div class="footer-editorial-grid">' +
    '      <div>' +
    '        <a href="' + prefix + 'index.html" class="logo" aria-label="DP.PORTFOLIO">' +
    '          <span class="logo-mark"><img src="https://iili.io/fjNLbs4.png" alt="DP.PORTFOLIO" class="logo-img"></span>' +
    '          <span class="logo-sub">PORTFOLIO | EN</span>' +
    "        </a>" +
    '        <p class="footer-brand-tagline">Space, light, and emotion. Editorial photography and visual storytelling by Dominik Šuškevič.</p>' +
    '        <a href="mailto:info@dominikphotofficial.lt" class="footer-email-link">info@dominikphotofficial.lt</a>' +
    "      </div>" +
    "      <div>" +
    '        <div class="footer-col-title">Navigation</div>' +
    '        <ul class="footer-nav-list">' +
    '          <li><a href="' + prefix + 'index.html">Home</a></li>' +
    '          <li><a href="' + prefix + 'about.html">About</a></li>' +
    '          <li><a href="' + prefix + 'biography.html">Biography</a></li>' +
    '          <li><a href="' + prefix + 'frozen-time.html">Frozen Time</a></li>' +
    '          <li><a href="' + prefix + 'contacts.html">Contacts</a></li>' +
    "        </ul>" +
    "      </div>" +
    "      <div>" +
    '        <div class="footer-col-title">Information</div>' +
    '        <ul class="footer-nav-list">' +
    '          <li><a href="https://portfolio.dominikphotofficial.lt/services.html">Services</a></li>' +
    '          <li><a href="https://portfolio.dominikphotofficial.lt/tfp-booking.html">TFP Registration</a></li>' +
    '          <li><a href="https://portfolio.dominikphotofficial.lt/review.html">Client Reviews</a></li>' +
    '          <li><a href="' + prefix + 'privacy-policy.html">Privacy Policy</a></li>' +
    '          <li><a href="' + prefix + 'terms-of-service.html">Terms of Service</a></li>' +
    "        </ul>" +
    "      </div>" +
    "    </div>" +
    '    <div class="footer-min-bottom">' +
    '      <span>&copy; 2026 DP.PORTFOLIO · DP Corporation. All rights reserved.</span>' +
    '      <div class="footer-min-langs" aria-label="Language">' +
    '        <a href="https://portfolio.dominikphotofficial.lt/' + langPath + '" hreflang="lt">LT</a>' +
    '        <a href="https://en.dominikphotofficial.lt/' + langPath + '" hreflang="en" class="active">EN</a>' +
    '        <a href="https://pl.dominikphotofficial.lt/' + langPath + '" hreflang="pl">PL</a>' +
    '        <a href="https://ru.dominikphotofficial.lt/' + langPath + '" hreflang="ru">RU</a>' +
    '        <a href="https://kr.dominikphotofficial.lt/' + langPath + '" hreflang="ko">KR</a>' +
    "      </div>" +
    "    </div>" +
    "  </div>" +
    "</footer>";
})();
