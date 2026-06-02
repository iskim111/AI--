#!/usr/bin/env python3
"""Generate fake welfare center usage data (10,000 rows) as 이용현황.xlsx."""

from __future__ import annotations

import random
from datetime import date, timedelta
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "이용현황.xlsx"

SURNAMES = list("김이박최정강조윤장임한오서신권황안송류전홍고문양손배조백허유남심노정하곽성차주우구신임나전민")
GIVEN_M = ["민준", "서준", "도윤", "예준", "시우", "하준", "주원", "지호", "준서", "건우", "현우", "우진", "선우", "연우", "지훈"]
GIVEN_F = ["서윤", "서연", "지우", "하윤", "민서", "지유", "윤서", "채원", "지민", "수아", "예은", "다은", "소율", "하은", "유나"]
GU = ["종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구"]
DONG = ["역삼동", "삼성동", "잠실동", "목동", "신촌동", "홍제동", "공덕동", "망원동", "상암동", "노량진동", "사당동", "신림동", "봉천동", "길동", "천호동", "명일동", "화곡동", "등촌동", "불광동", "수유동"]
DISABILITY_TYPES = ["지적장애", "자폐성장애", "뇌병변장애", "지체장애", "청각장애", "시각장애", "정신장애", "언어장애", "발달장애"]
DISABILITY_GRADES = ["1급", "2급", "3급", "4급", "5급", "6급"]
PROGRAMS = ["주간활동", "직업재활", "언어치료", "미술치료", "음악치료", "운동치료", "인지훈련", "사회적응훈련", "가족상담", "방과후활동"]
CENTERS = ["행복복지관", "희망복지관", "새봄복지관", "한마음복지관", "드림복지관", "사랑복지관", "햇살복지관", "미래복지관"]
STATUSES = ["이용중", "이용중", "이용중", "휴원", "종료예정"]
WORKERS = ["김복지", "이상담", "박케어", "최지원", "정미래", "강하늘", "윤서연", "임도윤", "한수진", "오민재"]


def korean_name(rng: random.Random, gender: str) -> str:
    given = rng.choice(GIVEN_M if gender == "남" else GIVEN_F)
    return f"{rng.choice(SURNAMES)}{given}"


def phone(rng: random.Random) -> str:
    return f"010-{rng.randint(1000, 9999):04d}-{rng.randint(1000, 9999):04d}"


def seoul_address(rng: random.Random) -> str:
    gu = rng.choice(GU)
    dong = rng.choice(DONG)
    return f"서울특별시 {gu} {dong} {rng.randint(1, 999)}-{rng.randint(1, 120)}"


def random_date(rng: random.Random, start: date, end: date) -> date:
    delta = (end - start).days
    return start + timedelta(days=rng.randint(0, delta))


def generate_rows(count: int, seed: int = 42) -> pd.DataFrame:
    rng = random.Random(seed)
    today = date.today()
    start = date(2018, 1, 1)

    rows = []
    for i in range(1, count + 1):
        gender = rng.choice(["남", "여"])
        user_name = korean_name(rng, gender)
        guardian = korean_name(rng, rng.choice(["남", "여"]))
        enroll = random_date(rng, start, today - timedelta(days=30))
        last_use = random_date(rng, enroll, today)
        rows.append(
            {
                "이용자코드": f"U{enroll.year}{i:05d}",
                "이용자명": user_name,
                "성별": gender,
                "출생연도": rng.randint(1960, 2018),
                "연락처": phone(rng),
                "장애구분": rng.choice(DISABILITY_TYPES),
                "장애등급": rng.choice(DISABILITY_GRADES),
                "주소": seoul_address(rng),
                "보호자명": guardian,
                "보호자 연락처": phone(rng),
                "복지관명": rng.choice(CENTERS),
                "이용프로그램": rng.choice(PROGRAMS),
                "이용시작일": enroll.isoformat(),
                "최근이용일": last_use.isoformat(),
                "월이용횟수": rng.randint(0, 20),
                "등록상태": rng.choice(STATUSES),
                "담당복지사": rng.choice(WORKERS),
            }
        )

    return pd.DataFrame(rows)


def main() -> None:
    df = generate_rows(10_000)
    df.to_excel(OUTPUT, index=False, engine="openpyxl")
    print(f"Saved {len(df):,} rows -> {OUTPUT}")


if __name__ == "__main__":
    main()
