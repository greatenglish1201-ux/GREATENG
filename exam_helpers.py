#!/usr/bin/env python3
"""
출제 헬퍼: 원문에서 '연산'으로만 문항 본문을 만든다.
→ 원문을 다시 타이핑하지 않으므로 변형(압축·재서술)이 구조적으로 불가능.
   각 함수는 원문을 입력받아, 허용된 가공 1가지만 적용한 본문을 반환한다.
"""
import re

def make_blank(orig, answer_phrase):
    """빈칸추론: 원문에서 정답구 1곳만 ______로. 나머지 100% 보존."""
    if answer_phrase not in orig:
        raise ValueError(f"정답구가 원문에 없음(원문 그대로여야 함): {answer_phrase[:40]}")
    body = orig.replace(answer_phrase, "______", 1)
    return body

def make_grammar(orig, spans, wrong_idx, wrong_word):
    """어법: 원문에 밑줄 5곳(<u>), 그중 wrong_idx를 오류 단어로 교체. 길이 유지.
    spans: 밑줄 칠 5개 단어/구 리스트(원문에 그대로 존재해야 함)."""
    if len(spans) != 5: raise ValueError("어법 밑줄은 정확히 5곳")
    body = orig
    marks = []
    for i, sp in enumerate(spans):
        if sp not in body: raise ValueError(f"밑줄 대상이 원문에 없음: {sp}")
        word = wrong_word if i == wrong_idx else sp
        circ = "①②③④⑤"[i]
        # 첫 등장만 치환
        body = body.replace(sp, f"{circ}<u>{word}</u>", 1)
    return body

def make_vocab(orig, spans, wrong_idx, wrong_word):
    """어휘: 어법과 동일 구조(밑줄 5 + 오답 1). 의미 반대 단어로 교체."""
    return make_grammar(orig, spans, wrong_idx, wrong_word)

def make_insertion(orig_sentences, given_idx):
    """문장삽입: 원문 문장 리스트에서 given_idx 문장을 빼서 [주어진 문장]으로,
    빠진 자리에 ( ① )~( ⑤ ) 표시. 원문 문장은 그대로."""
    given = orig_sentences[given_idx]
    rest = orig_sentences[:given_idx] + orig_sentences[given_idx+1:]
    # 빈자리 5개 마커 삽입(앞부분~)
    marked = []
    circ = "①②③④⑤"
    for i, s in enumerate(rest):
        if i < 5: marked.append(f"( {circ[i]} ) {s}")
        else: marked.append(s)
    body = "[주어진 문장] " + given + "\n\n" + " ".join(marked)
    return body, given

def make_removal(orig_sentences, insert_idx, foreign_sentence):
    """흐름무관: 원문 문장들 사이 insert_idx에 무관 문장 삽입, 번호 5개.
    원문 문장은 그대로, 무관 문장 1개만 추가."""
    sents = orig_sentences[:insert_idx] + [foreign_sentence] + orig_sentences[insert_idx:]
    circ = "①②③④⑤"
    out = []
    ci = 0
    for i, s in enumerate(sents):
        if i == 0: out.append(s)  # 도입문은 번호 없음
        elif ci < 5:
            out.append(f"{circ[ci]}{s}"); ci += 1
        else: out.append(s)
    return " ".join(out)

def make_order(given, paragraphs):
    """글의순서: 단락 3개를 받아 라벨을 섞어 배치≠정답 보장.
    paragraphs = [1st읽을것, 2nd, 3rd] (논리 순서).
    배치는 (A)(B)(C) 순으로 두되, 정답이 (B)-(A)-(C)가 되게 라벨링."""
    p1, p2, p3 = paragraphs  # 읽기순서
    # 라벨: 1st→(B), 2nd→(A), 3rd→(C)  → 정답 (B)-(A)-(C), 배치는 A,B,C 순 출력
    labeled = {'A': p2, 'B': p1, 'C': p3}
    body = f"{given}\n\n(A) {labeled['A']}\n\n(B) {labeled['B']}\n\n(C) {labeled['C']}"
    answer = '②'  # (B)-(A)-(C)
    choices = ['① (A)-(B)-(C)','② (B)-(A)-(C)','③ (B)-(C)-(A)','④ (C)-(A)-(B)','⑤ (C)-(B)-(A)']
    return body, answer, choices

def make_summary(orig, summary_with_blanks):
    """요약문완성: 본문은 원문 그대로 + 요약문만 별도."""
    return f"{orig}\n\n[요약문] {summary_with_blanks}"

def verify_preservation(orig, body, qtype):
    """만든 본문이 원문을 보존하는지 즉시 확인(0.9+ 목표)."""
    def wl(t):
        t = re.sub(r'<u>|</u>|\[주어진 문장\]|\[요약문\]|[①②③④⑤]|\(A\)|\(B\)|\(C\)|_{2,}|\(\s*\)', '', t)
        return set(w for w in re.findall(r"[a-z']+", t.lower()) if len(w) > 2)
    ow = wl(orig)
    if qtype == '흐름무관':
        # 무관 문장 제외 비교는 생략(추가만 했으니 원문은 다 보존됨)
        pass
    kept = len(ow & wl(body)) / len(ow) if ow else 0
    return kept


# ─────────────────────────────────────────────
# 문항 빌더: 출제 시 _orig·_origtype을 자동으로 포함
# (검토 탭이 원문 대조를 할 수 있게 원문을 문항에 박아둠)
# ─────────────────────────────────────────────
def build_question(num, qtype, orig, score, answer, choices, explanation,
                   source='', origtype='', body=None):
    """완성된 문항 dict를 반환. _orig(원문)·_origtype(원유형) 자동 포함.
    body가 None이면 위 make_* 함수로 만든 본문을 따로 넣어야 함."""
    q = {
        'type': 'single',
        'num': num,
        'qtype': qtype,
        'score': score,
        'question': body if body is not None else '',
        'choices': choices,
        'answer': answer,
        'explanation': explanation,
        'source': source,
        '_orig': orig,          # ★ 검토 탭 원문 대조용
    }
    if origtype:
        q['_origtype'] = origtype   # ★ 원유형 회피 검사용
    return q
