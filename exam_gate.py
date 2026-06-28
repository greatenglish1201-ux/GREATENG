#!/usr/bin/env python3
"""
GREATENG 출제 검증 게이트 (안전장치)
=====================================
사용법:
  python3 exam_gate.py <exam.json> <원문소스.json> [--map <문항→pid매핑.json>]

원문소스.json: { "27ST_E_03_02": "원문 전체 텍스트", ... }  (pid → 원문)
매핑.json(선택): { "1": "27ST_E_28_01", ... }  (문항번호 → pid)
  매핑 없으면 각 문항의 source 또는 _src에서 자동 추출 시도, 실패 시 본문 역매칭.

종료코드: 0=전부통과, 1=실패(미달 문항 존재) → 통과 전엔 산출물 내지 말 것.
"""
import json, re, sys

THRESHOLD = 0.90          # 원문 보존율 최저선
TARGET    = 0.96          # 권장 목표(경고선)

def wl(t):
    t = re.sub(r'<u>|</u>|\[주어진 문장\]|\[요약문\]|[①②③④⑤a-eA-E]\)|[①②③④⑤]|\(\s*\)|\(A\)|\(B\)|\(C\)|_{2,}', '', t)
    return set(w for w in re.findall(r"[a-z']+", t.lower()) if len(w) > 2)

def flatten(exam):
    qs = []
    for q in exam['questions']:
        if q.get('type') == 'group':
            qs.extend(q['questions'])
        else:
            qs.append(q)
    return qs

def body_of(q):
    return q['question'].split('\n', 1)[1] if '\n' in q['question'] else q['question']

def preservation(q, orig):
    """원문 보존율: 무관은 정답문장 제외, 요약은 본문만"""
    ow = wl(orig)
    if not ow: return None
    body = body_of(q)
    if q['qtype'] == '요약문완성':
        body = body.split('[요약문]')[0]
    if q['qtype'] == '흐름무관':
        a = q['answer'][0]
        body = re.sub(rf'{a}[^①②③④⑤]+', '', body)
    bw = wl(body)
    if not bw: return None
    overlap = len(ow & bw)
    # 원문이 출제본보다 1.5배 이상 길면(교과서 課 단위 등): 출제본이 원문에 포함되는 비율로 평가
    #   (한 문항이 긴 본문의 일부만 발췌하는 게 정상이므로 원문 기준이면 부당하게 낮아짐)
    # 그 외(절대유형·수특영독 등 1지문=1문항): 원문 기준(원문 문장 삭제·압축을 잡아야 함)
    if len(ow) >= len(bw) * 1.5:
        return overlap / len(bw)   # 출제본 단어가 원문에 다 있는가(=창작·변형 없는가)
    return overlap / len(ow)        # 원문 단어가 출제본에 다 있는가(=삭제·압축 없는가)

def auto_map_by_body(qs, origs):
    """본문 역매칭: 각 문항 본문과 가장 겹치는 원문 pid"""
    cache = {pid: wl(txt) for pid, txt in origs.items() if txt}
    m = {}
    for q in qs:
        bw = wl(body_of(q))
        if len(bw) < 5: continue
        best, bv = None, 0
        for pid, ow in cache.items():
            ov = len(bw & ow) / len(bw)
            if ov > bv: bv, best = ov, pid
        if best and bv >= 0.5:
            m[str(q['num'])] = best
    return m

