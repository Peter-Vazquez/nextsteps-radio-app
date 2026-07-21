(function () {
  const polish = document.createElement('link');
  polish.rel = 'stylesheet';
  polish.href = '/responsive-polish.css';
  document.head.appendChild(polish);

  const data = window.OD_PUBLIC_DATA;
  const setText = (id, value) => {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
  };

  setText('public-promise', data.meta.promise);
  setText('public-phase', data.meta.phase);
  setText('public-outreach', data.meta.outreachStart);
  setText('public-updated', data.meta.updated);
}());