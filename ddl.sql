create database fire_alarm_db;
\c fire_alarm_db


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    token_fcm TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TRUNCATE TABLE users RESTART IDENTITY CASCADE;


CREATE TABLE access_tokens (
    id SERIAL PRIMARY KEY,
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE sensor_data (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(255) NOT NULL,
  flame_sensor BOOLEAN NOT NULL,
  mq2_gas_level INTEGER NOT NULL,
  mq135_air_quality INTEGER NOT NULL,
  timestamp TIMESTAMP NOT NULL
);


CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL
);


CREATE TABLE family_notifications (
    id SERIAL PRIMARY KEY,                  -- ID tự động tăng
    user_id VARCHAR(255) NOT NULL,          -- ID của người dùng gửi thông báo
    family_member_id VARCHAR(255),          -- ID của người thân nhận thông báo
    phone_number VARCHAR(255),              -- Số điện thoại người nhận
    message TEXT,                           -- Nội dung thông báo
    status VARCHAR(50),                     -- Trạng thái gửi (success hoặc fail)                 -- Trạng thái gửi (success hoặc fail)
    response_message TEXT,                  -- Tin nhắn chi tiết (lỗi hoặc thành công)
    timestamp TIMESTAMP DEFAULT NOW()       -- Thời gian gửi thông báo
);



-- TRUNCATE TABLE family_notifications RESTART IDENTITY CASCADE;
-- drop table family_notifications;
CREATE TABLE iot_devices_status (
  device_name VARCHAR(255) PRIMARY KEY, -- Mỗi thiết bị IoT chỉ có một trạng thái tại một thời điểm
  status VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP NOT NULL
);


CREATE TABLE guides_and_news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- Loại dữ liệu (ví dụ: 'video', 'article')
  url TEXT, -- URL dẫn đến video hoặc bài viết
  content TEXT, -- Nội dung của bài viết (dành cho article)
  category VARCHAR(50) NOT NULL, -- Phân loại là 'guide' hoặc 'news'
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO guides_and_news (title, type, url, content, category)
VALUES
('Cách sử dụng bình chữa cháy', 'video', 'https://example.com/video1', NULL, 'guide'),
('Cách thoát hiểm khi có cháy', 'article', NULL, 'https://example.com/article1', 'guide'),
('Tin tức cảnh báo cháy rừng', 'article', NULL, 'https://example.com/news1', 'news');


CREATE TABLE server_log (
    id SERIAL PRIMARY KEY,
    status_code INT,            -- Mã trạng thái HTTP (ví dụ 200, 500)
    method VARCHAR(10),         -- Phương thức HTTP (GET, POST, etc.)
    url TEXT,                   -- URL được gọi
    headers JSONB,              -- Lưu headers của request dưới dạng JSON
    request_body JSONB,         -- Lưu body của request
    response_body JSONB,
    level VARCHAR(10),          -- Mức độ log (info, error, etc.)
    message TEXT,               -- Thông điệp chính của log-- Lưu body của response
    timestamp TIMESTAMP DEFAULT NOW()  -- Thời gian tạo log
);

CREATE TABLE emergency_calls (
    id SERIAL PRIMARY KEY,              -- ID tự động tăng
    location VARCHAR(255),              -- Địa điểm của sự cố
    phone_number VARCHAR(255),          -- Số điện thoại được gọi
    incident_details TEXT,              -- Chi tiết sự cố
    status VARCHAR(50),                 -- Trạng thái cuộc gọi (success hoặc fail)
    response_message TEXT,              -- Thông tin phản hồi từ API
    timestamp TIMESTAMP DEFAULT NOW()   -- Thời gian gọi
);

