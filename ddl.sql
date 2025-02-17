create table access_tokens
(
    id         serial
        primary key,
    token      text not null,
    created_at timestamp default CURRENT_TIMESTAMP
);

alter table access_tokens
    owner to postgres;

create table emergency_calls
(
    id               serial
        primary key,
    location         varchar(255) not null,
    incident_details text         not null,
    timestamp        timestamp    not null,
    phone_number     varchar(255),
    status           varchar(50),
    response_message text
);

alter table emergency_calls
    owner to postgres;

create table family_notifications
(
    id               serial
        primary key,
    user_id          integer             not null
        references users
            on delete cascade,
    family_member_id integer   default 0 not null
        references users
            on delete cascade,
    phone_number     varchar(20),
    message          text,
    timestamp        timestamp default CURRENT_TIMESTAMP,
    status           varchar(50),
    response_message text,
    token_fcm        varchar(255),
    longitude        varchar(255),
    latitude         varchar(255),
    is_fire          boolean   default false
);

alter table family_notifications
    owner to postgres;

create table family_requests
(
    id                 serial
        primary key,
    user_id            integer not null,
    family_member_id   integer not null,
    confirmation_token text    not null,
    status             varchar(20) default 'pending'::character varying,
    created_at         timestamp   default CURRENT_TIMESTAMP
);

alter table family_requests
    owner to postgres;

create table guides_and_news
(
    id        serial
        primary key,
    title     varchar(255) not null,
    type      varchar(50),
    url       text,
    content   text,
    category  varchar(50)  not null,
    timestamp timestamp default CURRENT_TIMESTAMP
);

alter table guides_and_news
    owner to postgres;


create table iot_devices_status
(
    device_name varchar(255) not null
        primary key,
    status      varchar(50)  not null,
    timestamp   timestamp    not null
);

alter table iot_devices_status
    owner to postgres;

create table notifications
(
    id               serial
        primary key,
    user_id          varchar(255) not null,
    message          text         not null,
    timestamp        timestamp    not null,
    fcm_token        varchar(255),
    status           varchar(50),
    title            varchar(255),
    body             text,
    family_member_id varchar(255)
);

alter table notifications
    owner to postgres;

create table sensor_data
(
    id                serial
        primary key,
    device_id         varchar(255) not null,
    flame_sensor      varchar(255) not null,
    mq2_gas_level     integer      not null,
    mq135_air_quality integer      not null,
    timestamp         timestamp    not null,
    buzzer_status     boolean
);

alter table sensor_data
    owner to postgres;

create table server_log
(
    id            serial
        primary key,
    status_code   integer,
    method        varchar(10),
    url           text,
    headers       jsonb,
    request_body  jsonb,
    response_body jsonb,
    level         varchar(10),
    message       text,
    timestamp     timestamp default now()
);

alter table server_log
    owner to postgres;

create table users
(
    id              serial
        primary key,
    username        varchar(50)  not null,
    email           varchar(100) not null
        unique,
    password        varchar(255) not null,
    token_fcm       text,
    created_at      timestamp default CURRENT_TIMESTAMP,
    phone_number    varchar,
    click_send_name varchar,
    click_send_key  varchar,
    updated_at      timestamp default CURRENT_TIMESTAMP
);

alter table users
    owner to postgres;

