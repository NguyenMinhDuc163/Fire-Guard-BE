CREATE TABLE IF NOT EXISTS sensor_data (
  id SERIAL PRIMARY KEY,
  device_id VARCHAR(255) NOT NULL,
  flame_sensor BOOLEAN NOT NULL,
  mq2_gas_level INTEGER NOT NULL,
  mq135_air_quality INTEGER NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emergency_calls (
  id SERIAL PRIMARY KEY,
  location VARCHAR(255) NOT NULL,
  incident_details TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS family_notifications (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  family_member_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS iot_devices_status (
  id SERIAL PRIMARY KEY,
  device_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_device_name UNIQUE (device_name)
);

CREATE TABLE IF NOT EXISTS guides_and_news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(50),
  url TEXT,
  content TEXT,
  category VARCHAR(50) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO guides_and_news (title, type, url, content, category)
VALUES
  ('Cách sử dụng bình chữa cháy', 'video', 'https:  ('Cách thoát hiểm khi có cháy', 'article', NULL, 'https:  ('Tin tức cảnh báo cháy rừng', 'article', NULL, 'https:ON CONFLICT (title) DO NOTHING;
