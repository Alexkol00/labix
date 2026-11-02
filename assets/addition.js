(function(){
 'use strict';
 const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
 function setPair(aEl,bEl,update){
   function onChange(changed){let a=Number(aEl.value),b=Number(bEl.value);
     if(changed===aEl){bEl.max=10-a;if(b>10-a){b=10-a;bEl.value=b;}}
     if(changed===bEl&&b>10-a){a=10-b;aEl.value=a;}
     bEl.max=10-a;
     update(a,b);
   }
   aEl.addEventListener('input',()=>onChange(aEl));bEl.addEventListener('input',()=>onChange(bEl));onChange(aEl);
 }
 setPair($('#aInput'),$('#bInput'),(a,b)=>{
   $('#aValue').textContent=a;$('#bValue').textContent=b;$('#sumA').textContent=a;$('#sumB').textContent=b;$('#sumResult').textContent=a+b;
   const area=$('#appleRow');area.replaceChildren();
   const first=document.createElement('span'); first.textContent='🍎'.repeat(a)||'∅';
   const plus=document.createElement('span');plus.className='plus-apples';plus.textContent='+';
   const second=document.createElement('span');second.textContent='🍏'.repeat(b)||'∅';
   area.append(first,plus,second);area.setAttribute('aria-label',`${a} красных яблок плюс ${b} зелёных яблок — ${a+b} всего`);
 });
 setPair($('#lineA'),$('#lineB'),(a,b)=>{
   $('#lineAValue').textContent=a;$('#lineBValue').textContent=b;$('#lineSumA').textContent=a;$('#lineSumB').textContent=b;$('#lineResult').textContent=a+b;
   const row=$('#numberLine');row.replaceChildren();for(let i=0;i<=10;i++){const cell=document.createElement('span');cell.className='line-cell';if(i===a)cell.classList.add('is-start');if(i>a&&i<=a+b)cell.classList.add('is-hop');if(i===a+b)cell.classList.add('is-end');cell.textContent=i;row.append(cell);}
   row.setAttribute('aria-label',`Числовая прямая: старт ${a}, шагов ${b}, итог ${a+b}`);
   $('#lineNotice').textContent=`Начинаем на ${a}, делаем ${b} шагов — получаем ${a+b}.`;
 });
 let step=0,correct=0,answered=false,answer=0;
 const quizTotal=10;
 function randomInt(n){return Math.floor(Math.random()*(n+1));}
 function newQuestion(){answered=false;const a=randomInt(10),b=randomInt(10-a);answer=a+b;
   $('#quizStep').textContent=`Задача ${step+1} из ${quizTotal}`;$('#quizScore').textContent=`Верно: ${correct}`;$('#quizProgress').style.width=(100*step/quizTotal)+'%';$('#quizProblem').textContent=`${a} + ${b} = ?`;
   $('#quizFeedback').textContent='';$('#quizNext').classList.remove('is-visible');const options=new Set([answer]);let loops=0;while(options.size<3&&loops<100){options.add(Math.max(0,Math.min(10,answer+randomInt(8)-4)));loops++;}for(let i=0;options.size<3&&i<=10;i++)options.add(i);
   const values=[...options].sort(()=>Math.random()-.5);const area=$('#quizAnswers');area.replaceChildren();for(const n of values){const btn=document.createElement('button');btn.type='button';btn.className='quiz-answer';btn.textContent=n;btn.addEventListener('click',()=>selectAnswer(n,btn));area.append(btn);}
 }
 function selectAnswer(value,button){if(answered)return;answered=true;const ok=value===answer;if(ok)correct++;
   $$('.quiz-answer').forEach(b=>{b.disabled=true;if(Number(b.textContent)===answer)b.classList.add('correct');else if(b===button)b.classList.add('incorrect');});
   $('#quizFeedback').textContent=ok?'Верно! Вы отлично справились ✦':`Почти! Правильный ответ — ${answer}.`;
   $('#quizScore').textContent=`Верно: ${correct}`;$('#quizNext').textContent=step===quizTotal-1?'Узнать результат →':'Следующая задача →';$('#quizNext').classList.add('is-visible');
 }
 function restart(){step=0;correct=0;$('#quizDone').hidden=true;$('#quizGame').hidden=false;newQuestion();}
 $('#quizNext').addEventListener('click',()=>{step++;if(step>=quizTotal){$('#quizProgress').style.width='100%';$('#quizGame').hidden=true;$('#quizDone').hidden=false;$('#quizSummary').textContent=`${correct} из ${quizTotal} правильных ответов`;try{const best=Number(localStorage.getItem('labix-addition-best')||0);if(correct>best)localStorage.setItem('labix-addition-best',String(correct));}catch(e){} }else newQuestion();});
 $('#quizRestart').addEventListener('click',restart);restart();
 const tabs=$$('.math-tab');
 function activateTab(tab,focus=false){tabs.forEach(b=>{const active=b===tab;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;$('#panel-'+b.dataset.panel).hidden=!active;});if(focus)tab.focus();}
 tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>activateTab(tab));tab.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(index+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;activateTab(tabs[n],true);});});
})();
