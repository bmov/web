import { request } from '~/api.js';

export const fetchPosts = ({ offset = 0, limit = 20 } = {}) => {
  const query = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
  });

  return request(`/api/posts?${query.toString()}`);
};

export const fetchPost = (id) => request(`/api/posts/${id}`);

export const createPost = (payload) =>
  request('/api/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updatePost = (id, payload) =>
  request(`/api/posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

export const updatePostPinned = (id, isPinned) =>
  request(`/api/posts/${id}/pin`, {
    method: 'PATCH',
    body: JSON.stringify({ isPinned }),
  });

export const deletePost = (id) => request(`/api/posts/${id}`, { method: 'DELETE' });
