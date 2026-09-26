(function () {
  var code = "shagwrath";
  var endpoint = "https://" + code + ".goatcounter.com/counter/TOTAL.json";

  async function updateVisitorCounter() {
    var nodes = document.querySelectorAll("[data-shags-visitor-count]");
    if (!nodes.length) return;

    try {
      var response = await fetch(endpoint, { mode: "cors", cache: "no-store" });
      if (!response.ok) {
        throw new Error("GoatCounter returned HTTP " + response.status);
      }

      var data = await response.json();
      var count = data && data.count ? data.count : "0";

      nodes.forEach(function (node) {
        node.textContent = count;
      });
    } catch (error) {
      console.warn("Shag's Lab visitor counter could not be loaded. Make sure GoatCounter Settings > Allow adding visitor counts on your website is enabled.", error);
      nodes.forEach(function (node) {
        node.textContent = "--";
      });
    }
  }

  function scheduleUpdate() {
    window.setTimeout(updateVisitorCounter, 0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateVisitorCounter, { once: true });
  } else {
    updateVisitorCounter();
  }

  document.addEventListener("nav", scheduleUpdate);
})();