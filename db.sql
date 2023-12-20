drop database if exists webshop;
create database webshop;
use webshop;

create table category (
    id int primary key auto_increment,
    name varchar(50) not null
);

create table product (
    id int primary key auto_increment,
    name varchar(100) not null,
    price double (10,2) not null,
    image varchar(50),
    category_id int not null,
    index category_id(category_id),
    foreign key (category_id) references category(id)
    on delete restrict
);



insert into category(name) value ('Kahvi');
insert into category(name) value ('Tee');
insert into category(name) value ('Muut');

insert into product(name, price, image, category_id) values ('Joulukahvi', 10, 'Kahvi1.jpg', 1);
insert into product(name, price, image, category_id) values ('Tummapaahto luomukahvi', 12, 'Kahvi2.jpg', 1);
insert into product(name, price, image, category_id) values ('Suklaakahvi', 9, 'Kahvi3.jpg', 1);
insert into product(name, price, image, category_id) values ('Karamellikahvi', 11, 'Kahvi4.jpg', 1);
insert into product(name, price, image, category_id) values ('Appelsiinikahvi', 13, 'Kahvi55.jpg', 1);
insert into product(name, price, image, category_id) values ('Chai', 5, 'Tee11.jpg', 2);
insert into product(name, price, image, category_id) values ('Musta tee', 3, 'Tee2.jpg', 2);
insert into product(name, price, image, category_id) values ('Kofeiiniton musta tee', 4, 'Tee3.jpg', 2);