def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(2)
    exam = json.load(open(sys.argv[1]))
    origs = json.load(open(sys.argv[2]))
    qmap = None
    if '--map' in sys.argv:
        qmap = json.load(open(sys.argv[sys.argv.index('--map') + 1]))

    qs = flatten(exam)
    n = len(qs)
    circ = '①②③④⑤'
    fails = []   # 치명(통과 불가)
    warns = []   # 경고

    # ---- 1차 구조 ----
    total = sum(q['score'] for q in qs)
    if abs(total - 100) > 0.1: fails.append(f"[1차] 배점합 {total}≠100")
    nums = [q['num'] for q in qs]
    if nums != list(range(1, n + 1)): fails.append(f"[1차] 번호 비연속")
    inbody_re = re.compile(r'문장삽입|삽입|흐름무관|무관|어법|어휘')
    for q in qs:
        ch = q.get('choices')
        qt = q.get('qtype','')
        body = q.get('question','')
        circ_in_body = sum(body.count(c) for c in '①②③④⑤')
        if not ch:
            if inbody_re.search(qt):
                if circ_in_body < 5:
                    fails.append(f"[1차] {q['num']}번({qt}) 본문 ①~⑤ {circ_in_body}개(<5)+선지없음")
            else:
                fails.append(f"[1차] {q['num']}번({qt}) 선지 없음(필수)")
            continue
        if len(ch) != 5: fails.append(f"[1차] {q['num']}번 선지 {len(ch)}개")
        if q['answer'][0] not in [str(c).strip()[0] for c in ch]:
            fails.append(f"[1차] {q['num']}번 정답기호 불일치")

    # ---- 동일 지문 중복 검사 (경고) ----
    # 같은 지문을 여러 문항이 쓰면 세트 구성일 수 있으나(제목+어휘 등), 의도치 않은 중복일 수도 있어 경고.
    # 판정: ①출처(괄호 세부 포함) 정확 일치  AND  ②본문 어휘 70%+ 일치 → 동일 지문으로 간주
    def body_words(q):
        b = body_of(q)
        b = re.sub(r'<u>|</u>|[①②③④⑤]|_{2,}|\(A\)|\(B\)|\(C\)', '', b)
        return set(w for w in re.findall(r"[a-z']+", b.lower()) if len(w) > 2)
    seen = []
    dup_groups = {}
    for q in qs:
        bw = body_words(q)
        src = (q.get('source') or '').strip()
        matched = None
        for idx, (pnum, psrc, pbw) in enumerate(seen):
            if not bw or not pbw: continue
            overlap = len(bw & pbw) / min(len(bw), len(pbw))
            same_src = src and psrc and src == psrc
            # 본문 90%+ 거의동일, 또는 (출처정확일치 AND 본문70%+)
            if overlap >= 0.90 or (same_src and overlap >= 0.70):
                matched = pnum; break
        if matched:
            dup_groups.setdefault(matched, [matched]).append(q['num'])
        else:
            seen.append((q['num'], src, bw))
    for base, group in dup_groups.items():
        nums_str = '·'.join(str(x) for x in group)
        src = next((q.get('source','') for q in qs if q['num']==base), '')
        warns.append(f"[중복] {nums_str}번이 동일 지문({src}). 의도된 세트면 무시, 아니면 다른 지문으로 교체")

    # ---- 정답분포 균등 ----
    from collections import Counter
    dist = Counter(q['answer'][0] for q in qs)
    if n % 5 == 0:
        exp = n // 5
        if any(dist[c] != exp for c in circ):
            fails.append(f"[분포] 불균등 {dict(sorted(dist.items()))} (각 {exp} 기대)")

    # ---- 2차 밑줄/형식 ----
    for q in qs:
        u = q['question'].count('<u>')
        if q['qtype'] in ('어법', '어휘') and u != 5:
            fails.append(f"[2차] {q['num']}번({q['qtype']}) 밑줄 {u}개(≠5)")
        # 함축의미는 밑줄 친 부분의 의미를 묻는 유형이라 밑줄 정상
        if q['qtype'] not in ('어법', '어휘', '함축의미') and u > 0:
            warns.append(f"[2차] {q['num']}번({q['qtype']}) 불필요 밑줄 {u}")

    # ---- 4차 텍스트/표시 ----
    for q in qs:
        b = body_of(q)
        if '...' in b or '…' in b or '(중략)' in b:
            fails.append(f"[4차] {q['num']}번 축약(...) 발견")
        if q['qtype'] == '빈칸추론' and '___' not in b:
            warns.append(f"[4차] {q['num']}번 빈칸 표시 확인")
        if q['qtype'] == '글의순서' and not all(x in b for x in ('(A)', '(B)', '(C)')):
            fails.append(f"[4차] {q['num']}번 순서 (A)(B)(C) 누락")
        if q['qtype'] == '요약문완성' and ('(A)' not in b or '(B)' not in b):
            fails.append(f"[4차] {q['num']}번 요약 (A)(B) 누락")

    # ---- 5차 순서 선지=해설 + 배치 결함 ----
    for q in qs:
        if q['qtype'] == '글의순서':
            ch = q.get('choices')
            if not ch:
                fails.append(f"[5차] {q['num']}번 순서 선지 없음(필수)")
                continue
            cc = ch[circ.index(q['answer'][0])]
            mm = re.search(r'\(([ABC])\)-\(([ABC])\)-\(([ABC])\)', q['explanation'])
            if mm and f"({mm.group(1)})-({mm.group(2)})-({mm.group(3)})" not in cc:
                fails.append(f"[5차] {q['num']}번 순서 선지↔해설 불일치")
            # ★배치=정답 결함: 지문 단락이 (A)(B)(C) 순으로 놓였는데 정답 읽기순서도 A-B-C면
            #   학생이 라벨 순서대로 위에서 읽기만 해도 정답 → 변별력 없는 결함
            body = q['question']
            labels = [x for x in re.findall(r'\(([ABC])\)', body) if x in 'ABC']
            seen = []
            for x in labels:
                if x not in seen: seen.append(x)
            place = ''.join(seen[:3])
            am = re.findall(r'[ABC]', cc)
            read = ''.join(am[:3])
            if place == 'ABC' and read == 'ABC':
                fails.append(f"[5차★] {q['num']}번 순서 결함: 지문배치(A)(B)(C)=정답(A)-(B)-(C). 그냥 읽으면 답 → 정답이 섞인 순서가 되게 재배치")

    # ---- 6차 출처 ----
    for q in qs:
        if '[출처:' not in q['explanation']:
            fails.append(f"[6차] {q['num']}번 해설 출처 누락")

    # ---- 7차 ★원문 보존율 (핵심 안전장치) ----
    if not qmap:
        qmap = auto_map_by_body(qs, origs)
    pres_fail = []
    no_orig = []
    for q in qs:
        pid = qmap.get(str(q['num']))
        if not pid or pid not in origs:
            no_orig.append(q['num']); continue
        p = preservation(q, origs[pid])
        if p is None: continue
        if p < THRESHOLD:
            pres_fail.append((q['num'], q['qtype'], f"{p:.0%}"))
        elif p < TARGET:
            warns.append(f"[7차] {q['num']}번 보존율 {p:.0%}(<96% 권장)")
    for num, qt, pc in pres_fail:
        fails.append(f"[7차★] {num}번({qt}) 원문보존 {pc} < 90% → 원문복원 필요")
    if no_orig:
        warns.append(f"[7차] 원문 대조 못한 문항: {no_orig} (원본 확보 후 재검증 권장)")

    # ---- 결과 ----
    print("=" * 60)
    print(f" 검증 게이트: {sys.argv[1].split('/')[-1]}  ({n}문항)")
    print("=" * 60)
    if warns:
        print(f"\n⚠️  경고 {len(warns)}건:")
        for w in warns: print("   ", w)
    if fails:
        print(f"\n❌ 치명 {len(fails)}건 — 통과 불가. 아래 수정 전 산출물 금지:")
        for f in fails: print("   ", f)
        print("\n>>> 결과: FAIL <<<")
        sys.exit(1)
    else:
        print("\n✅ 전 항목 통과 (치명 0건). 산출물 제시 가능.")
        print(f"   정답분포 {dict(sorted(dist.items()))}")
        print("\n>>> 결과: PASS <<<")
        sys.exit(0)

if __name__ == '__main__':
    main()
