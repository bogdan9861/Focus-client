export const toProxyPath = (str: string): string => {
  return `${window.location.protocol}//${window.location.host}/${str}`;
};
