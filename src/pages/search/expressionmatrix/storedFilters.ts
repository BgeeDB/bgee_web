// Copy stored filter values onto a page URL.
// A key the page already has is left alone. Every other value is kept:
// checking "already present" inside the per-value loop would stop after the first organ.
export const appendMissingFilterValues = (target: URLSearchParams, stored: URLSearchParams) => {
  const present = new Set(target.keys());
  stored.forEach((value, key) => {
    if (present.has(key)) return;
    target.append(key, value);
  });
};
