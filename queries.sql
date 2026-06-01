CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(20),
    review TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Content based on Sivers' 10/10 list
INSERT INTO books (title, author, isbn, review, rating, created_at) VALUES
('The Courage to Be Disliked', 'Ichiro Kishimi', '9781501197277', 'A profound philosophy book communicating the psychology of Alfred Adler.', 10, '2018-07-25'),
('You Can Negotiate Anything', 'Herb Cohen', '9780553281095', 'Everything is negotiable. Challenge authority. Classic master negotiator tips.', 10, '2023-08-02'),
('You Look Like a Thing and I Love You', 'Janelle Shane', '9780316525244', 'A funny book explaining the basics of artificial intelligence with a cute mascot.', 9, '2023-06-18');
