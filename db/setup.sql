CREATE TYPE valid_website AS ENUM (
    'GitHub',
    'Frontend Mentor',
    'Twitter',
    'LinkedIn',
    'YouTube',
    'Facebook',
    'Twitch',
    'Dev.to',
    'Codewars',
    'Codepen',
    'freeCodeCamp',
    'GitLab',
    'Hashnode',
    'Stack Overflow'
);


CREATE TABLE link (
  id BIGSERIAL PRIMARY KEY,
  userid TEXT REFERENCES "user"(id) ON DELETE CASCADE,
  website valid_website NOT NULL,
  username TEXT NOT NULL,
  position INT NOT NULL,
  CONSTRAINT unique_user_position UNIQUE (userid, position)
);
