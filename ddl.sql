create table users
(
    id         serial
        primary key,
    username   varchar(50)  not null,
    email      varchar(100) not null
        unique,
    password   varchar(255) not null,
    token_fcm  text,
    created_at timestamp default CURRENT_TIMESTAMP
);

create table access_tokens
(
    id         serial
        primary key,
    token      text not null,
    created_at timestamp default CURRENT_TIMESTAMP
);


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



create table family_notifications
(
    id               serial
        primary key,
    user_id          varchar(255) not null,
    family_member_id varchar(255) default '0'::character varying,
    phone_number     varchar(20),
    message          text,
    timestamp        timestamp,
    status           varchar(50),
    response_message text,
    token_fcm        varchar(255),
    longitude        varchar(255),
    latitude         varchar(255),
    is_fire          boolean      default false
);


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


create table iot_devices_status
(
    device_name varchar(255) not null
        primary key,
    status      varchar(50)  not null,
    timestamp   timestamp    not null
);

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


