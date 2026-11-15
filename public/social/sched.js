window.tk={
 sleep:ms=>new Promise(r=>setTimeout(r,ms)),
 async waitFor(fn,t=15000){const s=Date.now();while(Date.now()-s<t){let v;try{v=fn()}catch(e){} if(v)return v;await tk.sleep(300);}return null;},
 btn(t){return [...document.querySelectorAll('[role=button],button')].find(x=>x.offsetParent&&x.innerText.trim()===t);},
 cap(x,net){const pts=x.p.map(q=>'✅ '+q).join('\n');const disc='We may earn a commission from links on our site, at no extra cost to you.';if(net==='fb')return `${x.h}\n\n${x.b}\n\n${pts}\n\n👉 Full review: https://toolkenzon.com${x.u}?utm_source=facebook&utm_medium=social&utm_campaign=nov26\n\n${disc}\n${x.t}`;const tags=[...new Set((x.t+' #AItools #SaaS #ProductivityTools #TechTools #ToolKenzon').split(' '))].join(' ');return `${x.h}\n\n${x.b}\n\n${pts}\n\n🔗 Full review: link in bio (toolkenzon.com/links)\n\n${disc}\n\n${tags}`;},
 async getImg(slug){__bridge.contentWindow.postMessage({slug},'https://toolkenzon.com');return await tk.waitFor(()=>__imgs[slug],15000);},
 async paste(ed,text){ed.focus();await tk.sleep(200);const dt=new DataTransfer();dt.setData('text/plain',text);ed.dispatchEvent(new ClipboardEvent('paste',{clipboardData:dt,bubbles:true,cancelable:true}));await tk.sleep(600);return ed.innerText.length;},
 visEd(){return [...document.querySelectorAll('[contenteditable=true]')].find(e=>e.offsetParent);},
 tab(name){const t=[...document.querySelectorAll('div')].find(x=>x.innerText&&x.innerText.trim()===name&&x.children.length<4&&x.offsetParent);t&&t.click();return !!t;},
 key(el,k){for(const ty of ['keydown','keyup'])el.dispatchEvent(new KeyboardEvent(ty,{key:k,code:k,bubbles:true,cancelable:true}));},
 async spinTo(el,target){el.focus();for(let n=0;n<70;n++){const v=+el.getAttribute('aria-valuenow');if(v===target)return true;tk.key(el,v<target?'ArrowUp':'ArrowDown');await tk.sleep(60);}return false;},
 async setDate(inp,str){inp.focus();inp.select&&inp.select();const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;set.call(inp,str);inp.dispatchEvent(new Event('input',{bubbles:true}));await tk.sleep(200);tk.key(inp,'Enter');await tk.sleep(400);return inp.value;},
 async run(i,go){const P=window.tkP[i];const r={i,slug:P.s};
  const add=await tk.waitFor(()=>document.body.innerText.includes('toolkenzon_ai')&&tk.btn('Thêm ảnh/video'),25000);if(!add)return {...r,err:'composer not ready'};
  const blob=await tk.getImg(P.s);if(!blob)return {...r,err:'no image'};
  if(!window.__oc){window.__oc=HTMLInputElement.prototype.click;HTMLInputElement.prototype.click=function(){if(this.type==='file'&&window.__pend){const dt=new DataTransfer();dt.items.add(window.__pend);this.files=dt.files;window.__pend=null;setTimeout(()=>{this.dispatchEvent(new Event('input',{bubbles:true}));this.dispatchEvent(new Event('change',{bubbles:true}));},50);return;}return window.__oc.call(this);};}
  window.__pend=new File([blob],P.s+'.png',{type:'image/png',lastModified:Date.now()});add.click();
  r.img=!!await tk.waitFor(()=>document.body.innerText.includes('1080 x 1350'),20000);
  const cu=document.querySelector('input[aria-label="Tùy chỉnh bài viết cho Facebook và Instagram"]');if(cu&&!cu.checked){cu.click();await tk.sleep(1200);}
  tk.tab('Facebook');await tk.sleep(800);let ed=tk.visEd();if(ed.innerText.trim()==='')r.fb=await tk.paste(ed,tk.cap(P,'fb'));else r.fb='prefilled';
  tk.tab('Instagram');await tk.sleep(800);ed=tk.visEd();if(ed.innerText.trim()==='')r.ig=await tk.paste(ed,tk.cap(P,'ig'));else r.ig='prefilled';
  const sw=document.querySelector('input[aria-label="Đặt ngày và giờ"]');if(sw&&!sw.checked){sw.click();await tk.sleep(1200);}
  const ds=`${P.d}/11/2026`;r.dates=[];for(const inp of document.querySelectorAll('input[placeholder="dd/mm/yyyy"]'))r.dates.push(await tk.setDate(inp,ds));
  const sp=[...document.querySelectorAll('[role=spinbutton]')];for(let k=0;k<sp.length;k++)await tk.spinTo(sp[k],k%2===0?23:0);
  r.times=sp.map(x=>x.getAttribute('aria-valuenow')).join(',');
  const okDate=r.dates.length===2&&r.dates.every(v=>v.startsWith(P.d+' Tháng 11, 2026'));const okTime=r.times==='23,0,23,0';
  r.ok=r.img&&okDate&&okTime&&typeof r.fb==='number'&&r.fb>300&&typeof r.ig==='number'&&r.ig>300;
  if(go&&r.ok){tk.btn('Lên lịch').click();const later=await tk.waitFor(()=>tk.btn('Để sau'),25000);r.scheduled=!!later;if(later){later.click();await tk.sleep(1500);}}
  return r;}
};
