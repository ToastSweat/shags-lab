(function () {
  var retryTimer = null;

  function setVisibleCount(value) {
    var nodes = document.querySelectorAll("[data-shags-visitor-count]");
    nodes.forEach(function (node) {
      node.textContent = value;
    });
  }

  function readRenderedCount(host) {
    var views = host.querySelector("#gcvc-views");
    if (!views) return false;

    var value = (views.textContent || "").trim();
    if (!value) return false;

    setVisibleCount(value);
    return true;
  }

  function renderTotalCount() {
    var host = document.querySelector("[data-shags-goatcounter-host]");
    if (!host) return;

    if (!(window.goatcounter && typeof window.goatcounter.visit_count === "function")) {
      clearTimeout(retryTimer);
      retryTimer = window.setTimeout(renderTotalCount, 100);
      return;
    }

    host.innerHTML = "";

    try {
      window.goatcounter.visit_count({
        append: "[data-shags-goatcounter-host]",
        type: "html",
        path: "TOTAL",
        no_branding: true
      });
    } catch (error) {
      console.warn("Shag's Lab visitor counter could not be rendered.", error);
      setVisibleCount("--");
      return;
    }

    var attempts = 0;
    var poll = window.setInterval(function () {
      attempts += 1;

      if (readRenderedCount(host)) {
        window.clearInterval(poll);
        return;
      }

      if (attempts >= 50) {
        window.clearInterval(poll);
        console.warn(
          "Shag's Lab visitor counter did not return a value. " +
          "Make sure GoatCounter Settings > Allow adding visitor counts on your website is enabled."
        );
        setVisibleCount("--");
      }
    }, 100);
  }

  function scheduleRender() {
    window.setTimeout(renderTotalCount, 0);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderTotalCount, { once: true });
  } else {
    renderTotalCount();
  }

  document.addEventListener("nav", scheduleRender);
})();