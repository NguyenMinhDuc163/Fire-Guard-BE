Run linux
docker run -dp 3000:3000 \
--name fire_guard_be \
-v "$(pwd):/app" \
nguyenduc1603/fire_guard_be:v1.0.0

 
window

docker run -dp 3000:3000 ^
--name fire_guard_be ^
-v "%cd%:/app" ^
nguyenduc1603/fire_guard_be:v1.0.0



# Hướng dẫn chạy và dừng ứng dụng Express.js

## **Option 1: Chạy với cơ sở dữ liệu bên ngoài (Production)**
**Linux / macOS:**  
`docker run -dp 3000:3000 --name fire_guard_be -v "$(pwd):/app" nguyenduc1603/fire_guard_be:v1.0.0`  
**Windows:**  
`docker run -dp 3000:3000 --name fire_guard_be -v "%cd%:/app" nguyenduc1603/fire_guard_be:v1.0.0`  
**Dừng và xóa container:**  
`docker stop fire_guard_be && docker rm fire_guard_be`

---

## **Option 2: Chạy hoàn chỉnh với Docker Compose (Kèm cơ sở dữ liệu cục bộ)**
**Khởi động dịch vụ:**  
`docker-compose up -d`  
**Dừng dịch vụ:**  
`docker-compose down`  
**Dừng và xóa toàn bộ container cùng dữ liệu:**  
`docker-compose down -v`
