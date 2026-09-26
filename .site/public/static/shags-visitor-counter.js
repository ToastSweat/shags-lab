(function () {
  async function updateVisitorCounter() {
    var nodes = document.querySelectorAll("[data-shags-visitor-count]");
    if (!nodes.length) return;

    try {
      var response = await fetch("/lab/visitor-count.php", {
        cache: "no-store",
        credentials: "same-origin"
      });

      if (!response.ok) {
        throw new Error("Visitor counter endpoint returned HTTP " + response.status);
      }

      var data = await response.json();

      if (!data || typeof data.count === "undefined") {
        throw new Error("Visitor counter endpoint returned no count.");
      }

      nodes.forEach(function (node) {
        node.textContent = data.count;
      });
    } catch (error) {
      console.warn("Shag's Lab visitor counter could not be loaded.", error);
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