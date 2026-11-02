(function(){
 'use strict';
 const lessons=window.LABIX_LESSONS||[], categories=window.LABIX_CATEGORIES||[];
 const $=sel=>document.querySelector(sel);
 const key='labix-favorites-v1';
 let favorites=new Set();
 try { const stored=JSON.parse(localStorage.getItem(key)||'[]'); if(Array.isArray(stored)) favorites=new Set(stored.filter(x=>typeof x==='string')); } catch(e) { favorites=new Set(); }
 const state={category:'all',query:'',onlyFavorites:false,sort:'featured'};
 const icons={heart:'♡',arrow:'↗'};
 function saveFavorites(){try{localStorage.setItem(key,JSON.stringify([...favorites]));}catch(e){ /* storage may be disabled */ }}
 function updateFavoriteCount(){ $('#headerFavoriteCount').textContent=favorites.size; }
 function filtered(){
   const q=state.query.trim().toLocaleLowerCase('ru').replace(/ё/g,'е');
   return lessons.filter(item=>(state.category==='all'||state.category===item.category)&&(!state.onlyFavorites||favorites.has(item.id))&&(!q||[item.title,item.description,item.tagline,item.detail,item.type,categories.find(c=>c.id===item.category)?.name||''].join(' ').toLocaleLowerCase('ru').replace(/ё/g,'е').includes(q))).sort((a,b)=>state.sort==='title'?a.title.localeCompare(b.title,'ru'):0);
 }
 function renderFilters(){
   const wrapper=$('#categoryFilters'); wrapper.replaceChildren();
   categories.forEach(cat=>{const n=cat.id==='all'?lessons.length:lessons.filter(x=>x.category===cat.id).length;
     const b=document.createElement('button');b.type='button';b.className='filter'+(state.category===cat.id?' is-active':''); b.textContent=`${cat.name}  ${n}`;b.dataset.category=cat.id;b.setAttribute('aria-pressed',String(state.category===cat.id));b.addEventListener('click',()=>{state.category=cat.id;render();});wrapper.append(b);
   });
   $('#favoriteFilter').classList.toggle('is-active',state.onlyFavorites);$('#favoriteFilter').setAttribute('aria-pressed',String(state.onlyFavorites));
 }
 function buildCard(item){
   const card=document.createElement('article');card.className='lesson-card';
   const top=document.createElement('div');top.className='card-art tone-'+item.tone;
   const cardTag=document.createElement('span');cardTag.className='card-type';cardTag.textContent=item.type;
   const heart=document.createElement('button');heart.type='button';heart.className='card-heart'+(favorites.has(item.id)?' is-saved':'');heart.textContent=favorites.has(item.id)?'♥':'♡';heart.setAttribute('aria-label',(favorites.has(item.id)?'Убрать из избранного: ':'В избранное: ')+item.title);heart.setAttribute('aria-pressed',String(favorites.has(item.id)));
   heart.addEventListener('click',()=>{if(favorites.has(item.id))favorites.delete(item.id);else favorites.add(item.id);saveFavorites();render();});
   const formula=document.createElement('span');formula.className='card-symbol';formula.textContent=item.symbol;
   const tagline=document.createElement('span');tagline.className='card-tagline';tagline.textContent=item.tagline;
   top.append(cardTag,heart,formula,tagline);
   const body=document.createElement('div');body.className='card-body';
   const cat=document.createElement('span');cat.className='card-category';cat.textContent=categories.find(c=>c.id===item.category)?.name||'';
   const title=document.createElement('h3');title.textContent=item.title;
   const desc=document.createElement('p');desc.textContent=item.description;
   const bottom=document.createElement('div');bottom.className='card-bottom';
   const detail=document.createElement('span');detail.className='card-detail';detail.textContent=item.detail;
   const link=document.createElement('a');link.className='card-link';link.href=item.url;link.textContent='Открыть ↗';link.setAttribute('aria-label','Открыть: '+item.title);
   if(/^https?:\/\//.test(item.url)){link.target='_blank';link.rel='noopener noreferrer';}
   bottom.append(detail,link);body.append(cat,title,desc,bottom);card.append(top,body);
   return card;
 }
 function render(){
   const items=filtered(),grid=$('#lessonGrid');grid.replaceChildren();const frag=document.createDocumentFragment();items.forEach(item=>frag.append(buildCard(item)));grid.append(frag);
   $('#emptyState').hidden=items.length!==0;$('#resultCount').textContent=`${items.length} ${plural(items.length,['материал','материала','материалов'])}`;
   renderFilters();updateFavoriteCount();
 }
 function plural(n,a){const t=n%10,u=n%100;return a[u>=11&&u<=14?2:t===1?0:t>=2&&t<=4?1:2];}
 $('#searchInput').addEventListener('input',e=>{state.query=e.target.value;render();});
 $('#sortSelect').addEventListener('change',e=>{state.sort=e.target.value;render();});
 $('#favoriteFilter').addEventListener('click',()=>{state.onlyFavorites=!state.onlyFavorites;render();});
 $('#headerFavoriteLink').addEventListener('click',()=>{state.onlyFavorites=true;state.category='all';state.query='';$('#searchInput').value='';render();});
 $('#resetFilters').addEventListener('click',()=>{state.category='all';state.query='';state.onlyFavorites=false;$('#searchInput').value='';render();});
 document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&& !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)){e.preventDefault();$('#searchInput').focus();}});
 $('#currentYear').textContent=new Date().getFullYear();
 render();
})();
