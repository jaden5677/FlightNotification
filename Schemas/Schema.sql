

create table Users(
    usersID VARCHAR(16) NOT NULL,
    fName VARCHAR(30) NOT NULL,
    lName VARCHAR(30) NOT NULL,
    mName VARCHAR(100),
    email VARCHAR(50) NOT NULL,
    passportIDN VARCHAR(50) NOT NULL,
    nationality VARCHAR(40) NOT NULL,
    DOB DATE NOT NULL,
    gender VARCHAR(1),
    cNumber VARCHAR(12),
    aType INT NOT NULL,
    specialR INT,
    CONSTRAINT FK_AccountType FOREIGN KEY (aType) REFERENCES AccountType(AcctTypeID),
    CONSTRAINT FK_specialReq FOREIGN KEY (specialR) REFERENCES SpecialRequests(requestID),
    PRIMARY KEY(usersID)
);


reate table AccountType(
    AcctTypeID INT PRIMARY KEY,
    AcctTypeName VARCHAR(10)
);


insert into AccountType(AccountID, AcctName) VALUES
(1, 'Customer'),
(2, 'Admin');


create table SpecialRequests(
    requestID int PRIMARY KEY,
    requestName VARCHAR(40),
    requestDescription VARCHAR(100)
);




insert into SpecialRequests(requestID, requestName, requestDescription) VALUES
(1, 'DR', 'Dietary Restrictions'),
(2, 'MC', 'Medical Conditions'),
(3, 'PT', 'Pets or Service Animals'),
(4, 'UM', 'Unaccompanied Minors');



create table Flights(
    flightID VARCHAR(10) PRIMARY KEY,
    flightNumber VARCHAR(10) NOT NULL,
    departureAirport VARCHAR(10) NOT NULL,
    arrivalAirport VARCHAR(10) NOT NULL,
    boardingTime DATETIME NOT NULL,
    departureDateTime DATETIME NOT NULL,
    arrivalDateTime DATETIME NOT NULL,
    aircraftType VARCHAR(20) NOT NULL,
    stops INT NOT NULL,
    gate VARCHAR(5) NOT NULL,
);

create table Notifications(
    notificationID INT PRIMARY KEY,
    flightNumber VARCHAR(10) NOT NULL,
    boardingTime DATETIME NOT NULL,
    departureDateTime DATETIME NOT NULL,
    gate VARCHAR(5) NOT NULL,
    class VARCHAR(10) NOT NULL,
    group INT NOT NULL,
);