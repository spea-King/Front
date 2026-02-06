#!/bin/bash

# 실전 면접 연습 서비스 설치 스크립트
# 이 스크립트는 프로젝트를 설치하고 실행하는 데 필요한 모든 단계를 수행합니다.

set -e  # 에러 발생 시 스크립트 중단

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 헤더 출력
echo ""
echo "=========================================="
echo "  실전 면접 연습 서비스 설치"
echo "  AI Interview Practice Setup"
echo "=========================================="
echo ""

# Node.js 버전 확인
echo -e "${BLUE}[1/5] Node.js 버전 확인 중...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js가 설치되어 있지 않습니다.${NC}"
    echo -e "${YELLOW}Node.js 18.0 이상을 설치해주세요: https://nodejs.org${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 버전이 너무 낮습니다 (현재: $(node -v))${NC}"
    echo -e "${YELLOW}Node.js 18.0 이상이 필요합니다.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js 버전: $(node -v)${NC}"

# npm 버전 확인
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm이 설치되어 있지 않습니다.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm 버전: $(npm -v)${NC}"
echo ""

# interview-app 디렉토리 확인
echo -e "${BLUE}[2/5] 프로젝트 디렉토리 확인 중...${NC}"
if [ ! -d "interview-app" ]; then
    echo -e "${RED}❌ interview-app 디렉토리를 찾을 수 없습니다.${NC}"
    echo -e "${YELLOW}이 스크립트는 프로젝트 루트 디렉토리에서 실행해야 합니다.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ interview-app 디렉토리 확인 완료${NC}"
echo ""

# 기존 node_modules 삭제 여부 확인
if [ -d "interview-app/node_modules" ]; then
    echo -e "${YELLOW}⚠️  기존 node_modules 폴더가 발견되었습니다.${NC}"
    read -p "기존 패키지를 삭제하고 새로 설치하시겠습니까? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}기존 node_modules 삭제 중...${NC}"
        rm -rf interview-app/node_modules
        rm -f interview-app/package-lock.json
        echo -e "${GREEN}✓ 삭제 완료${NC}"
    fi
    echo ""
fi

# 패키지 설치
echo -e "${BLUE}[3/5] npm 패키지 설치 중...${NC}"
echo -e "${YELLOW}이 작업은 몇 분 정도 소요될 수 있습니다.${NC}"
cd interview-app

if npm install; then
    echo -e "${GREEN}✓ 패키지 설치 완료${NC}"
else
    echo -e "${RED}❌ 패키지 설치 실패${NC}"
    exit 1
fi
echo ""

# 빌드 테스트
echo -e "${BLUE}[4/5] 프로젝트 빌드 테스트 중...${NC}"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 빌드 성공${NC}"
else
    echo -e "${YELLOW}⚠️  빌드 테스트 실패 (무시하고 계속)${NC}"
fi
echo ""

# 완료 메시지
echo -e "${BLUE}[5/5] 설치 완료!${NC}"
echo ""
echo "=========================================="
echo -e "${GREEN}✓ 모든 설치가 완료되었습니다!${NC}"
echo "=========================================="
echo ""
echo "다음 명령어로 개발 서버를 실행하세요:"
echo ""
echo -e "${YELLOW}  cd interview-app${NC}"
echo -e "${YELLOW}  npm run dev${NC}"
echo ""
echo "그 후 브라우저에서 다음 주소로 접속하세요:"
echo -e "${BLUE}  http://localhost:5173${NC}"
echo ""
echo "기타 명령어:"
echo -e "  ${YELLOW}npm run build${NC}   - 프로덕션 빌드"
echo -e "  ${YELLOW}npm run preview${NC} - 빌드 결과 미리보기"
echo -e "  ${YELLOW}npm run lint${NC}    - 코드 린트 검사"
echo ""
