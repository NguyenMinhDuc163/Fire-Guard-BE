-- Tạo bảng lưu dữ liệu cảm biến
CREATE TABLE IF NOT EXISTS sensor_data (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(255) NOT NULL,
  flame_sensor BOOLEAN NOT NULL,
  mq2_gas_level INTEGER NOT NULL,
  mq135_air_quality INTEGER NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng thông báo cho người dùng
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng lưu thông tin cuộc gọi khẩn cấp
CREATE TABLE IF NOT EXISTS emergency_calls (
  id SERIAL PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  incident_details TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng thông báo dành cho các thành viên gia đình
CREATE TABLE IF NOT EXISTS family_notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  family_member_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tạo bảng lưu trạng thái thiết bị IoT
CREATE TABLE IF NOT EXISTS iot_devices_status (
  id SERIAL PRIMARY KEY,
  device_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_device_name UNIQUE (device_name)  -- Đảm bảo tên thiết bị là duy nhất
);

-- Tạo bảng hướng dẫn và tin tức
CREATE TABLE IF NOT EXISTS guides_and_news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,  -- Đảm bảo tiêu đề là duy nhất
  type VARCHAR(50),
  url TEXT,
  content TEXT,
  category VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chèn dữ liệu mẫu vào bảng guides_and_news
INSERT INTO guides_and_news (title, type, url, content, category)
VALUES
  ('Cách sử dụng bình chữa cháy', 'video', 'https://example.com/video1', NULL, 'guide'),
  ('Cách thoát hiểm khi có cháy', 'article', NULL, 'https://example.com/article1', 'guide'),
  ('Tin tức cảnh báo cháy rừng', 'article', NULL, 'https://example.com/news1', 'news')
ON CONFLICT (title) DO NOTHING;
