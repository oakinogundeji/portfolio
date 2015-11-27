function getBaseUrl(url) {
  var
    uri = url.replace(/^(.*\/\/[^\/?#]*).*$/,"$1"),
    parts = uri.split('.'),
    baseDomain1 = parts.slice(-2).join('.'),
    baseDomain2 = parts.slice(1).join('.');
  if(url.indexOf(':') != -1) {
    return baseDomain1;
  }
  return baseDomain2;
}
