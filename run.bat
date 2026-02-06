@echo off
REM 실전 면접 연습 서비스 실행 스크립트 (Windows)
REM 개발 서버를 빠르게 실행합니다.

echo.
echo ==========================================
echo   실전 면접 연습 서비스 실행
echo   AI Interview Practice
echo ==========================================
echo.

REM interview-app 디렉토리 확인
if not exist "interview-app" (
    echo [ERROR] interview-app 디렉토리를 찾을 수 없습니다.
    pause
    exit /b 1
)

REM node_modules 확인
if not exist "interview-app\node_modules" (
    echo [WARNING] 패키지가 설치되어 있지 않습니다.
    echo 먼저 setup.bat을 실행하여 설치해주세요.
    pause
    exit /b 1
)

echo [OK] 개발 서버를 시작합니다...
echo.
echo 브라우저에서 다음 주소로 접속하세요:
echo   http://localhost:5173
echo.
echo 서버를 종료하려면 Ctrl+C를 누르세요.
echo.

REM 개발 서버 실행
cd interview-app
call npm run dev
