export function formatDate(date) {
    return date ? date.substring(8, 10) + '.' + date.substring(5, 7) + '.' + date.substring(0, 4) + ' ' + date.substring(11, 16) : '';
}
