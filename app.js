(() => {
  const cfg=window.MISSION_CONFIG,app=document.querySelector('#app'),main=document.querySelector('main');
  document.querySelector('#year').textContent=new Date().getFullYear();
  const pages=[['message','Un petit mot'],['memories','Nos souvenirs']];
  let page='welcome';
  let letterOpened=false;
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function render(){
    main.classList.toggle('site-active',page!=='welcome');
    if(page==='welcome'){
      app.innerHTML=`<section class="screen landing welcome-screen"><div class="eyebrow reveal"><span class="eyebrow-line"></span> POUR MARA <span class="eyebrow-line"></span></div><div class="seal reveal"><span class="seal-orbit" aria-hidden="true"></span><img class="seal-photo" src="${esc(cfg.profileImage)}" alt="Photo de Mara"><span class="seal-star" aria-hidden="true">✳</span></div><h1 class="reveal">${esc(cfg.welcome.title)}</h1><form class="access-card reveal" id="accessForm" novalidate><div class="card-top"><label for="birthDate">ACCÈS PERSONNEL</label><span class="card-code">MARA</span></div><label class="question" for="birthDate">Pour accéder à la surprise, entre ta date de naissance.</label><input class="date-input" id="birthDate" name="birthDate" type="text" inputmode="numeric" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="JJ/MM/AAAA" maxlength="10" aria-describedby="dateHint" required><button class="button button-primary validate-button" type="submit"><span>Valider</span><span class="arrow">↗</span></button><p class="hint" id="dateHint" aria-live="polite">Tape les chiffres ; les barres s’ajoutent automatiquement.</p></form><div class="bottom-note reveal"><span class="lock-icon">✦</span> UN ALBUM RIEN QU’À NOUS</div></section>`;
      const input=app.querySelector('#birthDate'),form=app.querySelector('#accessForm');input.addEventListener('input',handleDateInput);form.addEventListener('pointerdown',event=>{if(!event.target.closest('button'))input.focus({preventScroll:true})});form.addEventListener('submit',event=>{event.preventDefault();validateBirthDate()});if(matchMedia('(min-width: 601px)').matches)requestAnimationFrame(()=>input.focus({preventScroll:true}));
    }else{
      const body=page==='home'?renderHome():page==='memories'?renderMemories():renderMessage();
      const showNav=page!=='home';
      const navigation=showNav?`<nav class="site-nav" aria-label="Navigation principale">${pages.map(([id,label])=>`<button class="nav-tab ${page===id?'active':''}" data-page="${id}" aria-current="${page===id?'page':'false'}">${label}</button>`).join('')}</nav>`:'';
      app.innerHTML=`<div class="site-shell">${navigation}${body}</div>`;
      app.querySelectorAll('[data-page]').forEach(button=>button.addEventListener('click',()=>{page=button.dataset.page;render();window.scrollTo({top:0,behavior:'smooth'})}));
    }
    app.querySelectorAll('.reveal').forEach((el,i)=>{el.style.setProperty('--delay',`${100+i*85}ms`);el.classList.add('ready')});
  }

  function renderHome(){return `<section class="main-page"><div class="main-page-heading reveal"><div class="eyebrow"><span class="eyebrow-line"></span> POUR MARA <span class="eyebrow-line"></span></div><h1>Ton petit coin à toi.</h1><p>Choisis ce que tu veux découvrir.</p></div><div class="main-choice-grid"><button class="main-choice choice-left reveal" data-page="message"><span class="choice-number">01</span><span class="choice-title">Un petit mot</span><span class="choice-detail">À ouvrir quand tu veux</span><span class="choice-arrow">↗</span></button><button class="main-choice choice-right reveal" data-page="memories"><span class="choice-number">02</span><span class="choice-title">Nos souvenirs</span><span class="choice-detail">Quelques images et leur histoire</span><span class="choice-arrow">↗</span></button></div></section>`}

  function renderMemories(){
    const cards=cfg.memories.length?cfg.memories.map(item=>`<article class="memory-card reveal"><img src="${esc(item.image)}" alt="${esc(item.description||item.title||'Photo souvenir')}" loading="lazy"><div class="memory-copy"><h2>${esc(item.title||'Un souvenir')}</h2>${item.caption?`<p class="memory-caption">${esc(item.caption)}</p>`:''}${item.text?`<p class="memory-text">${esc(item.text)}</p>`:''}${item.description?`<p class="memory-description">${esc(item.description)}</p>`:''}${item.date?`<small>${esc(item.date)}</small>`:''}</div></article>`).join(''):`<div class="empty-state reveal"><span class="empty-mark">＋</span><b>Les premières photos arrivent bientôt</b><p>Les emplacements sont prêts. Ajoute une photo et ses textes dans config.js.</p><small>UN ALBUM QUI S’ÉCRIT AU FIL DU TEMPS</small></div>`;
    const intro=cfg.memoriesOpening;
    return `<section class="content-section memories-section"><header class="memories-short-intro reveal"><div class="eyebrow"><span class="eyebrow-line"></span> NOS SOUVENIRS <span class="eyebrow-line"></span></div><h1>${esc(intro.title)}</h1><p>${esc(intro.text)}</p>${intro.summary?`<p class="memories-profile-summary">${esc(intro.summary)}</p>`:''}<span class="intro-sparkle" aria-hidden="true">✦</span></header><div class="memory-grid">${cards}</div></section>`
  }

  function renderMessage(){
    const heading=`<header class="section-heading reveal"><div class="eyebrow"><span class="eyebrow-line"></span> POUR TOI <span class="eyebrow-line"></span></div><h1>Un petit mot</h1></header>`;
    if(!letterOpened)return `<section class="content-section message-section">${heading}<div class="envelope-stage" id="envelopeStage"><div class="eyebrow"><span class="eyebrow-line"></span> UN MOT POUR MARA <span class="eyebrow-line"></span></div><p class="envelope-subtitle">Une petite chose à te dire…</p><button class="envelope-button" data-action="open-letter" aria-label="Ouvrir l’enveloppe et découvrir le petit mot"><span class="envelope-figure"><span class="envelope-paper"><span>✦</span></span><span class="envelope-back"></span><span class="envelope-flap"></span><span class="envelope-front"></span><span class="envelope-seal">M</span></span><span class="envelope-label">Pour Mara</span><span class="envelope-hint">Touche l’enveloppe pour l’ouvrir</span></button></div></section>`;
    const paragraphs=(cfg.aboutMara.paragraphs||[]).map(paragraph=>`<p class="intro-paragraph reveal">${esc(paragraph)}</p>`).join('');
    const photos=cfg.aboutMara.images.map((image,index)=>`<img class="about-mara-photo reveal" src="${esc(image)}" alt="Souvenir ${index+1} de Mara et son amie" loading="lazy">`).join('');
    return `<section class="content-section message-section">${heading}<article class="memories-intro about-mara-copy"><div class="intro-sparkle sparkle-one" aria-hidden="true">✦</div><div class="intro-sparkle sparkle-two" aria-hidden="true">✧</div><div class="about-mara-layout ${paragraphs?'has-copy':'photos-only'}"><div class="about-mara-photos">${photos}</div>${paragraphs?`<div class="intro-copy">${paragraphs}</div>`:''}</div></article></section>`
  }

  function handleDateInput(event){
    const input=event.currentTarget,raw=input.value,caret=input.selectionStart??raw.length,digitsBefore=raw.slice(0,caret).replace(/\D/g,'').length,digits=raw.replace(/\D/g,'').slice(0,8);
    const formatted=digits.length>4?`${digits.slice(0,2)}/${digits.slice(2,4)}/${digits.slice(4)}`:digits.length>2?`${digits.slice(0,2)}/${digits.slice(2)}`:digits;
    input.value=formatted;
    const cursor=Math.min(formatted.length,digitsBefore+(digits.length>2&&digitsBefore>=2?1:0)+(digits.length>4&&digitsBefore>=4?1:0));
    input.setSelectionRange(cursor,cursor);
    input.removeAttribute('aria-invalid');
    const hint=app.querySelector('#dateHint');
    if(hint){hint.textContent='Tape les chiffres ; les barres s’ajoutent automatiquement.';hint.classList.remove('hint-error')}
    if(digits.length===8)validateBirthDate();
  }
  function validateBirthDate(){
    const input=app.querySelector('#birthDate'),hint=app.querySelector('#dateHint');if(!input||!hint)return;
    if(!cfg.birthDate){hint.textContent='La date d’accès reste à renseigner dans config.js.';hint.classList.add('hint-error');return}
    const value=input.value.trim(),match=value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    let isCalendarDate=false;
    if(match){const day=Number(match[1]),month=Number(match[2]),year=Number(match[3]),date=new Date(year,month-1,day);isCalendarDate=year>=1900&&date.getFullYear()===year&&date.getMonth()===month-1&&date.getDate()===day}
    if(match&&isCalendarDate&&value===cfg.birthDate){page='home';render();window.scrollTo({top:0,behavior:'smooth'});return}
    hint.textContent='Même ta propre date de naissance, tu ne la connais plus ? Essaie encore !';hint.classList.remove('hint-error');void hint.offsetWidth;hint.classList.add('hint-error');input.setAttribute('aria-invalid','true');
  }

  app.addEventListener('click',event=>{
    const envelopeButton=event.target.closest('[data-action="open-letter"]');if(envelopeButton){const stage=app.querySelector('#envelopeStage');if(stage.classList.contains('is-opening'))return;stage.classList.add('is-opening');envelopeButton.disabled=true;setTimeout(()=>{letterOpened=true;render();window.scrollTo({top:0,behavior:'smooth'})},620)}
  });
  document.querySelector('.brand').addEventListener('click',event=>{if(page==='welcome')return;event.preventDefault();page='home';render();window.scrollTo({top:0,behavior:'smooth'})});

  // Existing star field, with the same light motion and reduced-motion support.
  const canvas=document.querySelector('#starfield'),ctx=canvas.getContext('2d'),reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');let stars=[],width=0,height=0;
  function resize(){const dpr=Math.min(devicePixelRatio||1,2);width=innerWidth;height=innerHeight;canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);stars=Array.from({length:Math.max(38,Math.floor(width*height/15000))},()=>({x:Math.random()*width,y:Math.random()*height,r:Math.random()*1.2+.25,a:Math.random()*.42+.1,s:Math.random()*.004+.001,phase:Math.random()*6.28}));draw(0)}
  function draw(t){ctx.clearRect(0,0,width,height);for(const s of stars){const pulse=reduceMotion.matches ? .82 : .72+Math.sin(t*s.s+s.phase)*.28;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(137,112,180,${s.a*pulse})`;ctx.fill()}if(!reduceMotion.matches)requestAnimationFrame(draw)}
  addEventListener('resize',resize,{passive:true});reduceMotion.addEventListener?.('change',resize);resize();render();
})();
