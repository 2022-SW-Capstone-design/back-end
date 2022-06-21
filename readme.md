# 📖Noveland - 백엔드 서버
웹소설 기반 미디어믹스 플랫폼 'Noveland'의 rest api 서버 입니다.

## 🔍 프로젝트 소개
<img src="https://user-images.githubusercontent.com/75475398/174743538-4c41caff-496c-43ba-ad6a-39fa0e3bc90d.PNG" width="70%" height="70%"/>
<img src="https://user-images.githubusercontent.com/75475398/174743741-3267e03b-bbdb-469b-85bc-332b93e5163c.PNG" width="70%" height="70%"/>

## 📚 기술 스택(백엔드 부분)
<img src="https://user-images.githubusercontent.com/75475398/174744723-d28d214b-6593-4012-a2bf-e6de1ef705a0.PNG" width="60%" height="60%"/>

## ✔️ 주요 기능 및 기술
### 🕹️ 기능
* 구글 로그인
* 컨텐츠(소설, 챕터, 일러스트, 음악) 업로드
* 컨텐츠 구매 / 조합 및 열람

### ⚙️ 기술
* CRUD 작업을 수행하는 rest api 서버
* JWT Bearer token을 통한 사용자 인증 방식 사용
* Sequelize ORM을 통해 DB 관리
* 백엔드의 git 저장소를 프론트엔드와 분리하여 개별 배포 진행
* AWS EC2를 Docker 호스트로 사용하여 웹 서버(Nginx), 웹 앱 서버(Node.js) 관리 및 배포
* 클라이언트의 https 요청을 받기 위해 배포된 웹 앱 서버에 https 적용
* GitHub Actions를 사용해 master 브랜치에 push 된 내용이 자동적으로 배포된 서버에 적용되도록 CD 설정

## 🧑 백엔드 팀 구성
* [SeungheonShin(신승헌)](https://github.com/SeungheonShin)
* [iPodNano6G(상현석)](https://github.com/iPodNano6G)
* [dorameme(김연수)](https://github.com/dorameme)

