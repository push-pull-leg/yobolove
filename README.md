## Dependency

- nodejs : 16.15
- react : 17.0.2
- next : 12.1
- typescript : 4.6.4
- cypress : 10.0.2

## Usage

### 서비스 실행

#### 1. 도커 실행

```shell
$ docker-compose up -d
```

#### 2. 수동 실행

1. nodejs 16 버전 설치 (https://nodejs.org/en/)

2. dependency 설치

```
$ npm install
```

3. 개발환경 실행

```shell
$ npm run dev
```

4. 빌드 & 빌드실행

```shell
#현재 기준 profile로 빌드
$ npm run build
# development env로 빌드
$ npm run build:dev
# test env로 빌드
$ npm run build:staging
# production env로 빌드
$ npm run build:prod
# 서비스 시작
$ npm run start
```

### API 설정

```dotenv
# API 백엔드 호스트
NEXT_PUBLIC_BACKEND_HOST=https://api.dev.yobolove.co.kr
# API mocking 여부. enabled 이면 client faker data를 사용함.
NEXT_PUBLIC_API_MOCKING=enabled
```