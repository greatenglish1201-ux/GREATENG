#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GREATENG 중등 영어 출제 검증 게이트 (안전장치) — 고등 게이트의 중등판
=====================================================================
고등(exam_gate.py)과 동일 철학: 통과 전엔 산출물 금지. 종료코드 0=PASS, 1=FAIL.

사용법:
  python3 exam_gate_middle.py <exam.json>
  python3 exam_gate_middle.py <exam.json> <원문소스.json>   # 원문 보존율까지

exam.json 평면스키마:
  { "key", "meta":{...}, "questions":[ {num,qtype,score,question,choices,answer,explanation,source,_orig?} ] }

중등 특화 검사(고등과 다른 부분):
  - 어법 8문항이 '핵심 언어형식'에서만 출제됐는지(교과서 dialog_text 언어형식)는 사람이 확인 — 게이트는 형식만.
  - ★교차 힌트(정답 누출): 한 문항의 정답이 다른 문항 본문/선지에 노출되는지 (이번 제철중2/중3에서 실제로 잡은 핵심).
  - ★영영풀이→빈칸 노출: 영영풀이 문항의 정답 단어가 다른 빈칸 문항 정답과 겹치는지.
  - ★어법 예문 풀 중복: 어법 문항들이 같은 판정문장을 돌려쓰는지.
  - 개수형(n개) 문항: 정답 개수 = 해설 설명 개수 정합.
  - 번호기호형(흐름무관·문장삽입): 본문 ①~⑤ 있으면 하단 '① ①' 반복선지는 군더더기(경고).
