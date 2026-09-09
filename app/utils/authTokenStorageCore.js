export function createAuthTokenStorage({ platform, secureStore }) {
  let webToken = null;
  const isWeb = platform === 'web';

  return {
    async getToken() {
      if (isWeb) return webToken;
      return secureStore.getItemAsync('userToken');
    },

    async setToken(token) {
      if (isWeb) {
        webToken = token;
        return;
      }
      await secureStore.setItemAsync('userToken', token);
    },

    async clearToken() {
      if (isWeb) {
        webToken = null;
        return;
      }
      await secureStore.deleteItemAsync('userToken');
    },
  };
}
