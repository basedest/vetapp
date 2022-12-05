FROM node:18

# создание директории приложения
WORKDIR /usr/src/app

# установка зависимостей
COPY package.json ./
RUN npm install

# копирование исходного кода
COPY dist .

# запуск приложения
EXPOSE 8080
CMD [ "node", "index.js" ]