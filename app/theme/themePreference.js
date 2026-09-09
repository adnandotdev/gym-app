const THEME_PREFERENCE_KEY = '@liftsutra/theme-preference:v1';
const THEME_PREFERENCES = Object.freeze(['system', 'light', 'dark']);

const normalizeThemePreference = (value) => (
  THEME_PREFERENCES.includes(value) ? value : 'system'
);

const resolveThemePreference = (preference, systemScheme) => {
  const normalizedPreference = normalizeThemePreference(preference);
  if (normalizedPreference !== 'system') return normalizedPreference;
  return systemScheme === 'dark' ? 'dark' : 'light';
};

module.exports = {
  THEME_PREFERENCE_KEY,
  THEME_PREFERENCES,
  normalizeThemePreference,
  resolveThemePreference,
};
