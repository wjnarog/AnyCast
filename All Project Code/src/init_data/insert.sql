INSERT INTO users (username, email, password) values ('JDoe','JohnDoe@gmail.com','$2b$10$10B01VBxolqTy906W1FnuuGYcGutxhQh8XLpMU.UC2vIGmYMFatzm');
INSERT INTO themes (avatar, theme) VALUES (1, 1);
INSERT INTO themes (avatar, theme) VALUES (2, 2);
INSERT INTO themes (avatar, theme) VALUES (3, 3);
INSERT INTO themes (avatar, theme) VALUES (4, 4);
INSERT INTO themes (avatar, theme) VALUES (5, 5);
INSERT INTO users_to_themes (username, avatar) VALUES ('JDoe', 1);
-- Password for JDoe account is 'qwerty'INSERT INTO users_to_themes (username, avatar) VALUES ('JDoe', 1);
