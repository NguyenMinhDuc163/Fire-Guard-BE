# Danh Sách API

## 1. Gửi Dữ Liệu Cảm Biến

- **Mô tả**: Nhận dữ liệu từ các cảm biến (Flame Sensor, MQ2, MQ135) và gửi lên máy chủ để xử lý.
- **URL**: `/api/v1/sensors/data`
- **Phương thức**: `POST`
- **Tham số yêu cầu**:
    - `device_id` (string): ID của thiết bị IoT.
    - `flame_sensor` (boolean): True nếu phát hiện cháy.
    - `mq2_gas_level` (integer): Nồng độ khí gas từ cảm biến MQ2.
    - `mq135_air_quality` (integer): Chỉ số chất lượng không khí từ MQ135.
    - `timestamp` (string): Thời gian (ISO 8601).

- **Ví dụ yêu cầu**:
    ```json
    {
      "device_id": "esp8266_001",
      "flame_sensor": true,
      "mq2_gas_level": 500,
      "mq135_air_quality": 300,
      "timestamp": "2024-10-13T14:00:00Z"
    }
    ```

- **Phản hồi**:
    ```json
    {
      "status": "success",
      "message": "Dữ liệu đã được nhận và đang xử lý."
    }
    ```

- **Mã phản hồi**:
    - `200 OK`: Dữ liệu đã được nhận.
    - `400 Bad Request`: Dữ liệu yêu cầu không hợp lệ.

---

## 2. Lưu Dữ Liệu Vào Cơ Sở Dữ Liệu

- **Mô tả**: Lưu trữ dữ liệu cảm biến vào cơ sở dữ liệu.
- **URL**: `/api/v1/data/save`
- **Phương thức**: `POST`
- **Tham số yêu cầu**:
    - `device_id` (string)
    - `flame_sensor` (boolean)
    - `mq2_gas_level` (integer)
    - `mq135_air_quality` (integer)
    - `timestamp` (string)

- **Ví dụ yêu cầu**:
    ```json
    {
      "device_id": "esp8266_001",
      "flame_sensor": true,
      "mq2_gas_level": 500,
      "mq135_air_quality": 300,
      "timestamp": "2024-10-13T14:00:00Z"
    }
    ```

- **Phản hồi**:
    ```json
    {
      "status": "success",
      "message": "Dữ liệu đã được lưu thành công."
    }
    ```

- **Mã phản hồi**:
    - `200 OK`: Dữ liệu đã lưu thành công.
    - `500 Internal Server Error`: Lỗi khi lưu trữ dữ liệu.

---

## 3. Gửi Thông Báo Đến Người Dùng

- **Mô tả**: Gửi thông báo cảnh báo đến người dùng qua ứng dụng Mobile hoặc Web.
- **URL**: `/api/v1/notifications/send`
- **Phương thức**: `POST`
- **Tham số yêu cầu**:
    - `user_id` (string): ID người dùng.
    - `message` (string): Nội dung thông báo.
    - `timestamp` (string): Thời gian (ISO 8601).

- **Ví dụ yêu cầu**:
    ```json
    {
      "user_id": "user_001",
      "message": "Cảnh báo! Phát hiện cháy.",
      "timestamp": "2024-10-13T14:05:00Z"
    }
    ```

- **Phản hồi**:
    ```json
    {
      "status": "success",
      "message": "Thông báo đã được gửi tới người dùng."
    }
    ```

- **Mã phản hồi**:
    - `200 OK`: Thông báo đã gửi thành công.
    - `400 Bad Request`: Dữ liệu yêu cầu không hợp lệ.

---

## 4. Gọi Lực Lượng Cứu Hỏa

- **Mô tả**: Gửi yêu cầu tự động gọi lực lượng cứu hỏa khi phát hiện cháy nghiêm trọng.
- **URL**: `/api/v1/emergency/call`
- **Phương thức**: `POST`
- **Tham số yêu cầu**:
    - `location` (string): Địa điểm xảy ra sự cố.
    - `incident_details` (string): Chi tiết sự cố.
    - `timestamp` (string): Thời gian (ISO 8601).

