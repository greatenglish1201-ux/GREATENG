import re,json,sys
HAN=re.compile(r'[가-힣]')
n=lambda s:re.sub(r'[^a-z0-9]','',s.lower().replace('’',"'").replace('‘',"'"))
def ss_sents(L):
    secs=[k for k,l in enumerate(L) if l.strip().startswith('READING 본문')]
    res=[]
    for si,s in enumerate(secs):
        e=secs[si+1] if si+1<len(secs) else len(L)
        try: ss=next(k for k in range(s,e) if L[k].strip()=='Sentence Structures')
        except StopIteration: continue
        end=next((j for j in range(ss,e) if L[j].strip()=='Grammar+' or re.fullmatch(r'중[123]',L[j].strip())),e)
        k=ss
        while k<end:
            if re.fullmatch(r'\d+',L[k].strip()):
                j=k+1;eng=[]
                while j<end and L[j].strip() and not HAN.search(L[j]): eng.append(L[j].strip());j+=1
                for x in eng:
                    if x.startswith(('⤷','↳')) or x.startswith('Date & Time'): continue
                    x=re.sub(r'\s+\d+$','',x).replace('(that) ','')
                    for p in re.split(r'(?<=[.!?”])\s+',x):
                        if len(n(p))>6: res.append(p)
                k=j
            else: k+=1
    return res
def utter(t):
    return [re.sub(r'^\s*[A-Za-z0-9]+:\s*','',l).strip() for l in t.split('\n') if re.match(r'^\s*(\d+\.\s*)?[A-Z][A-Za-z0-9]*:\s*\S',l)]
def main(label,src_html,row,canon):
    L=open(src_html,encoding='utf-8').read().split('\n'); src=n('\n'.join(L))
    body=row['body_text']; nb=n(body)
    print(f'\n######## {label}')
    # body
    sents=[s for s in re.split(r'(?<=[.!?”])\s+|\n+',body) if len(n(s))>6]
    miss_src=[s for s in sents if n(s) not in src]
    ss=ss_sents(L); miss_body=[s for s in ss if n(s) not in nb]
    dup=[s for s in set(sents) if sents.count(s)>1]
    print(f'[본문] 문장 {len(sents)} / 원본에 없는 문장 {len(miss_src)}: {miss_src[:8]}')
    print(f'       해설(Sentence Structures) 문장 {len(ss)} 중 본문에 빠진 것 {len(miss_body)}: {miss_body[:8]}')
    if dup: print('       중복 문장:',dup)
    print('       첫 줄:',body.strip().split('\n')[0][:80])
    # dialog
    U=utter(row['dialog_text']); C=utter(canon['dialog_text'])
    nU=[n(u) for u in U]; nC=[n(c) for c in C]
    extra=[u for u in U if n(u) not in nC]; missing=[c for c in C if n(c) not in nU]
    dups=sorted({u for u in U if nU.count(n(u))>1})
    print(f'[대화] 발화 {len(U)} (원본 {len(C)}) / 원본에 없는 발화 {len(extra)}: {extra[:6]}')
    print(f'       빠진 발화 {len(missing)}: {missing[:6]}')
    if dups: print(f'       두 번 들어간 발화 {len(dups)}: {dups[:4]}')
    glued=[l[:70] for l in row['dialog_text'].split('\n') if len(re.findall(r'[a-z.!?][A-Z][a-z]*:',l))]
    if glued: print(f'       줄바꿈 없이 붙은 줄 {len(glued)}: {glued[:3]}')
    junk=[l.strip() for l in row['dialog_text'].split('\n') if re.fullmatch(r'\d',l.strip()) or l.strip()=='Expressions']
    if junk: print(f'       각주 번호·Expressions 찌꺼기 {len(junk)}줄')
    hdr=[l.strip() for l in row['dialog_text'].split('\n') if re.match(r'^[AB]\. ',l.strip())]
    print('       구간 제목:',hdr)
    # grammar
    gt=lambda g:[b.split('\n')[1].strip() if '\n' in b else b[:20] for b in g.split('Grammar+')[1:]]
    G=gt(row['grammar_points']); CG=gt(canon['grammar_points'])
    print(f'[문법] 시트 {G}')
    print(f'       원본 {CG}')
    print('       빠진 항목:',[x for x in CG if x not in G],' / 원본에 없는 항목:',[x for x in G if x not in CG])
    flat=[l[:60] for l in row['grammar_points'].split('\n') if len(l)>400]
    if flat: print(f'       한 줄로 뭉개진 긴 줄 {len(flat)}')
    bad=[c for c in set(row['body_text']+row['dialog_text']+row['grammar_points']) if 0xE000<=ord(c)<=0xF8FF or ord(c)>=0xF0000]
    if bad: print('       깨진 문자:',[hex(ord(c)) for c in bad])
    print('[기타] 학기',row.get('semester'),'연도',row.get('year'))
if __name__=='__main__':
    label,src,rowf,key,canf=sys.argv[1:6]
    rows=json.load(open(rowf)); row=rows[key] if key!='-' else rows
    if isinstance(row,list): row=row[0]
    main(label,src,row,json.load(open(canf)))
