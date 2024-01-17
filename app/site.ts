const STATIC_TITLE = 'iRacing Official Series Schedules';

export function getSiteTitle(item?: string) {
    return item ? `${item} | ${STATIC_TITLE}` : STATIC_TITLE;
}

export function getSiteTitleTemplate() {
    return `%s | ${STATIC_TITLE}`;
}

export function getDetailTitle(token: string) {
    return `${token} | ${STATIC_TITLE}`;
}