- **Ví dụ yêu cầu**:
    ```json
    {
      "location": "123 ABC Street",
      "incident_details": "Phát hiện cháy lớn.",
      "timestamp": "2024-10-13T14:10:00Z"
    }
    ```

- **Phản hồi**:
    ```json
    {
      "status": "success",
      "message": "Lực lượng cứu hỏa đã được thông báo."
    }
    ```

- **Mã phản hồi**:
    - `200 OK`: Lực lượng cứu hỏa đã được thông báo.
    - `500 Internal Server Error`: Lỗi hệ thống.

---

## 5. Thông Báo Cho Người Thân

- **Mô tả**: Gửi thông báo cho người thân khi phát hiện sự cố liên quan đến người dùng.
- **URL**: `/api/v1/notifications/family`
- **Phương thức**: `POST`
- **Tham số yêu cầu**:
    - `user_id` (string): ID người dùng.
    - `family_member_id` (string): ID người thân.
    - `message` (string): Nội dung thông báo.
    - `timestamp` (string): Thời gian (ISO 8601).

- **Ví dụ yêu cầu**:
    ```json
    {
      "user_id": "user_001",
      "family_member_id": "family_001",
      "message": "Người thân của bạn đang gặp nguy hiểm.",
      "timestamp": "2024-10-13T14:12:00Z"
    }
    ```

- **Phản hồi**:
    ```json
    {
      "status": "success",
      "message": "Thông báo đã được gửi đến người thân."
    }
    ```

- **Mã phản hồi**:
    - `200 OK`: Thông báo đã gửi thành công.
    - `400 Bad Request`: Tham số yêu cầu không hợp lệ.

---

## 6. Lấy Lịch Sử Cảnh Báo

- **Mô tả**: Truy xuất lịch sử các thông báo cảnh báo đã được gửi cho người dùng.
- **URL**: `/api/v1/history`
- **Phương thức**: `GET`
- **Tham số yêu cầu**: `{}`
- **Ví dụ yêu cầu**: `/api/v1/history?user_id=user_001&start_date=2024-10-01&end_date=2024-10-13`

- **Phản hồi**:
    ```json
    {
      "status": "success",
      "data": [
        {
          "incident_id": "incident_001",
          "message": "Phát hiện cháy tại khu vực.",
          "timestamp": "2024-10-10T10:00:00Z"
        },
        {
          "incident_id": "incident_002",
          "message": "Khí gas vượt ngưỡng an toàn.",
          "timestamp": "2024-10-11T15:00:00Z"
        }
      ]
    }
    ```

- **Mã phản hồi**:
    - `200 OK`: Lịch sử đã được truy xuất thành công.
    - `404 Not Found`: Không tìm thấy lịch sử.

---

## 7. Kiểm Tra Trạng Thái Hệ Thống IoT

- **Mô tả**: Kiểm tra trạng thái hệ thống IoT.
- **URL**: `/api/v1/iot/status`
- **Phương thức**: `GET`
- **Tham số yêu cầu**: `{}`
- **Ví dụ yêu cầu**: `/api/v1/iot/status`

- **Phản hồi**:
    ```json
    {
      "status": "success",
      "iot_status": {
        "flame_sensor": "active",
        "mq2_sensor": "active",
        "mq135_sensor": "active",
        "buzzer": "inactive"
      }
    }
    ```

- **Mã phản hồi**:
    - `200 OK`: Trạng thái IoT đã được truy xuất thành công.
    - `500 Internal Server Error`: Lỗi hệ thống.

---

## 8. Lấy Dữ Liệu Hướng Dẫn Phòng Cháy Chữa Cháy và Tin Tức Cảnh Báo

- **Mô tả**: Lấy dữ liệu hướng dẫn phòng cháy chữa cháy và tin tức cảnh báo từ hệ thống.
- **URL**: `/api/v1/guides_and_news`
- **Phương thức**: `GET`
- **Tham số yêu cầu**:
    - `category` (string): Loại dữ liệu cần lấy (ví dụ: "guide" hoặc "news").
    - `limit` (integer): Số lượng mục cần lấy, mặc định là 5.

