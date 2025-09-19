document.addEventListener("DOMContentLoaded", function () {
  let fns = {};
  let pan;

  function showfn(n, elm) {
    if (!pan) {
      pan = document.createElement("div");
      pan.className = "fn-panel";
      pan.innerHTML = `
        <div id="fn-panel-content"></div>
        <button class="fn-close" aria-label="Close">×</button>`;
      document.body.appendChild(pan);

      // Close on button click
      pan.querySelector(".fn-close").onclick = function (e) {
        e.stopPropagation();
        pan.classList.remove('visible');
        pan.style.display = "none";
      };

      // Close when clicking outside the panel content (on the overlay)
      pan.addEventListener('click', function (e) {
        if (e.target === pan) {
          pan.classList.remove('visible');
          pan.style.display = "none";
        }
      });
    }

    pan.querySelector("#fn-panel-content").innerHTML = fns[n] || "Footnote not found";

    // Only absolutely position for desktop.
    if (window.innerWidth > 600) {
      const rect = elm.getBoundingClientRect();
      pan.style.position = 'absolute';
      pan.style.left = `${window.scrollX + rect.left}px`;
      pan.style.top = `${window.scrollY + rect.bottom + 8}px`;
      pan.style.right = "";
      pan.style.bottom = "";
      pan.style.maxWidth = "300px";
      pan.style.width = "";
      pan.style.borderRadius = "8px";
    } else {
      // Let CSS handle fixed full width on mobile
      pan.style.position = 'fixed';
      pan.style.left = "0";
      pan.style.right = "0";
      pan.style.top = "";
      pan.style.bottom = "0";
      pan.style.maxWidth = "100vw";
      pan.style.width = "100vw";
      pan.style.borderRadius = "0";
    }

    pan.style.display = 'block';
    // Small delay for transition, optional:
    setTimeout(() => pan.classList.add('visible'), 10);
  }

  // Gather footnote contents
  document.querySelectorAll(".footdef").forEach(function (fd) {
    const n = fd.querySelector("a.footnum").id.replace("fn.", "");
    fns[n] = fd.querySelector(".footpara").innerHTML;
  });

  // Bind footnote references
  document.querySelectorAll("a.footref").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      const n = a.id.replace("fnr.", "");
      showfn(n, a);
    });
  });
});