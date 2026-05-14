CREATE TABLE IF NOT EXISTS age_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    min_age INT,
    max_age INT
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    pdf_url TEXT NOT NULL,
    cover_url TEXT,
    age_group_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_books_age_group
        FOREIGN KEY (age_group_id)
        REFERENCES age_groups(id)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS audiobooks (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL UNIQUE,
    audio_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audiobooks_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS book_categories (
    id SERIAL PRIMARY KEY,
    book_id INT NOT NULL,
    category_id INT NOT NULL,
    CONSTRAINT fk_book_categories_book
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_book_categories_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON DELETE CASCADE,
    CONSTRAINT uq_book_category UNIQUE (book_id, category_id)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO age_groups (name, min_age, max_age)
VALUES
    ('Infantil', 0, 12),
    ('Juvenil', 13, 17),
    ('Adulto', 18, NULL)
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name)
VALUES
    ('Religião'),
    ('Educação'),
    ('Literatura'),
    ('Tecnologia'),
    ('Infantil')
ON CONFLICT (name) DO NOTHING;