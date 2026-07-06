import { request } from '~/api.js';

export const sendContactMessage = (payload) =>
  request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const fetchContactMessages = ({ offset = 0, limit = 20 } = {}) =>
  request(`/api/contact?offset=${offset}&limit=${limit}`);

export const fetchContactMessage = (id) => request(`/api/contact/${id}`);
