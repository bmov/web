ALTER TABLE posts
  ADD COLUMN slug varchar(255) NULL DEFAULT NULL AFTER content_html,
  ADD UNIQUE idx_posts_id_slug (slug, id);

ALTER TABLE posts
  ADD COLUMN category_color varchar(20) NULL DEFAULT NULL AFTER content_html;

ALTER TABLE posts
  ADD COLUMN category varchar(30) NULL DEFAULT NULL AFTER content_html,
  ADD INDEX idx_posts_category (category);
  
ALTER TABLE posts
  ADD COLUMN summary varchar(255) NULL DEFAULT NULL AFTER content_html;

ALTER TABLE posts
  ADD COLUMN cover_img varchar(255) NULL DEFAULT NULL AFTER content_html;
