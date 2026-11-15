#!/usr/bin/env python3
"""
출제 전 데이터 점검 (중등) — 2026-11-15 (36차)

왜: 2026 2학기 중간 적중분석에서 미적중 일부가 데이터 문제였다.
    · 제철중2 '중등지문' L6 행에 L5 본문·대화가 그대로 저장 → L6 대화 대조 불가
    · 교과서 대화(Listen Up 등)·활동 지문이 시트에 없음 → 그 지문에서 나온 문항 대비 못 함
    · 같은 교과서가 'NE능률(김기택)' / '능률(김기택)'처럼 다르게 저장 → 자료실·검색에서 갈라짐
    출제 시작 전에 이걸 자동으로 잡는다.

사용:
  python3 exam_data_check.py <통합분석어시스트.xlsx> <학교> <학년> <레슨,...>
  예) python3 exam_data_check.py assist.xlsx 제철중 중2 "Lesson 7,Lesson 8"

  xlsx는 드라이브에서 exportMimeType=xlsx로 받은 통합분석어시스트 (docs/출제절차.md 0-1단계).
종료코드: 0 = 치명 없음 / 1 = 치명 있음(출제 전에 시트부터 고칠 것)
"""
import sys, re, difflib
from collections import defaultdict

try:
    import openpyxl
except ImportError:
    sys.exit("openpyxl 필요: pip install openpyxl --break-system-packages")


def t(v):
    return str(v if v is not None else '').strip()


def norm_book(pub, author):
    """교재 표기 정규화: 'NE능률'·'능률' 같은 출판사 별칭과 '비상 김진완()'처럼 저자가 출판사 칸에 들어간 경우를 맞춘다."""
    p, a = t(pub), t(author)
    m = re.match(r'^(.+?)[\s(]+([가-힣]{2,4})\)?$', p)   # '비상 김진완' / '비상(김진완)'
    if m and not a:
        p, a = m.group(1).strip(), m.group(2)
    p = p.replace('()', '').strip()
    p = re.sub(r'^NE\s*', '', p)                          # NE능률 = 능률
    return f"{p}({a})" if a else p


def main():
    if len(sys.argv) < 5:
        print(__doc__); sys.exit(2)
    path, school, grade = sys.argv[1], sys.argv[2], sys.argv[3]
    lessons = [x.strip() for x in sys.argv[4].split(',') if x.strip()]

    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    if '중등지문' not in wb.sheetnames:
        sys.exit("FAIL: '중등지문' 시트 없음")
    rows = list(wb['중등지문'].iter_rows(values_only=True))
    H = {t(h): i for i, h in enumerate(rows[0])}
    g = lambda r, k: t(r[H[k]]) if k in H and H[k] < len(r) else ''

    mine = [r for r in rows[1:] if g(r, 'school') == school and g(r, 'grade') == grade]
    fails, warns, oks = [], [], []

    # 1) 교재 표기 불일치 (같은 학교·학년인데 출판사·저자 문자열이 여러 개)
    raw_books = sorted({f"{g(r,'publisher')}|{g(r,'author')}" for r in mine})
    norm_books = sorted({norm_book(g(r, 'publisher'), g(r, 'author')) for r in mine})
    if len(raw_books) > 1:
        msg = f"교재 표기 {len(raw_books)}가지: " + ' / '.join(b.replace('|', ' 저자:') for b in raw_books)
        (warns if len(norm_books) == 1 else fails).append(
            msg + (" → 같은 교과서로 보임, 표기 통일 권장(자료실 교재별 탭이 갈라짐)" if len(norm_books) == 1
                   else " → 서로 다른 교과서가 섞였는지 확인"))

    # 2) 범위 레슨 행 존재·내용
    by_lesson = defaultdict(list)
    for r in mine:
        by_lesson[g(r, 'lesson')].append(r)
    for L in lessons:
        rs = by_lesson.get(L, [])
        if not rs:
            fails.append(f"{L}: 행 없음 — 자료실에서 본문·대화문·문법포인트 저장 필요"); continue
        if len(rs) > 1:
            warns.append(f"{L}: 행 {len(rs)}개(교재 표기가 달라 따로 저장됐을 수 있음)")
        r = rs[-1]
        body, dia, gp = g(r, 'body_text'), g(r, 'dialog_text'), g(r, 'grammar_points')
        if not body: fails.append(f"{L}: 본문 비어 있음")
        if not dia: warns.append(f"{L}: 대화문 비어 있음 — 중등 시험은 대화 5~9문항, 비면 그 구간 대비 불가")
        if not gp: warns.append(f"{L}: 문법포인트 비어 있음 — 어법 출제 근거 없음(교과서 문법포인트 확인 후 입력)")
        if not g(r, 'semester'): warns.append(f"{L}: 학기 칸 비어 있음")
        # 대화문 안에 Listen Up / Conversation 등 하위 대화가 몇 개인지(대략)
        n_dia = len(re.findall(r'(?m)^\s*(?:\d+\.|\[?(?:Listen|Conversation|Talk|Real Life|대화)\b)', dia))
        oks.append(f"{L}: 본문 {len(body)}자 · 대화 {len(dia)}자(구간 약 {n_dia}개) · 문법포인트 {len(gp)}자")

    # 3) 레슨 간 복붙 중복 (제철중2 L5=L6 사고)
    ls = [L for L in lessons if by_lesson.get(L)]
    all_ls = sorted(by_lesson)
    for i, a in enumerate(all_ls):
        for b in all_ls[i + 1:]:
            if a not in ls and b not in ls: continue
            ra, rb = by_lesson[a][-1], by_lesson[b][-1]
            for k, nm in (('body_text', '본문'), ('dialog_text', '대화문')):
                x, y = g(ra, k), g(rb, k)
                if len(x) > 200 and len(y) > 200:
                    sim = difflib.SequenceMatcher(None, x[:3000], y[:3000]).ratio()
                    if sim > 0.9:
                        fails.append(f"{a} ↔ {b} {nm} {sim:.0%} 같음 — 한쪽에 다른 레슨 내용이 저장됨(재입력 필요)")

    print(f"■ 출제 전 데이터 점검 — {school} {grade} / 범위 {', '.join(lessons)}")
    for x in oks: print("  ·", x)
    for x in warns: print("  ⚠", x)
    for x in fails: print("  ✗", x)
    print("결과:", "FAIL (시트부터 고칠 것)" if fails else ("PASS (경고 확인)" if warns else "PASS"))
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
