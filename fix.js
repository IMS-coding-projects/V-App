// note that this is bad practice... i just don't know any better and it works👍👍👍

let observer = null;

function initObserver() {
  // remove old observer
  if (observer) observer.disconnect();

  const doc = document.querySelector(
    "#sidebar-content > div.w-full.items-center.px-7.py-4.border-t.border-gray-200\\/70.dark\\:border-white\\/\\[0\\.07\\]"
  );

  const content = document.querySelector("#content-container");

  if (!doc || !content) return;

  function updateMargin() {
    if (window.matchMedia("(max-width: 1024px)").matches) {
      content.style.marginLeft = "0px";
      return;
    }

    if (doc.classList.contains("hidden")) {
      content.style.marginLeft = "0px";
    } else {
      content.style.marginLeft = "280px";
    }
  }

  // run once
  updateMargin();

  // create observer
  observer = new MutationObserver(updateMargin);

  observer.observe(doc, {
    attributes: true,
    attributeFilter: ["class"],
  });

  window.addEventListener("resize", updateMargin);
}

// run on load
initObserver();


// detect URL changes
let lastUrl = location.href;

setInterval(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    initObserver();
  }
}, 200);