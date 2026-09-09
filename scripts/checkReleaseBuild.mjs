import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { resolveApiUrl } from '../app/utils/apiConfiguration.js';

export function checkReleaseBuild(environment) {
  const profile = environment.EAS_BUILD_PROFILE || 'production';
  if (!['production', 'preview'].includes(profile)) return false;
  if (!resolveApiUrl(environment.EXPO_PUBLIC_API_URL, false)) {
    throw new Error('Release build stopped: configure EXPO_PUBLIC_API_URL in the EAS environment with an HTTPS API URL using a public DNS hostname. Local addresses, credentials, query strings and fragments are not allowed.');
  }
  return true;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const checked = checkReleaseBuild(process.env);
    console.log(checked ? 'Release API configuration passed.' : 'Release API check skipped for development profile.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
