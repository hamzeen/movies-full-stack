CREATE TABLE IF NOT EXISTS MOVIE (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(512) NOT NULL,
    `year` INT NOT NULL,
    genres VARCHAR(2048) NOT NULL,
    actors VARCHAR(4096) NOT NULL,
    directors VARCHAR(2048) NOT NULL,
    image_url VARCHAR(2083) NOT NULL,
    thumbnail_url VARCHAR(2083) NOT NULL,
    rating DOUBLE NOT NULL,
    duration VARCHAR(32) NOT NULL
);