"""
import json, re, sys
from collections import Counter, defaultdict

CIRC = '①②③④⑤'

def wl(t):
    t = re.sub(r'<u>|</u>|\[주어진 문장\]|\[보기\]|[ⓐ-ⓕ①-⑤a-eA-E]\)|[①-⑤ⓐ-ⓕ]|\(\s*\)|\([ABC]\)|_{2,}', '', t)
    return set(w for w in re.findall(r"[a-z']+", t.lower()) if len(w) > 2)

def flatten(exam):
    qs=[]
    for q in exam['questions']:
        if q.get('type')=='group': qs.extend(q['questions'])
        else: qs.append(q)
    return qs

def body_of(q):
    return q['question'].split('\n',1)[1] if '\n' in q['question'] else q['question']

def alltext(q):
    """본문+선지 전체 텍스트(누출 검사용)"""
    parts=[q.get('question','')]+list(q.get('choices',[]))
    return ' '.join(parts)

def sentences(text):
    text=re.sub(r'<u>|</u>|[ⓐ-ⓕ①-⑤]|\([ABC0-9]\)','',text)
    return [s for s in re.split(r'(?<=[.?!])\s+|\n', text)]

def norm(s):
    return ' '.join(re.sub(r'[^a-z ]',' ',s.lower()).split())

def main():
    if len(sys.argv)<2:
        print(__doc__); sys.exit(2)
    exam=json.load(open(sys.argv[1]))
    origs=json.load(open(sys.argv[2])) if len(sys.argv)>2 else {}
    qs=flatten(exam)
    n=len(qs)
    fails=[]; warns=[]

    # ---- 1차 구조 ----
    total=sum(q['score'] for q in qs)
    if abs(total-100)>0.1: fails.append(f"[1차] 배점합 {total}≠100")
    nums=[q['num'] for q in qs]
    if nums!=list(range(1,n+1)): fails.append("[1차] 번호 비연속")
    inbody_re=re.compile(r'문장삽입|삽입|흐름무관|무관')
    numonly_qs=[]   # 번호기호형(① ① 반복) 문항
    for q in qs:
        ch=q.get('choices'); qt=q.get('qtype',''); body=q.get('question','')
        circ_in_body=sum(body.count(c) for c in CIRC)
        if ch:
            # 번호만 반복하는 선지인지
            isnum=all(re.sub(r'[①-⑤\s]','',str(c))=='' for c in ch)
            if isnum and circ_in_body>=5: numonly_qs.append(q['num'])
        if not ch:
            if inbody_re.search(qt):
                if circ_in_body<5:
                    fails.append(f"[1차] {q['num']}번({qt}) 본문 ①~⑤ {circ_in_body}개(<5)+선지없음")
            else:
                fails.append(f"[1차] {q['num']}번({qt}) 선지 없음(필수)")
            continue
        if len(ch)!=5: fails.append(f"[1차] {q['num']}번 선지 {len(ch)}개")
        if q['answer'][0] not in [str(c).strip()[0] for c in ch] and q['answer'][0] not in CIRC:
            pass
        # 정답기호가 ①~⑤ 중 하나인지
        if q['answer'][0] not in CIRC:
            fails.append(f"[1차] {q['num']}번 정답기호 비정상({q['answer']})")

    # ---- 2차 밑줄 형식 ----
    for q in qs:
        u=q['question'].count('<u>')
        # 중등 어휘/어법 밑줄형은 5개 권장이나, ⓐ~ⓔ 기호형도 허용 → 5 또는 0 또는 ⓐ~ⓔ
        circ_ab=sum(q['question'].count(c) for c in 'ⓐⓑⓒⓓⓔ')
        if q['qtype'] in ('어법','어휘') and u not in (0,5) and circ_ab<5:
            warns.append(f"[2차] {q['num']}번({q['qtype']}) 밑줄 {u}개(어법/어휘는 5개 또는 ⓐ~ⓔ 권장)")

    # ---- 3차 정답분포 ----
    dist=Counter(q['answer'][0] for q in qs)
    if n%5==0:
        exp=n//5
        if any(dist[c]!=exp for c in CIRC):
            warns.append(f"[3차] 정답분포 {dict(sorted(dist.items()))} (각 {exp} 권장, 중등 26문항은 다소 편차 허용)")
    else:
        mx,mn=max(dist[c] for c in CIRC),min(dist[c] for c in CIRC)
        if mx-mn>=3:
            warns.append(f"[3차] 정답분포 쏠림 {dict(sorted(dist.items()))} (최다-최소 {mx-mn}≥3, 재배치 권장)")

    # ---- 4차 텍스트 ----
    for q in qs:
        b=body_of(q)
        if '...' in b or '…' in b or '(중략)' in b:
            fails.append(f"[4차] {q['num']}번 축약(...) 발견")

    # ---- 5차 해설 출처 ----
    for q in qs:
        if '[출처:' not in q.get('explanation',''):
            fails.append(f"[5차] {q['num']}번 해설 출처 누락")

    # ---- 6차 ★개수형 정답-해설 정합 ----
    # '개수는?' 발문 + 선지가 'n개'이면 정답 숫자와 해설 설명이 맞는지 사람확인 표시
    for q in qs:
        stem=q['question'].split('\n',1)[0]
        ch=q.get('choices',[])
        is_count = ('개수' in stem) and ch and all(re.search(r'\d+\s*개',str(c)) for c in ch)
        if is_count:
            # 정답 'n개'의 n 추출
            idx=CIRC.index(q['answer'][0])
            m=re.search(r'(\d+)\s*개',str(ch[idx]))
            cnt=m.group(1) if m else '?'
            warns.append(f"[6차] {q['num']}번 개수형: 정답={cnt}개 — 해설의 '어색/올바른 것 N개' 설명과 일치하는지 사람확인")

    # ---- 7차 ★★교차 힌트(정답 누출) — 중등 핵심 ----
    # (a) 동일 영어문장(4어절+)이 2개 이상 문항에 등장 → 누출 위험
    sent_map=defaultdict(set)
    for q in qs:
        for s in sentences(alltext(q)):
            k=norm(s)
            if len(k.split())>=4: sent_map[k].add(q['num'])
    for k,locs in sent_map.items():
        if len(locs)>1:
            warns.append(f"[7차★] 동일문장 {sorted(locs)}번 중복: '{k[:45]}...' — 한쪽이 정답이면 누출, 다른 소재로 교체")

    # (b) 빈칸/영영풀이 정답 단어가 다른 문항 본문·선지에 노출
    #     영영풀이/단어빈칸형의 '정답 단어'를 추출
    STOP={'the','and','for','out','about','with','from','into','that','this','they',
          'you','your','his','her','its','our','their','are','was','were','have','has',
          'not','but','can','will','would','should','than','then','too','very','can\'t',
          'as long as','although','because','however','therefore','of their food','the real taste'}
    def answer_words(q):
        idx=CIRC.index(q['answer'][0])
        ch=q.get('choices',[])
        if idx>=len(ch): return []
        c=str(ch[idx])
        # 짝맞추기형(A–B–C, —/–/- 구분자) 정답은 기능어 조합이라 누출검사 제외
        if re.search(r'[—–]\s*[A-Za-z]', c) or c.count('-')>=2:
            return []
        ws=re.findall(r"[A-Za-z][A-Za-z']{2,}", c)
        out=[]
        for w in ws:
            wl_=w.strip().lower()
            if len(wl_)>3 and wl_ not in STOP:
                out.append(wl_)
        return out
    # 단일 어휘 빈칸(정답 선지가 '한 단어' 또는 '단어 조합')만 누출검사.
    #   대화빈칸·어법빈칸(정답이 문장/구문)은 제외 → 단어가 아니라 표현이라 오탐.
    def is_word_blank(q):
        if '빈칸' not in q.get('qtype',''): return False
        idx=CIRC.index(q['answer'][0]); ch=q.get('choices',[])
        if idx>=len(ch): return False
        # 모든 선지가 1~3단어 이내(짧은 어휘/구)면 단어빈칸으로 간주
        return all(len(re.findall(r"[A-Za-z']+",str(c)))<=3 for c in ch)
    for q in qs:
        if not is_word_blank(q): continue
        for w in answer_words(q):
            for other in qs:
                if other['num']==q['num']: continue
                if other.get('source') and q.get('source') and other['source']==q['source']: continue
                if re.search(r'\b'+re.escape(w)+r'\b', alltext(other).lower()):
                    warns.append(f"[7차★] {q['num']}번 정답어 '{w}' → {other['num']}번에 노출 (빈칸 답 누출 점검)")

    # ---- 8차 번호기호형 군더더기 ----
    for num in numonly_qs:
        warns.append(f"[8차] {num}번 본문 ①~⑤ + 하단 '① ①' 반복선지 = 공간낭비. 발문이 '①~⑤ 중'이면 하단선지 생략 권장")

    # ---- 9차 원문 보존율(원본 제공 시) ----
    if origs:
        for q in qs:
            pid=q.get('_src') or q.get('source')
            if pid and pid in origs:
                ow=wl(origs[pid]); bw=wl(body_of(q))
                if ow and bw:
                    p=len(ow&bw)/len(ow if len(ow)<len(bw)*1.5 else bw)
                    if p<0.90: warns.append(f"[9차] {q['num']}번 원문보존 {p:.0%}<90%")

    # ---- 결과 ----
    print("="*64)
    print(f" 중등 검증 게이트: {sys.argv[1].split('/')[-1]}  ({n}문항)")
    print("="*64)
    if warns:
        print(f"\n⚠️  경고/사람확인 {len(warns)}건:")
        for w in warns: print("   ",w)
    if fails:
        print(f"\n❌ 치명 {len(fails)}건 — 통과 불가:")
        for f in fails: print("   ",f)
        print("\n>>> 결과: FAIL <<<")
        sys.exit(1)
    print(f"\n✅ 치명 0건. 정답분포 {dict(sorted(dist.items()))}")
    print("   (경고/사람확인 항목은 출제자가 판단 — 특히 [7차★] 누출은 반드시 확인)")
    print("\n>>> 결과: PASS(치명0) <<<")
    sys.exit(0)

if __name__=='__main__':
    main()
