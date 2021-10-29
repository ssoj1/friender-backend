
create table users (
    id serial primary key, 
    username varchar(50) unique not null, 
    password varchar(100) not null, 
    email varchar(255) not null, 
    firstName varchar(50) not null, 
    lastName varchar(50) not null, 
    zipcode varchar(10) not null
);

create table hobbies (
    id serial primary key, 
    user_id int not null, 
    hobby varchar(50) not null, 
    foreign key(user_id) references users(id)
);

create table interests (
    id serial primary key, 
    user_id int not null, 
    interest varchar(50) not null, 
    foreign key(user_id) references users(id)
);

create table photos (
    id serial primary key, 
    user_id int not null, 
    url varchar(500) not null, 
    foreign key(user_id) references users(id)
);

create table messages (
    id serial primary key, 
    user_id int not null, 
    msg varchar(2000) not null, 
    foreign key(user_id) 
    references users(id)
);