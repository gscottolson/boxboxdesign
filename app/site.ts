const STATIC_TITLE = 'iRacing Official Series Posters';

export function getSiteTitle(item?: string) {
  return item ? `${item} | ${STATIC_TITLE}` : STATIC_TITLE;
}

export function getSiteTitleTemplate() {
  return `%s | ${STATIC_TITLE}`;
}
