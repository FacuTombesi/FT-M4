-- 1
SELECT * 
FROM movies
WHERE year = 1992;

-- 2
SELECT COUNT(*) as total
FROM movies
WHERE year = 1982;

-- 3
SELECT * 
FROM actors
WHERE last_name LIKE '%stack%';
-- El '%' busca palabras/strings que contengan la palabra pedida: '%string' busca palabras que terminen en x; 'string%' busca palabras que terminen en x; y '%string%' busca paralabras que contengan x en cualquier lugar

-- 4
-- TODO JUNTO --
SELECT first_name, last_name, COUNT(*) AS most_common
FROM actors
GROUP BY LOWER(first_name), LOWER(last_name) -- LOWER() pone todos los strings en minúscula
ORDER BY most_common DESC
LIMIT 10;

-- SEPARADO --
-- SELECT first_name, COUNT(first_name) AS most_common 
-- FROM actors
-- GROUP BY first_name
-- ORDER BY most_common DESC
-- LIMIT 10;

-- SELECT last_name, COUNT(last_name) AS most_common 
-- FROM actors
-- GROUP BY last_name
-- ORDER BY most_common DESC
-- LIMIT 10;

-- 5
SELECT a.first_name, a.last_name, COUNT(*) AS more_active
FROM actors AS a -- AS también le puede cambiar el nombre a las tablas
JOIN roles AS r ON a.id = r.actor_id
GROUP BY a.id
ORDER BY more_active DESC
LIMIT 100;

-- 6
SELECT genre, COUNT(*) AS less_popular
FROM movies_genres
GROUP BY genre
ORDER BY less_popular;

-- 7
SELECT a.first_name, a.last_name
FROM actors AS a
JOIN roles AS r ON a.id = r.actor_id
JOIN movies AS m ON r.movie_id = m.id 
WHERE m.name = 'Braveheart' AND m.year = 1995
ORDER BY a.last_name;

-- 8
SELECT d.first_name, d.last_name, m.name, m.year
FROM directors AS d
JOIN movies_directors AS md ON md.director_id = d.id -- Conecto con movie_directors para vincular el ID del director con los ID de las películas
JOIN movies AS m AS d ON m.id = md.movie_id -- Conecto con movies para vincular el ID de las películas de las dos tablas
JOIN movies_genres AS mg ON m.id = mg.movie_id -- Y conecto el ID de las películas con los IDs de la tabla de los géneros para conseguir sus géneros
WHERE mg.genre = 'Film-Noir' AND (m.year % 4) = 0
ORDER BY m.name;

-- 9
SELECT a.first_name, a.last_name
FROM actors AS a
JOIN roles AS r ON a.id = r.actor_id
JOIN movies AS m ON r.movie_id = m.id
JOIN movies_genres AS mg ON m.id = mg.movie_id
WHERE mg.genre = 'Drama' AND m.id IN (
    -- Busco los IDs de las películas donde trabajó Kevin Bacon
    SELECT r.movie_id
    FROM roles AS r
    JOIN actors AS a ON a.id = r.actor_id
    WHERE a.first_name = 'Kevin' AND a.last_name = 'Bacon'
)
AND (a.first_name || ' ' || a.last_name != 'Kevin Bacon'); -- || concatena condiciones para evitar repetir AND y excluir a Kevin Bacon de los resultados de la búsqueda

-- 10
SELECT a.first_name, a.last_name
FROM actors AS a
WHERE a.id IN (
    -- Concateno dos búsquedas para buscar por películas antes del 1900 y otra para después del 2000
    SELECT r.actor_id
    FROM roles AS r
    JOIN movies AS m ON r.movie_id = m.id
    WHERE m.year < 1900
)   
AND a.id IN (
    SELECT r.actor_id
    FROM roles AS r
    JOIN movies AS m ON r.movie_id = m.id
    WHERE m.year > 2000
);

-- 11
SELECT a.first_name, a.last_name, m.name, COUNT(DISTINCT(role)) AS total_roles -- DISTINCT() cuenta parámetros distintos sin repetir
FROM roles AS r
JOIN actors AS a ON a.id = r.actor_id
JOIN movies AS m ON r.movie_id = m.id
WHERE m.year > 1990
GROUP BY r.actor_id, r.movie_id
HAVING total_roles > 5; -- Busca sólo los que tengan más de 5 participaciones

-- 12
SELECT m.year, COUNT(DISTINCT(id)) AS total_movies
FROM movies AS m
WHERE m.id NOT IN (
    -- Busco películas que no cumplan con la siguiente condición donde haya por lo menos un actor masculino
    SELECT r.movie_id
    FROM roles AS r
    JOIN actors AS a ON a.id = r.actor_id
    WHERE a.gender = 'M'
)
GROUP BY m.year;