- **Ví dụ yêu cầu**: `/api/v1/guides_and_news?category=guide&limit=5`

- **Phản hồi**:
    ```json
    {
      "status": "success",
      "data": [
        {
          "id": "guide_001",
          "title": "Cách sử dụng bình chữa cháy",
          "type": "video",
          "url": "https://example.com/video1"
        },
        {
          "id": "guide_002",
          "title": "Cách thoát hiểm khi có cháy",
          "type": "article",
          "content": "https://example.com/article1"
        }
      ]
    }
    ```

- **Mã phản hồi**:
    - `200 OK`: Dữ liệu đã được truy xuất thành công.
    - `404 Not Found`: Không có dữ liệu phù hợp.

---

## 9. Thêm Dữ Liệu Hướng Dẫn Phòng Cháy Chữa Cháy và Tin Tức Cảnh Báo

- **Mô tả**: Thêm một hoặc nhiều mục dữ liệu về hướng dẫn phòng cháy chữa cháy và tin tức cảnh báo vào hệ thống.
- **URL**: `/api/v1/guides_and_news/add`
- **Phương thức**: `POST`
- **Tham số yêu cầu**:
    - Một mảng chứa các đối tượng với các trường sau:
        - `title` (string): Tiêu đề của hướng dẫn hoặc tin tức.
        - `type` (string): Loại dữ liệu (ví dụ: "video", "article").
        - `url` (string): URL của tài nguyên (nếu có).
        - `content` (string): Nội dung bài viết (nếu có).
        - `category` (string): Phân loại dữ liệu (ví dụ: "guide" hoặc "news").

- **Ví dụ yêu cầu**:
    ```json
    [
      {
        "title": "Cách sử dụng bình chữa cháy",
        "type": "video",
        "url": "https://example.com/video1",
        "content": null,
        "category": "guide"
      },
      {
        "title": "Cách thoát hiểm khi có cháy",
        "type": "article",
        "url": null,
        "content": "Hướng dẫn cách thoát hiểm khi có cháy",
        "category": "guide"
      }
    ]
    ```

- **Phản hồi**:
    ```json
    {
      "status": "success",
      "message": "Dữ liệu đã được thêm thành công."
    }
    ```

- **Mã phản hồi**:
    - `200 OK`: Dữ liệu đã được thêm thành công.
    - `400 Bad Request`: Dữ liệu không hợp lệ.
    - `500 Internal Server Error`: Lỗi hệ thống khi thêm dữ liệu.

---

## 10. Lưu Trạng Thái Thiết Bị IoT

- **Mô tả**: Lưu trạng thái của một hoặc nhiều thiết bị IoT (cảm biến, báo động, v.v.) vào cơ sở dữ liệu.
- **URL**: `/api/v1/iot/status/save`
- **Phương thức**: `POST`
- **Tham số yêu cầu**:
    - Một mảng chứa các đối tượng với các trường sau:
        - `device_name` (string): Tên của thiết bị IoT (ví dụ: "flame_sensor", "mq2_sensor", "buzzer").
        - `status` (string): Trạng thái của thiết bị (ví dụ: "active", "inactive", "error").
        - `timestamp` (string): Thời gian ghi nhận trạng thái (ISO 8601).

- **Ví dụ yêu cầu**:
    ```json
    [
      {
        "device_name": "flame_sensor",
        "status": "active",
        "timestamp": "2024-10-14T10:00:00Z"
      },
      {
        "device_name": "mq2_sensor",
        "status": "inactive",
        "timestamp": "2024-10-14T10:00:00Z"
      },
      {
        "device_name": "mq135_sensor",
        "status": "active",
        "timestamp": "2024-10-14T10:00:00Z"
      }
    ]
    ```

- **Phản hồi**:
    ```json
    {
      "status": "success",
      "message": "Trạng thái của các thiết bị đã được lưu thành công."
    }
    ```

- **Mã phản hồi**:
    - `200 OK`: Trạng thái thiết bị đã được lưu thành công.
    - `400 Bad Request`: Dữ liệu không hợp lệ.
    - `500 Internal Server Error`: Lỗi hệ thống khi lưu trạng thái.
