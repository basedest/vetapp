FROM node:18

# создание директории приложения
WORKDIR /usr/src/app

## установка зависимостей
COPY package.json yarn.lock ./
#RUN yarn global add typescript
RUN yarn

# копирование исходного кода
COPY dist ./dist

# запуск приложения
EXPOSE 3000
CMD ["sh", "-c", "yarn start"]