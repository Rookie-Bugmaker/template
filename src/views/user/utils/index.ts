import type { ConfigPageVO } from '@/api/system/single-sign-on-config';

export const buildSsoAuthPath = (item: ConfigPageVO) => {
  const encodeStateParam = encodeURIComponent(`configCode=${item.configCode}`);
  const encodeRedirectUrl = encodeURIComponent(item.redirectUrl);
  return `${item.authorizeRequestUrl}${
    item.authorizeRequestUrl?.includes('?') ? '&' : '?'
  }client_id=${
    item.clientId
  }&response_type=code&redirect_uri=${encodeRedirectUrl}&state=${encodeStateParam}`;
};
