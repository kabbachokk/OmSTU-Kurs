DROP TABLE IF EXISTS Status,
                     Events,
                     Users;
-- Статусы
CREATE TABLE Status(
    ID    INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Name        VARCHAR(50)
);
 
-- События. Хранит пересечение всех всех таблиц
CREATE TABLE Events(
    ID              INT NOT NULL AUTO_INCREMENT,
    StatusID        INT NOT NULL,
    Title           VARCHAR(255) NOT NULL,
    Link            VARCHAR(255),
    Date            DATE NOT NULL,
    Place           VARCHAR(255),
    Participants    INT,
    Footing         VARCHAR(255),
    Responsible     VARCHAR(100),

    CONSTRAINT Events_PK PRIMARY KEY (ID),
    CONSTRAINT Status_FK FOREIGN KEY (StatusID) REFERENCES Status(ID)
);

CREATE TABLE Users(
    ID          INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Username    VARCHAR(50),
    Password    VARCHAR(255),
    UNIQUE KEY (Username)
);
