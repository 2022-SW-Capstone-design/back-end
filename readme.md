## 서버 환경 설치(로컬)
1. mysql 설치(+ 환경변수 설정)
2. .env 파일 서버 루트 디렉토리에 생성 후 내용 입력
```
DB_USERNAME = mysql 루트유저 아이디
DB_PASSWORD = mysql 루트유저 비밀번호
DB_HOST = 127.0.0.1
DB_PORT = 3306

JWT_SECRET_KEY = 비밀키
GOOGLE_CLIENT_ID = 구글 api 클라이언트 id
GOOGLE_CLIENT_SECRET = 구글 api 클라이언트 비밀키
```
3. 디펜던시 설치
```
npm i
```
4. sequelize로 db 생성
```
npx sequelize db:create
```
5. 서버 실행
```
npm start
```
6. db 재생성
```
npx sequelize db:drop
npx sequelize db:create
```