DROP TABLE IF EXISTS status,
                     events,
                     users;
-- Статусы
CREATE TABLE status(
    id      INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Name    VARCHAR(50)
);
 
-- События. Хранит пересечение всех всех таблиц
CREATE TABLE events(
    id              INT NOT NULL AUTO_INCREMENT,
    statusid        INT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    link            VARCHAR(255),
    date            DATE NOT NULL,
    place           VARCHAR(255),
    participants    INT,
    footing         VARCHAR(255),
    responsible     VARCHAR(100),

    CONSTRAINT Events_PK PRIMARY KEY (id),
    CONSTRAINT Status_FK FOREIGN KEY (statusid) REFERENCES status(id)
);

CREATE TABLE users(
    id          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(50),
    password    VARCHAR(255),
    UNIQUE KEY (username)
);
