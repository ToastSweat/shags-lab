(function () {
  var retryTimer = null;

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
        no_branding: true,
        attr: {
          width: "82",
          height: "24",
          title: "Total visitors to Shag's Lab"
        },
        style: [
          "html, body { margin: 0 !important; padding: 0 !important; background: transparent !important; }",
          "div { margin: 0 !important; padding: 0 !important; border: 0 !important; background: transparent !important; }",
          "#gcvc-for, #gcvc-by { display: none !important; }",
          "#gcvc-views { font-family: Arial, sans-serif !important; font-size: 14px !important; line-height: 20px !important; color: #777 !important; font-weight: 400 !important; }"
        ].join(" ")
      });
    } catch (error) {
      console.warn("Shag's Lab visitor counter could not be rendered.", error);
      host.textContent = "--";
    }
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