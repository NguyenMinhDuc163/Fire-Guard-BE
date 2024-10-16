# Sử dụng Node.js phiên bản LTS
FROM node:18

# Tạo thư mục làm việc trong container
WORKDIR /app

# Sao chép tệp package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn của ứng dụng vào container
COPY . .

# Sao chép tệp .env vào container
COPY .env .env

# Thiết lập biến môi trường cho Node.js
ENV NODE_ENV=production

# Mở port ứng dụng Express
EXPOSE 3000

# Chạy ứng dụng với lệnh start trong package.json
CMD ["npm", "start"]
