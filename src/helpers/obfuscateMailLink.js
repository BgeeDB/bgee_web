const obfuscateMailLink = (mail) => () => {
  const el = document.createElement('a');
  el.href = `mailto:${mail}`;
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
};

export default obfuscateMailLink;
