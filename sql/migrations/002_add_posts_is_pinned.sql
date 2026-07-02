ALTER TABLE posts
  ADD COLUMN is_pinned TINYINT(1) NOT NULL DEFAULT 0 AFTER content_html,
  ADD INDEX idx_posts_is_pinned_id (is_pinned, id);
