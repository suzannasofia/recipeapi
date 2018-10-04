CREATE TABLE recipes (
  id serial primary key,
  title character varying(255) NOT NULL UNIQUE,
  description text NOT NULL,
  ingredients text NOT NULL,
  instructions text NOT NULL,
  course character varying(55),
  cuisine character varying(55),
  type character varying(55),
  image character varying(255)
);

CREATE TABLE users (
  id serial primary key,
  username character varying(32) NOT NULL UNIQUE,
  password character varying(255) NOT NULL,
  name character varying(64) NOT NULL,
  image character varying(255)
);
