const parseSetInput = ({ targetType, value, load }) => {
  const countText = String(value ?? '').trim();
  const count = Number(countText);
  const loadText = String(load ?? '').trim();
  const loadKg = loadText === '' ? 0 : Number(loadText);
  if (!/^\d+$/.test(countText) || !Number.isSafeInteger(count) || count <= 0) return null;
  if (targetType === 'duration') return { actualSeconds: count };
  if (!Number.isFinite(loadKg) || loadKg < 0) return null;
  return { actualReps: count, actualLoadKg: loadKg };
};

module.exports = { parseSetInput };
