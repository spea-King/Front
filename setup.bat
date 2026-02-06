@echo off
REM 실전 면접 연습 서비스 설치 스크립트 (Windows)
REM 이 스크립트는 프로젝트를 설치하고 실행하는 데 필요한 모든 단계를 수행합니다.

setlocal enabledelayedexpansion

echo.
echo ==========================================
echo   실전 면접 연습 서비스 설치
echo   AI Interview Practice Setup
echo ==========================================
echo.

REM Node.js 버전 확인
echo [1/5] Node.js 버전 확인 중...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js가 설치되어 있지 않습니다.
    echo Node.js 18.0 이상을 설치해주세요: https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js 버전: %NODE_VERSION%

REM npm 버전 확인
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm이 설치되어 있지 않습니다.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm 버전: %NPM_VERSION%
echo.

REM interview-app 디렉토리 확인
echo [2/5] 프로젝트 디렉토리 확인 중...
if not exist "interview-app" (
    echo [ERROR] interview-app 디렉토리를 찾을 수 없습니다.
    echo 이 스크립트는 프로젝트 루트 디렉토리에서 실행해야 합니다.
    pause
    exit /b 1
)
echo [OK] interview-app 디렉토리 확인 완료
echo.

REM 기존 node_modules 삭제 여부 확인
if exist "interview-app\node_modules" (
    echo [WARNING] 기존 node_modules 폴더가 발견되었습니다.
    set /p "CLEAN=기존 패키지를 삭제하고 새로 설치하시겠습니까? (Y/N): "
    if /i "!CLEAN!"=="Y" (
        echo 기존 node_modules 삭제 중...
        rmdir /s /q "interview-app\node_modules" 2>nul
        del /f /q "interview-app\package-lock.json" 2>nul
        echo [OK] 삭제 완료
    )
    echo.
)

REM 패키지 설치
echo [3/5] npm 패키지 설치 중...
echo 이 작업은 몇 분 정도 소요될 수 있습니다.
cd interview-app

call npm install
if %errorlevel% neq 0 (
    echo [ERROR] 패키지 설치 실패
    cd ..
    pause
    exit /b 1
)
echo [OK] 패키지 설치 완료
echo.

REM 빌드 테스트
echo [4/5] 프로젝트 빌드 테스트 중...
call npm run build >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] 빌드 테스트 실패 (무시하고 계속)
) else (
    echo [OK] 빌드 성공
)
echo.

REM 완료 메시지
echo [5/5] 설치 완료!
cd ..
echo.
echo ==========================================
echo [OK] 모든 설치가 완료되었습니다!
echo ==========================================
echo.
echo 다음 명령어로 개발 서버를 실행하세요:
echo.
echo   cd interview-app
echo   npm run dev
echo.
echo 그 후 브라우저에서 다음 주소로 접속하세요:
echo   http://localhost:5173
echo.
echo 기타 명령어:
echo   npm run build   - 프로덕션 빌드
echo   npm run preview - 빌드 결과 미리보기
echo   npm run lint    - 코드 린트 검사
echo.
pause
