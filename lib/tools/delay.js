/**
 * setTimeout as Promise.
 *
 * @param {number} ms Timeout in milliseconds.
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
