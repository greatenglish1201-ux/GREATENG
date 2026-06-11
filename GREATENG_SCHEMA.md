# GREATENG 표준 스키마 v2 (2026-06-11 확정)

모든 기출 분석·예상문제 산출물은 이 명세를 따른다.
Claude(분석·출제), exam-analysis.html(허브), Google Sheets(저장)가 공유하는 단일 표준.

---

## ① 패턴 JSON — 기출 분석 산출물

```json
{
  "key": "제철중_2학년_2026_1학기_기말",
  "school": "제철중",
  "grade": "2학년",
  "year": "2026",
  "semester": "1학기",
  "exam": "기말고사",
  "total": 26,

  "patterns": { "어법": 6, "어휘": 4, "빈칸 추론": 2 },
  "score_dist": { "3": 8, "4": 14, "5": 4 },

  "passage_groups": [
    { "pg": "10~11", "type": "본문", "title": "Lesson 3", "text": "지문 원문..." }
  ],

  "questions": [
    {
      "num": 1,
      "qtype": "어휘",
      "stem": "발문 원문 그대로",
      "score": 4,
      "format": "5지선다",
      "pg": "10~11",
      "original_q": "문항 원문 전체 (발문+선지, 기호·번호·표 포함, 생략 없이)"
    }
  ],

  "summary": "한 줄 요약 (선택)",
  "savedAt": "2026-06-11T12:00:00+09:00"
}
```

### format 표준값
`5지선다` `5지선다_기호` `5지선다_개수` `5지선다_번호` `5지선다_표` `5지선다_영작` `서술형`

---

## ② 예상문제 JSON — 출제 납품물

```json
{
  "meta": {
    "school": "제철중", "grade": "2학년", "year": "2026",
    "semester": "1학기", "exam": "기말고사",
    "total": 26,
    "build": "claude-authored",
    "generated_at": "2026-06-11 14:30 KST",
    "pattern_key": "제철중_2학년_2026_1학기_기말",
    "savedAt": "ISO시각"
  },
  "questions": [
    {
      "type": "group",
      "range": "1~3",
      "passage": "공유 지문 원문",
      "questions": [ { "...single과 동일 필드 (num/qtype/...)": "" } ]
    },
    {
      "type": "single",
      "num": 4,
      "qtype": "빈칸 추론",
      "question": "발문\n(본문/보기 포함)",
      "choices": ["① ...", "② ...", "③ ...", "④ ...", "⑤ ..."],
      "answer": "③",
      "explanation": "해설",
      "score": 4
    }
  ],
  "analysisData": "①의 패턴 JSON을 그대로 동봉 (검증·적중률 분석용)"
}
```

---

## ③ 일관성 규칙 (위반 = 반려)

1. **qtype 어휘 통일** — `questions[].qtype`은 반드시 `patterns`의 키 집합에서만 사용.
   비우기 금지, 발문 문장 넣기 금지.
2. **번호 1:1** — 예상문제 `num` = 기출 `num`. 출제 순서 구조까지 복제.
3. **발문 복제** — 예상문제 발문 첫 줄 = 기출 `stem` 글자 그대로.
4. **배점 복제** — 문항별 배점 = 기출 동일. 총점 = 기출 총점.
5. **original_q 무결성** — 기출 원문은 요약·생략 없이 전문 보존.
6. **시트 호환** — 시트 `question_list` 열(JSON 문자열) ↔ `questions` 배열은 동일 데이터.
   허브 페이지가 양방향 자동 변환.
7. **파일명** — 영문+숫자만. 예: `jechul2_2026_1f_pattern.json`, `jechul2_2026_1f_exam.json`

---

## 검증 기준 (허브 페이지 내장)

| 항목 | 통과 조건 |
|---|---|
| 필수 필드 | key, school, grade, total, patterns, questions |
| 문항 수 | questions.length === total |
| qtype | 전 문항 비어있지 않고 patterns 키에 존재 |
| original_q | 전 문항 보유 |
| stem | 전 문항 보유 |
| 배점 합 | score 합 === 100 (다르면 경고) |
