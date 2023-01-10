-- 1
SELECT name 
FROM movies
WHERE year = 1992;

-- 2
SELECT COUNT(name) 
FROM movies
WHERE year = 1982;

-- 3
SELECT first_name, last_name 
FROM actors
WHERE last_name LIKE '%stack%';

-- 4
SELECT first_name, COUNT(first_name) AS most_common 
FROM actors
GROUP BY first_name
ORDER BY most_common DESC
LIMIT 1;

SELECT last_name, COUNT(last_name) AS most_common 
FROM actors
GROUP BY last_name
ORDER BY most_common DESC
LIMIT 1;

-- 5
SELECT actor_id, COUNT(actor_id) AS more_active
FROM roles
GROUP BY actor_id
ORDER BY more_active DESC
LIMIT 100;

-- 6
SELECT genre, COUNT(genre) AS num_movies
FROM movies_genres
GROUP BY genre
ORDER BY num_movies;

-- 7
SELECT first_name, last_name
FROM actors
JOIN roles ON actors.id = roles.actor_id
JOIN movies ON roles.movie_id = movies.id 
WHERE name = 'Braveheart' AND year = 1995
ORDER BY last_name;

-- 8
SELECT directors.first_name, directors.last_name, movies.name, movies.year
FROM movies
JOIN movies_directors ON movies.id = movies_directors.movie_id
JOIN directors ON movies_directors.director_id = directors.id
JOIN movies_genres ON movies.id = movies_genres.movie_id
JOIN directors_genres ON movies_genres.genre = directors_genres.genre
WHERE directors_genres.genre = 'Film-Noir' AND (movies.year % 4) = 0
ORDER BY movies.name;

-- 9


-- 10


-- 11


-- 12