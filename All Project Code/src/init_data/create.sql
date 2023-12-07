CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    password CHAR(60) NOT NULL
);

CREATE TABLE themes (
   avatar INT PRIMARY KEY,
   theme INT
);

CREATE TABLE users_to_themes (
    username VARCHAR(50) REFERENCES users(username),
    avatar INT REFERENCES themes(avatar),
    PRIMARY KEY (username, avatar),
    UNIQUE (username)
);
