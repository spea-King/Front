#!/bin/bash

# 실전 면접 연습 서비스 실행 스크립트
# 개발 서버를 빠르게 실행합니다.

set -e

# 색상 정의
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${BLUE}=========================================="
echo -e "  실전 면접 연습 서비스 실행"
echo -e "  AI Interview Practice"
echo -e "==========================================${NC}"
echo ""

# interview-app 디렉토리 확인
if [ ! -d "interview-app" ]; then
    echo -e "${RED}❌ interview-app 디렉토리를 찾을 수 없습니다.${NC}"
    exit 1
fi

# node_modules 확인
if [ ! -d "interview-app/node_modules" ]; then
    echo -e "${YELLOW}⚠️  패키지가 설치되어 있지 않습니다.${NC}"
    echo -e "${YELLOW}먼저 ./setup.sh를 실행하여 설치해주세요.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ 개발 서버를 시작합니다...${NC}"
echo ""
echo -e "${YELLOW}브라우저에서 다음 주소로 접속하세요:${NC}"
echo -e "${BLUE}  http://localhost:5173${NC}"
echo ""
echo -e "${YELLOW}서버를 종료하려면 Ctrl+C를 누르세요.${NC}"
echo ""

# 개발 서버 실행
cd interview-app
npm run dev
