-- Create database if not exists
CREATE DATABASE IF NOT EXISTS movie_catalog;

-- Insert sample genres
INSERT INTO genres (name, description) VALUES
('Action', 'High-energy movies with intense action sequences'),
('Drama', 'Character-driven stories with emotional themes'),
('Comedy', 'Light-hearted movies designed to amuse and entertain'),
('Sci-Fi', 'Science fiction movies exploring futuristic concepts'),
('Thriller', 'Suspenseful movies designed to keep audiences on edge'),
('Horror', 'Movies designed to frighten and create suspense'),
('Romance', 'Movies centered around love stories'),
('Adventure', 'Movies featuring exciting journeys and quests');

-- Insert sample directors
INSERT INTO directors (firstName, lastName, birthDate, nationality, biography) VALUES
('Christopher', 'Nolan', '1970-07-30', 'British', 'Christopher Nolan is a British-American film director, producer, and screenwriter known for his films that explore themes of time, memory, and reality.'),
('Quentin', 'Tarantino', '1963-03-27', 'American', 'Quentin Tarantino is an American film director, screenwriter, and producer known for his non-linear storytelling and pop culture references.'),
('Martin', 'Scorsese', '1942-11-17', 'American', 'Martin Scorsese is an American film director, producer, and screenwriter known for his gritty crime films and character studies.'),
('Steven', 'Spielberg', '1946-12-18', 'American', 'Steven Spielberg is an American film director, producer, and screenwriter, one of the founding pioneers of the New Hollywood era.'),
('The', 'Wachowskis', '1965-06-21', 'American', 'The Wachowskis are American film and television directors, writers, and producers known for The Matrix trilogy.');

-- Insert sample movies
INSERT INTO movies (title, description, releaseYear, duration, rating, synopsis, genreId, directorId) VALUES
('Inception', 'A thief who steals corporate secrets through dream-sharing technology', 2010, 148, 8.8, 'Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.', 1, 1),
('Pulp Fiction', 'The lives of two mob hitmen, a boxer, and a gangster intertwine', 1994, 154, 8.9, 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', 2, 2),
('The Dark Knight', 'Batman faces the Joker in Gotham City', 2008, 152, 9.0, 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.', 1, 1),
('Goodfellas', 'The story of Henry Hill and his life in the mob', 1990, 146, 8.7, 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.', 2, 3),
('E.T. the Extra-Terrestrial', 'A young boy befriends an extraterrestrial', 1982, 115, 7.9, 'A troubled child summons the courage to help a friendly alien escape Earth and return to his home world.', 4, 4),
('The Matrix', 'A hacker discovers reality is a simulation', 1999, 136, 8.7, 'A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.', 4, 5); 