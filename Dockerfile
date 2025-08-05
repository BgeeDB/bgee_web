FROM node:22-alpine AS production-dependencies-env
COPY ./package.json package-lock.json /app/
WORKDIR /app
# RUN npm ci --omit=dev --ignore-scripts
RUN npm i --omit=dev --ignore-scripts

FROM node:22-alpine AS build-env
COPY . /app/
WORKDIR /app
# RUN npm ci --ignore-scripts
# Fixing bug: https://github.com/npm/cli/issues/4828
# RUN rm package-lock.json
RUN npm i --ignore-scripts
RUN npm run build

FROM node:22-alpine
COPY ./package.json package-lock.json /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules
COPY --from=build-env /app/build /app/build
WORKDIR /app
CMD ["npm", "run", "start"]
