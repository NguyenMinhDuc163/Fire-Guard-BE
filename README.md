# Dự án Backend Hệ Thống Báo Cháy Thông Minh
Đây là dự án backend của hệ thống báo cháy thông minh, được thực hiện bởi nhóm 12, lớp IoT và Ứng Dụng. Dự án cung cấp API và các chức năng quản lý cho hệ thống phát hiện và cảnh báo cháy kịp thời. Hệ thống hỗ trợ kết nối với cơ sở dữ liệu để lưu trữ thông tin về thiết bị, sự cố và thông báo. Dưới đây là các cách triển khai dự án.

## Option 1: Chạy trên localhost
Dành cho môi trường phát triển cục bộ, yêu cầu cấu hình thủ công.
1. Sao chép file `.env.example` thành `.env` và chỉnh sửa các giá trị kết nối với cơ sở dữ liệu.
2. Chay file `ddl.sql` trong database để tạo bảng trong database.
3. Cài đặt các dependencies:  
   `npm i`
4. Chạy dự án:  
   `npm run dev`

## Option 2: Chạy với Docker (Kết nối với Database đã deploy)
Sử dụng Docker khi đã có cơ sở dữ liệu PostgreSQL từ xa (Chi tiết cấu hình database vui lòng liên hệ [Nguyễn Đức](https://www.facebook.com/ngminhduc1603))
Linux / macOS:  
`docker run -dp 3000:3000 --name fire_guard_be -v "$(pwd):/app" nguyenduc1603/fire_guard_be:v1.0.0`  
Windows:  
`docker run -dp 3000:3000 --name fire_guard_be -v "%cd%:/app" nguyenduc1603/fire_guard_be:v1.0.0`  
Dừng docker:  
`docker stop fire_guard_be`

## Option 3: Chạy với Docker Compose (Không cần cấu hình)
Sử dụng Docker Compose để triển khai nhanh cả backend và PostgreSQL cục bộ.  
Khởi động dịch vụ:  
`docker-compose up -d`  
Dừng dịch vụ:  
`docker-compose down`  
Dừng và xóa toàn bộ container cùng dữ liệu:  
`docker-compose down -v`
