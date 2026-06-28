#!/usr/bin/env python3
"""
출제 산출물 발행 래퍼 (게이트 강제)
====================================
산출물을 outputs에 내보내기 전 반드시 게이트를 통과시킨다.
게이트 FAIL이면 outputs 복사를 거부 → present_files에 줄 파일이 안 생김.

사용법:
  python3 exam_publish.py <exam.json> <원문소스.json> [--map <매핑.json>]

흐름:
  1) exam_gate.py 실행
  2) PASS면 exam.json을 outputs로 복사 + md/review 생성 → 발행 허가 출력
  3) FAIL이면 아무것도 복사 안 하고 미달 항목 출력 + 종료코드 1

★ 출제 산출물은 이 래퍼를 통해서만 내보낸다. (직접 outputs 복사 금지)
"""
import json, sys, subprocess, shutil, os, re

OUT = '/mnt/user-data/outputs'

def main():
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(2)
    exam_path = sys.argv[1]
    orig_path = sys.argv[2]
    map_args = []
    if '--map' in sys.argv:
        map_args = ['--map', sys.argv[sys.argv.index('--map') + 1]]

    gate = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'exam_gate.py')
    print("▶ 게이트 실행 중...\n")
    r = subprocess.run(['python3', gate, exam_path, orig_path] + map_args)

    if r.returncode != 0:
        print("\n" + "=" * 60)
        print("🚫 발행 거부 — 게이트 FAIL. 산출물을 내보내지 않음.")
        print("   위 미달 항목을 수정한 뒤 다시 실행하시오.")
        print("=" * 60)
        sys.exit(1)

    # PASS → 발행
    exam = json.load(open(exam_path))
    base = os.path.basename(exam_path).replace('_exam.json', '')
    dst = f"{OUT}/{base}_exam.json"
    if os.path.abspath(exam_path) != os.path.abspath(dst):
        shutil.copy(exam_path, dst)

    # md / review 생성
    qs = []
    for q in exam['questions']:
        qs.extend(q['questions']) if q.get('type') == 'group' else qs.append(q)
    m = exam.get('meta', {})
    circ = '①②③④⑤'

    md = [f"# {m.get('year','')} {m.get('semester','')} {m.get('exam','')} · {m.get('school','')} {m.get('grade','')} {m.get('subject','')}".strip()]
    md.append(f"### GREATENG 예상문제 — {len(qs)}문항 (게이트 PASS)\n\n---\n")
    for q in qs:
        md.append(f"**{q['num']}. {q['question'].split(chr(10))[0]}** ({q['score']}점)\n")
        rest = q['question'].split('\n', 1)[1].strip() if '\n' in q['question'] else ''
        if rest: md.append(rest + "\n")
        for c in (q.get('choices') or []): md.append(str(c) + "  ")
        md.append("\n---\n")
    md.append("\n## 정답 및 해설\n| 문항 | 유형 | 배점 | 정답 | 출처 | 해설 |\n| :-: | :-: | :-: | :-: | :-: | :-- |")
    for q in qs:
        exp = q['explanation'].split('[출처:')[0].strip().replace('|', '/')
        src = q.get('source', '').split('(')[0].strip()
        md.append(f"| {q['num']} | {q['qtype']} | {q['score']} | {q['answer'][0]} | {src} | {exp} |")
    open(f"{OUT}/{base}_exam.md", 'w').write('\n'.join(md))

    rev = {'key': exam.get('key'), 'meta': m, 'answers': [
        {'num': q['num'], 'qtype': q['qtype'], 'answer': circ.index(q['answer'][0]) + 1,
         'score': q['score'], 'source': q.get('source'), 'explanation': q['explanation']} for q in qs]}
    json.dump(rev, open(f"{OUT}/{base}_review.json", 'w'), ensure_ascii=False, indent=1)

    print("\n" + "=" * 60)
    print("✅ 발행 허가 — outputs에 복사 완료:")
    print(f"   {base}_exam.json / {base}_exam.md / {base}_review.json")
    print("   → 이제 present_files로 제시 가능.")
    print("=" * 60)
    sys.exit(0)

if __name__ == '__main__':
    main()
