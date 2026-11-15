import re,sys,json
HAN=re.compile(r'[가-힣]')
def body(path):
    out=[]
    for l in open(path,encoding='utf-8').read().split('\n'):
        s=l.rstrip()
        if '<그림>' in s or 'YBM(박준언)' in s or '2022 개정' in s: continue
        if HAN.search(s): continue
        out.append(s.strip())
    t='\n'.join(out); t=re.sub(r'\n{3,}','\n\n\n',t).strip()
    return t
def clean_dialog_lines(lines):
    res=[];i=0
    while i<len(lines):
        l=lines[i].rstrip()
        m=re.match(r'^(.*\S)\s+\d$',l)
        if m and i+1<len(lines) and lines[i+1].strip() and not lines[i+1].lstrip().startswith('↳'):
            lines[i+1]=m.group(1)+' '+lines[i+1].lstrip(); i+=1; continue
        if re.match(r'^\d$',l.strip()) and i+1<len(lines):  # "B: 6\nI totally"
            i+=1; continue
        res.append(l); i+=1
    # merge "B: " followed by line? handle "B: 6" case
    out=[]
    for l in res:
        out.append(l)
    return out
def dialog(path):
    L=open(path,encoding='utf-8').read().split('\n')
    # annotated Listen&Speak: first '◗ Listen & Speak' then 'A. Listen and Number' then numbered dialogs until first header noise (line '중2')
    i=next(k for k,l in enumerate(L) if l.strip()=='◗ Listen & Speak')
    a=next(k for k in range(i,len(L)) if L[k].strip()=='A. Listen and Number')
    e=next(k for k in range(a,len(L)) if L[k].strip()=='중2')
    ls=[l.rstrip() for l in L[a+1:e]]
    nums0=[int(m.group(1)) for l in ls for m in [re.match(r'^(\d+)\.\s*$',l.strip())] if m]
    nx=(max(nums0) if nums0 else 0)+1
    k4=next((k for k in range(e,len(L)) if L[k].strip()==f'{nx}.'),None)
    if k4:
        k5=next(k for k in range(k4,len(L)) if L[k].strip().startswith('▌'))
        ls+=['']+[l.rstrip() for l in L[k4:k5]]
    # annotated conversation: second 'B. Conversation' with ↳ after
    cands=[k for k,l in enumerate(L) if l.strip()=='B. Conversation']
    c=None
    for k in cands:
        seg=L[k:k+40]
        if any('↳' in s for s in seg) and any(re.match(r'^[A-Z][a-z]*:',s) for s in seg[1:4]):
            c=k;break
    ce=next(k for k in range(c,len(L)) if L[k].strip() in('Expressions','중2'))
    cv=clean_dialog_lines([l.rstrip() for l in L[c+1:ce]])
    # fix 'B: 6' remnant: lines like 'B: ' followed by text
    fixed=[]
    for l in cv:
        if fixed and re.match(r'^[A-Z][a-z]*:\s*$',fixed[-1]):
            fixed[-1]=fixed[-1].rstrip()+' '+l.lstrip(); continue
        fixed.append(l)
    # renumber: listen&speak numbers "1. " lines kept; conversation as next number
    nums=[int(m.group(1)) for l in ls for m in [re.match(r'^(\d+)\.\s*$',l.strip())] if m]
    n=(max(nums) if nums else 0)+1
    txt='\n'.join(ls).strip()
    txt=re.sub(r'^(\d+)\.\s*$',r'\1.',txt,flags=re.M)
    txt=re.sub(r'\n\s*\n+(?=\d+\.\n)','\n\n',txt)
    txt=re.sub(r'\n{3,}','\n\n',txt)
    conv=f'{n}.\n'+'\n'.join(fixed).strip()
    txt=txt.replace('\U000f00e5','');conv=conv.replace('\U000f00e5','')
    return 'A. Listen and Number\n'+txt+'\n\nB. Conversation\n'+conv
def grammar(path):
    L=open(path,encoding='utf-8').read().split('\n')
    blocks=[];i=0
    END=re.compile(r'^\s*(T/F|CHECK|READING.*|❙정답❙|Grammar\+|중2|Lesson\d|[◗✦].*)\s*$')
    while i<len(L):
        if L[i].strip()=='Grammar+':
            j=i+1
            while j<len(L) and not END.match(L[j]): j+=1
            b='\n'.join(x.rstrip() for x in L[i:j]); b=re.sub(r'\n{3,}','\n\n',b).strip()
            blocks.append(b); i=j
        else: i+=1
    # dedupe keep order
    seen=[];[seen.append(b) for b in blocks if b not in seen]
    return '\n\n'.join(seen)
if __name__=='__main__':
    bp,np_,out=sys.argv[1:4]
    d={'body_text':body(bp),'dialog_text':dialog(np_),'grammar_points':grammar(np_)}
    json.dump(d,open(out,'w',encoding='utf-8'),ensure_ascii=False,indent=1)
    for k,v in d.items(): print(k,len(v))
