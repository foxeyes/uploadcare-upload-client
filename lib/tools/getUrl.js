const serializePair = (key, value) => typeof value !== 'undefined' ? `${key}=${encodeURIComponent(value)}` : null;
const createQuery = (query) => Object.entries(query)
    .reduce((params, [key, value]) => params.concat(Array.isArray(value)
    ? value.map(value => serializePair(`${key}[]`, value))
    : serializePair(key, value)), [])
    .filter(x => !!x)
    .join('&');
const getUrl = (base, path, query) => [
    base,
    path,
    query && Object.keys(query).length > 0 ? '?' : '',
    query && createQuery(query)
]
    .filter(Boolean)
    .join('');
export default getUrl;
