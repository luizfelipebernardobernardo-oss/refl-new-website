const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('#mobile-nav');
function closeNavigation() {
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
}
menuButton.addEventListener('click', () => {
  const opening = mobileNav.hidden;
  mobileNav.hidden = !opening;
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeNavigation));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) { closeNavigation(); menuButton.focus(); }
});
document.addEventListener('click', event => {
  if (!mobileNav.hidden && !mobileNav.contains(event.target) && !menuButton.contains(event.target)) closeNavigation();
});
window.matchMedia('(min-width: 821px)').addEventListener('change', event => { if (event.matches) closeNavigation(); });
const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
function selectTab(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
  });
  panels.forEach(panel => { panel.hidden = panel.id !== tab.getAttribute('aria-controls'); });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); }
  });
});
document.querySelector('#year').textContent = new Date().getFullYear();

// Scroll depth is applied through CSS translate, independently of card rotation.
// Only visible scenes are updated, with at most one paint request per frame.
(() => {
  if (!('IntersectionObserver' in window)) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compactScreen = window.matchMedia('(max-width: 820px)');
  const scenes = [...document.querySelectorAll('[data-parallax-scene]')].map(element => ({
    element,
    visible: false,
    layers: [...element.querySelectorAll('[data-parallax-depth]')].map(layer => ({
      element: layer,
      depth: Number(layer.dataset.parallaxDepth) || 0,
      lastOffset: null,
    })),
  }));
  const sceneByElement = new Map(scenes.map(scene => [scene.element, scene]));
  let frame = 0;
  let enabled = !reducedMotion.matches;

  function render() {
    frame = 0;
    if (!enabled || document.hidden) return;

    const viewportHeight = window.innerHeight;
    const strength = compactScreen.matches ? 0.4 : 1;
    // Read each static container before writing any transformed layer.
    const measurements = scenes.filter(scene => scene.visible).map(scene => ({
      scene,
      rect: scene.element.getBoundingClientRect(),
    }));

    measurements.forEach(({ scene, rect }) => {
      if (!rect.height || !rect.width) return;
      const distance = viewportHeight / 2 - (rect.top + rect.height / 2);
      const progress = Math.max(-1, Math.min(1, distance / ((viewportHeight + rect.height) / 2)));
      scene.layers.forEach(layer => {
        const offset = (progress * layer.depth * strength).toFixed(2) + 'px';
        if (offset === layer.lastOffset) return;
        layer.element.style.setProperty('--parallax-y', offset);
        layer.lastOffset = offset;
      });
    });
  }

  function requestRender() {
    if (!enabled || document.hidden || frame) return;
    frame = window.requestAnimationFrame(render);
  }

  function syncPreference() {
    enabled = !reducedMotion.matches;
    document.documentElement.classList.toggle('parallax-enabled', enabled);
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    scenes.forEach(scene => {
      scene.element.classList.toggle('parallax-visible', enabled && scene.visible);
      scene.layers.forEach(layer => {
        layer.element.style.removeProperty('--parallax-y');
        layer.lastOffset = null;
      });
    });
    requestRender();
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const scene = sceneByElement.get(entry.target);
      scene.visible = entry.isIntersecting;
      scene.element.classList.toggle('parallax-visible', enabled && scene.visible);
    });
    requestRender();
  }, { rootMargin: '120px 0px 120px 0px', threshold: 0 });
  scenes.forEach(scene => observer.observe(scene.element));

  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(requestRender);
    scenes.forEach(scene => resizeObserver.observe(scene.element));
  }
  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender, { passive: true });
  window.addEventListener('load', requestRender, { once: true });
  document.addEventListener('visibilitychange', requestRender);
  compactScreen.addEventListener('change', requestRender);
  reducedMotion.addEventListener('change', syncPreference);
  if (document.fonts) document.fonts.ready.then(requestRender);
  syncPreference();
})();
