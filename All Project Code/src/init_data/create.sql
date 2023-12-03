CREATE TABLE users(
    username VARCHAR(50) PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL
);

CREATE TABLE users_to_themes(
    username VARCHAR(50) FOREIGN KEY,
    avatar INT FOREIGN KEY
);

CREATE TABLE themes(
   avatar INT PRIMARY KEY,
   theme INT
);

-- CREATE TABLE users_to_themes(
--     username VARCHAR(50) REFERENCES users(username),
--     email VARCHAR(50) NOT NULL,
--     password CHAR(60) NOT NULL
--     avatar INT REFERENCES themes(avatar)
-- );

-- CREATE TABLE themes(
--    avatar INT PRIMARY KEY,
--    theme INT
-- );