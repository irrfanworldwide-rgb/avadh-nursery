import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Check, ChevronRight, CircleHelp, CloudSun, Droplets, Flower2, GitCompareArrows, Grid2X2, Heart, House, Leaf, List, MapPin, Maximize2, MessageCircle, Search, ShoppingBag, SlidersHorizontal, Sprout, Sun, TreePine, X } from 'lucide-react';
import { climates, difficulties, img, inCollection, lights, spaces, states, types, type Plant } from './data';
import { rupees, useStore } from './state';
import { DemoNote, Empty, Heading, IconButton, Link, Modal, PageHead, Photo, Price, ProductGrid, Quantity } from './ui';

const clean=(s:string)=>s.toLocaleLowerCase().trim().replace(/[^\p{L}\p{M}\p{N} ]/gu,' ');
const aliases:Record<string,string>={'aam':'mango','amrud':'guava','amrood':'guava','nimbu':'lemon','mosambi':'sweet lime','santra':'orange','anar':'pomegranate','anjeer':'fig','gudhal':'hibiscus','sapota':'chikoo','कटहल':'jackfruit','आम':'mango','अमरूद':'guava','नींबू':'lemon','मौसंबी':'sweet lime','संतरा':'orange','अनार':'pomegranate','अंजीर':'fig','गुड़हल':'hibiscus'};
const queryTerms=(input:string)=>clean(input).split(/\s+/).filter(x=>x&&!['plant','plants','पौधे','पौधा','के','का'].includes(x));
export const plantMatch=(p:Plant,input:string)=>{
  const haystack=clean([p.name,p.hindi,p.botanical,p.variety,p.category,p.type,p.id].join(' '));
  return queryTerms(input).every(x=>haystack.includes(x)||Boolean(aliases[x]&&haystack.includes(aliases[x])));
};
type Filters={query:string;category:string;price:string;size:string;light:string;pot:string;climate:string;difficulty:string;stock:string;space:string};
const blank:Filters={query:'',category:'',price:'',size:'',light:'',pot:'',climate:'',difficulty:'',stock:'',space:''};
const selectOptions=(list:readonly string[])=>list.map(x=>[x,x] as [string,string]);
export function FilterSelect({label,options,value,onChange,placeholder='Any'}:{label:string;options:[string,string][];value:string;onChange:(s:string)=>void;placeholder?:string}) {
  const {t}=useStore();
  return <label className="field"><span>{t(label)}</span><select value={value} onChange={e=>onChange(e.target.value)}><option value="">{t(placeholder)}</option>{options.map(([key,name])=><option key={key} value={key}>{t(name)}</option>)}</select></label>;
}


export function Catalog({categoryId,search}:{categoryId?:string;search:string}) {
  const {categories,visible,t,lang,track}=useStore();
  const cat=categories.find(c=>c.id===categoryId);
  const params=new URLSearchParams(search);
  const [filters,setFilters]=useState<Filters>({...blank,query:params.get('q')||'',space:params.get('space')||''});
  const [sort,setSort]=useState('featured');
  const [list,setList]=useState(false);
  const [limit,setLimit]=useState(12);
  const [draft,setDraft]=useState<Filters|null>(null);
  useEffect(()=>{track('Catalogue visits');},[]);
  if(categoryId&&!cat) return <><PageHead title="Collection unavailable"/><div className="wrap section"><Empty title="Browse the current catalogue"><Link className="btn btn-dark" to="/shop">{t('Shop Plants')}</Link></Empty></div></>;
  const set=(k:keyof Filters,v:string)=>{setFilters(f=>({...f,[k]:v}));setLimit(12);};
  const find=(filters:Filters)=>visible.filter(p=>(!cat||inCollection(p,cat.id,cat.space))&&plantMatch(p,filters.query)
    &&(!filters.category||inCollection(p,filters.category,categories.find(c=>c.id===filters.category)?.space))
    &&(!filters.price||(filters.price==='quote'?p.price===null:p.price!==null&&(filters.price==='low'?p.price<350:filters.price==='mid'?p.price>=350&&p.price<=500:p.price>500)))
    &&(!filters.size||p.size===filters.size)&&(!filters.light||p.light===filters.light)&&(!filters.pot||p.pot===(filters.pot==='yes'))
    &&(!filters.climate||p.climate.some(x=>x===filters.climate))&&(!filters.difficulty||p.difficulty===filters.difficulty)
    &&(!filters.stock||(filters.stock==='in'?p.stock>0:p.stock===0))&&(!filters.space||p.spaces.some(x=>x===filters.space)));
  const results=find(filters);
  results.sort((a,b)=>sort==='az'?(lang==='hi'?a.hindi.localeCompare(b.hindi,'hi'):a.name.localeCompare(b.name)):sort==='asc'?(a.price??Infinity)-(b.price??Infinity)||a.name.localeCompare(b.name):sort==='desc'?(b.price??-1)-(a.price??-1):Number(b.featured)-Number(a.featured));
  const title=cat?(lang==='hi'?cat.hindi:cat.name):t('Shop Plants');
  const allFields: {key:Exclude<keyof Filters,'query'>;label:string;options:[string,string][]}[]=[
    {key:'category',label:'Category',options:categories.map(c=>[c.id,lang==='hi'?c.hindi:c.name])},
    {key:'price',label:'Price',options:[['low','Under ₹350'],['mid','₹350–₹500'],['high','Above ₹500'],['quote','Request price']]},
    {key:'size',label:'Plant size',options:selectOptions(['Small','Medium','Large'])},
    {key:'light',label:'Sunlight',options:selectOptions(lights)},
    {key:'pot',label:'Pot suitability',options:[['yes','Pot-friendly'],['no','Ground planting']]},
    {key:'climate',label:'Climate',options:selectOptions(climates)},
    {key:'difficulty',label:'Care difficulty',options:selectOptions(difficulties)},
    {key:'stock',label:'Availability',options:[['in','In demo stock'],['ask','Confirm availability']]},
    {key:'space',label:'Growing space',options:selectOptions(spaces)},
  ];
  const fields=cat?allFields.filter(field=>field.key!=='category'):allFields;
  const selects=(values:Filters,update:(k:keyof Filters,v:string)=>void)=><div className="filter-fields">
    {fields.map(({key,label,options})=><FilterSelect key={key} label={label} options={options} value={values[key]} onChange={value=>update(key,value)}/>)}
  </div>;
  const applied=fields.filter(({key})=>filters[key]);
  const count=applied.length;
  const shortcuts=[['pot','yes','Pot-friendly',Sprout],['light','Full sun','Full sun',Sun],['difficulty','Beginner','Beginner',Leaf]] as const;
  const clear=()=>{setFilters(blank);setLimit(12);};
  return <>
    <div className="catalogue-heading"><PageHead title={title} crumb={categoryId} eyebrow={t('Sample catalogue')} image={cat?.image??img('nursery')} summary={cat?.description??t('Browse fruit saplings, indoor plants and garden favourites.')}/></div>
    <div className="wrap catalogue section">
      <nav className="category-scroll" aria-label={t('Collections')}><Link aria-current={!cat?'page':undefined} to="/shop">{t('Shop all plants')}</Link>{categories.map(c=><Link key={c.id} aria-current={c.id===cat?.id?'page':undefined} to={'/collections/'+c.id}>{lang==='hi'?c.hindi:c.name}</Link>)}</nav>
      <div className="catalogue-layout"><aside className="filter-panel"><div className="filter-top"><h2>{t('Filters')}</h2><button type="button" className="text-link" onClick={clear}>{t('Clear all')}</button></div>{selects(filters,set)}</aside>
        <div className="catalogue-content">
          <div className="search-field"><Search size={19}/><input aria-label={t('Search plants or varieties')} placeholder={t('Search plants or varieties')} value={filters.query} onChange={e=>set('query',e.target.value)}/>{filters.query&&<IconButton label={t('Clear all')} onClick={()=>set('query','')}><X size={17}/></IconButton>}</div>
          <div className="catalogue-toolbar"><p aria-live="polite">{results.length} {lang==='hi'?'पौधे':'plants'}</p>
            <button type="button" className="btn btn-outline btn-sm filter-open" onClick={()=>setDraft({...filters})}><SlidersHorizontal size={15}/>{t('Filters')}{count>0&&' ('+count+')'}</button>
            <label className="catalogue-sort"><span>{t('Sort by')}</span><select aria-label={t('Sort by')} value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">{t('Featured')}</option><option value="asc">{t('Price low to high')}</option><option value="desc">{t('Price high to low')}</option><option value="az">{t('Name A–Z')}</option></select></label>
            <div className="view-switch"><IconButton label={t('Grid view')} aria-pressed={!list} onClick={()=>setList(false)}><Grid2X2 size={17}/></IconButton><IconButton label={t('List view')} aria-pressed={list} onClick={()=>setList(true)}><List size={19}/></IconButton></div>
          </div>
          <div className="filter-shortcuts" aria-label={t('Popular filters')}>{shortcuts.map(([key,value,label,Icon])=><button type="button" key={key} aria-pressed={filters[key]===value} onClick={()=>set(key,filters[key]===value?'':value)}><Icon size={15}/>{t(label)}</button>)}</div>
          {count>0&&<div className="applied-filters" aria-label={t('Applied filters')}>{applied.map(({key,options})=>{
            const label=t(options.find(([value])=>value===filters[key])?.[1]??filters[key]);
            return <button type="button" key={key} onClick={()=>set(key,'')} aria-label={t('Remove')+' '+label}>{label}<X size={14}/></button>;
          })}<button type="button" className="text-link" onClick={clear}>{t('Clear all')}</button></div>}
          {results.length?<><ProductGrid list={list} plants={results.slice(0,limit)}/>{limit<results.length&&<div className="centered"><button className="btn btn-outline" type="button" onClick={()=>setLimit(n=>n+12)}>{t('Load more')}</button></div>}</>:<Empty title={t('No plants found')}><p>Try another plant name or clear your filters.</p><button type="button" className="btn btn-outline" onClick={clear}>{t('Clear all')}</button></Empty>}
          <DemoNote/>
        </div>
      </div>
    </div>
    {draft&&<Modal title={t('Filters')} drawer onClose={()=>setDraft(null)}>
      {selects(draft,(key,value)=>setDraft(current=>current?{...current,[key]:value}:current))}
      <div className="filter-drawer-actions"><button type="button" className="btn btn-outline" onClick={()=>setDraft({...blank,query:draft.query})}>{t('Clear all')}</button><button type="button" className="btn btn-dark" onClick={()=>{setFilters(draft);setLimit(12);setDraft(null);}}>{t('Show results')} ({find(draft).length})</button></div>
    </Modal>}
  </>;
}
export function SearchOverlay() {
  const {t,lang,categories,visible,go}=useStore();
  const [q,setQ]=useState('');
  const matches=q.trim()?visible.filter(p=>plantMatch(p,q)).slice(0,6):visible.filter(p=>p.featured).slice(0,4);
  const cats=q.trim()?categories.filter(c=>clean(c.name+' '+c.hindi).includes(clean(q))||Boolean(aliases[clean(q)]&&clean(c.name).includes(aliases[clean(q)]))).slice(0,4):categories.slice(0,4);
  return <div className="search-overlay"><form className="search-field" onSubmit={e=>{e.preventDefault();go('/shop'+(q.trim()?'?q='+encodeURIComponent(q.trim()):''));}}><Search size={20}/><input autoFocus aria-label={t('Search plants or varieties')} placeholder={t('Search plants or varieties')} value={q} onChange={e=>setQ(e.target.value)}/><button type="submit" className="btn btn-dark btn-sm">{t('Search')}</button></form>
    {cats.length>0&&<div className="search-suggestions"><span className="eyebrow">{t('Collections')}</span><div>{cats.map(c=><Link key={c.id} to={'/collections/'+c.id}>{lang==='hi'?c.hindi:c.name}</Link>)}</div></div>}
    {matches.length?<ul className="search-results">{matches.map(p=><li key={p.id}><Link to={'/plants/'+p.slug}><Photo src={p.images[0]} alt=""/><span>{lang==='hi'?p.hindi:p.name}<small>{p.botanical}</small></span><Price plant={p}/></Link></li>)}</ul>:<p>{t('No plants found')}</p>}
  </div>;
}
export function DeliveryCheck({plant}:{plant?:Plant}) {
  const {t,whatsapp,settings,track}=useStore();
  const [data,setData]=useState<{pin:string;city:string;state:string}|null>(null);
  return <div className="delivery-check"><h3><MapPin size={19}/>{t('Check your delivery PIN')}</h3>
    <form className="form-grid" onChange={()=>setData(null)} onSubmit={(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();const f=new FormData(e.currentTarget);setData({pin:String(f.get('pin')),city:String(f.get('city')).trim(),state:String(f.get('state'))});}}>
      <label className="field"><span>{t('PIN code')}</span><input name="pin" required pattern="[1-9][0-9]{5}" inputMode="numeric" maxLength={6} placeholder="226102" autoComplete="postal-code" title="Enter a six-digit Indian PIN code"/></label>
      <label className="field"><span>{t('City')}</span><input name="city" required pattern=".*\S.*" maxLength={60} autoComplete="address-level2"/></label>
      <label className="field"><span>{t('State')}</span><select name="state" required defaultValue=""><option value="">{t('Choose a state')}</option>{states.map(s=><option key={s}>{s}</option>)}</select></label>
      <button type="submit" className="btn btn-outline">{t('Check delivery')}</button>
    </form>
    <p>{t(settings.delivery)}</p>
    {data&&<div className="delivery-result" aria-live="polite"><strong>{data.city}, {data.state} · {data.pin}</strong><p>Delivery confirmation pending.</p><a className="btn btn-dark btn-sm" href={whatsapp('Hello Avadh Nursery, please confirm delivery to '+data.city+', '+data.state+' '+data.pin+(plant?' for '+plant.name:'')+'.')} target="_blank" rel="noopener noreferrer" onClick={()=>track('WhatsApp delivery clicks')}><MessageCircle size={16}/>{t('Send PIN on WhatsApp')}</a><small>{t('This opens the actual Avadh Nursery WhatsApp number. You decide whether to send the message.')}</small></div>}
  </div>;
}
function Care({plant}:{plant:Plant}) {
  const {t}=useStore();
  const info=[[Sun,'Sunlight',plant.light],[Droplets,'Water',plant.water],[Sprout,'Pot suitability',plant.pot?'Pot-friendly':'Ground planting'],[Leaf,'Care difficulty',plant.difficulty]] as const;
  return <div className="care-grid">{info.map(([Icon,label,value])=><div key={label}><Icon size={19} strokeWidth={1.5}/><span>{t(label)}<strong>{t(value)}</strong></span></div>)}</div>;
}
export function PlantDetail({plant,quick=false}:{plant:Plant;quick?:boolean}) {
  const {t,lang,wish,compare,toggleWish,toggleCompare,add,visible,track,setPlantCartOpen,setQuick}=useStore();
  const [current,setCurrent]=useState(0);
  const [qty,setQty]=useState(1);
  const [zoom,setZoom]=useState(false);
  const [tab,setTab]=useState('Product details');
  const touch=useRef(0);
  useEffect(()=>{if(!quick){setPlantCartOpen(true);return ()=>setPlantCartOpen(false);}},[quick,setPlantCartOpen]);
  useEffect(()=>{if(!quick)track('Plant detail views');},[plant.id,quick]);
  const name=lang==='hi'?plant.hindi:plant.name;
  const related=visible.filter(p=>p.id!==plant.id&&p.category===plant.category).slice(0,4);
  const orderLink='/checkout?plant='+plant.slug+'&qty='+qty;
  const actions=<><button type="button" className="btn btn-dark" onClick={()=>{if(quick)setQuick(null);add(plant.id,qty,true);}}><ShoppingBag size={17}/>{t('Add to cart')}</button><Link to={orderLink} className="btn btn-outline"><MessageCircle size={17}/>{t('WhatsApp enquiry')}</Link></>;
  return <div className={quick?'quick-product':'section wrap detail-section'}>
    {!quick&&<div className="crumb"><Link to="/">{t('Home')}</Link><ChevronRight size={13}/><Link to="/shop">{t('Shop Plants')}</Link><ChevronRight size={13}/><span>{name}</span></div>}
    <div className="detail-layout">
      <div className="detail-photos"><div className="detail-image" onTouchStart={e=>touch.current=e.touches[0].clientX} onTouchEnd={e=>{const delta=touch.current-e.changedTouches[0].clientX;if(Math.abs(delta)>45)setCurrent(c=>(c+(delta>0?1:-1)+plant.images.length)%plant.images.length);}}>
        <Photo src={plant.images[current]??plant.images[0]} alt={'Illustrative '+plant.name+' view '+(current+1)} priority/>
        {!quick&&<IconButton label="Zoom image" onClick={()=>setZoom(true)}><Maximize2 size={20}/></IconButton>}
        <span className="photo-tag">{t('Illustrative image')}</span>{plant.images.length>1&&<span className="photo-count" aria-live="polite">{current+1} / {plant.images.length}</span>}
      </div>{plant.images.length>1&&<div className="thumbs">{plant.images.map((src,i)=><button type="button" key={src+i} aria-label={'Image '+(i+1)} aria-pressed={current===i} onClick={()=>setCurrent(i)}><Photo src={src} alt=""/></button>)}</div>}</div>
      <div className="detail-copy"><span className="eyebrow">{t('Sample catalogue')} · {plant.id}</span>{quick?<h2>{name}</h2>:<h1>{name}</h1>}<p className="botanical">{plant.botanical}</p><Price plant={plant}/><p>{plant.summary}</p>
        <Care plant={plant}/>
        <div className="detail-facts"><span>{t('Plant size')} <strong>{plant.height}</strong></span><span>{t('Propagation')} <strong>{plant.propagation}</strong></span><span>{t('Availability')} <strong>{plant.stock>0?t('In demo stock'):t('Confirm availability')}</strong></span></div>
        <div className="detail-quantity"><label>{t('Quantity')}</label><Quantity value={qty} onChange={setQty} label={t('Quantity')}/><IconButton label={t('Wishlist')} aria-pressed={wish.includes(plant.id)} onClick={()=>toggleWish(plant.id)}><Heart size={20} fill={wish.includes(plant.id)?'currentColor':'none'}/></IconButton><IconButton label={t('Compare')} aria-pressed={compare.includes(plant.id)} onClick={()=>toggleCompare(plant.id)}><GitCompareArrows size={20}/></IconButton></div>
        <div className={'button-row detail-actions '+(quick?'':'detail-actions-fixed')}>{actions}</div>
        {quick&&<Link to={'/plants/'+plant.slug} className="text-link">{t('Product details')}</Link>}
      </div>
    </div>
    {!quick&&<><div className="detail-lower">
      <div><div className="detail-tabs" aria-label="Plant information">{['Product details','Plant care','Delivery'].map(item=><button key={item} type="button" aria-pressed={tab===item} onClick={()=>setTab(item)}>{t(item)}</button>)}</div>
      {tab==='Product details'?<div className="detail-panel"><p>{plant.description}</p><dl className="fact-list"><dt>{t('Growing space')}</dt><dd>{plant.spaces.map(t).join(', ')}</dd><dt>{t('Climate')}</dt><dd>{plant.climate.map(t).join(', ')}</dd><dt>Fruiting</dt><dd>{plant.fruiting}</dd></dl></div>:tab==='Plant care'?<div className="detail-panel"><Care plant={plant}/><p>Use a growing medium that drains freely. Adjust watering with the weather and ask the nursery for care advice tailored to your site.</p><Link to="/guide" className="text-link">{t('Gardening Guide')}</Link></div>:<div className="detail-panel"><p>{t('Send your PIN code to our nursery team for delivery confirmation.')}</p><Link to="/shipping" className="text-link">{t('Shipping information')}</Link></div>}</div><DeliveryCheck plant={plant}/>
    </div><DemoNote/>{related.length>0&&<div className="section compact"><Heading title={t('Related plants')}/><ProductGrid plants={related}/></div>}
    {zoom&&<Modal title={name} onClose={()=>setZoom(false)}><Photo className="zoom-image" src={plant.images[current]} alt={'Illustrative '+plant.name}/></Modal>}</>}
  </div>;
}
type Answers={space:string;type:string;light:string;experience:string;budget:string;climate:string;state:string};
const initialAnswers:Answers={space:'',type:'',light:'',experience:'',budget:'',climate:'',state:''};
const steps=[['space','Where will you grow your plant?',spaces],['type','What type of plant would you like?',[...types,'Not sure']],['light','How much light does the space get?',lights],['experience','What is your gardening experience?',difficulties],['budget','What’s your budget per plant?',['₹300','₹450','₹600','No limit']],['climate','What is your local climate like?',[...climates,'Not sure']]] as const;
const lightMatch=(p:Plant,light:string)=>p.light===light||(p.light==='Low light'&&light==='Bright indirect')||(p.light==='Partial sun'&&light==='Full sun');
export function Finder() {
  const {t,visible,lang,track,whatsapp}=useStore();
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState(initialAnswers);
  const index=steps[Math.min(step,5)];
  const [key,title,options]=index;
  const done=step===steps.length;
  const level=difficulties.findIndex(s=>s===answers.experience);
  const cap=answers.budget==='No limit'?Infinity:Number(answers.budget.replace('₹',''));
  const matches=done?visible.filter(p=>p.spaces.some(s=>s===answers.space)&&lightMatch(p,answers.light)&&
    (answers.type==='Not sure'||answers.type===p.type||(answers.type==='Ornamental'&&['Indoor','Flowering'].includes(p.type)))&&
    (cap===Infinity||(p.price!==null&&p.price<=cap))&&
    (answers.climate==='Not sure'||p.climate.some(c=>c===answers.climate))&&
    difficulties.indexOf(p.difficulty)<=Math.min(level+1,2))
    .sort((a,b)=>Number(b.light===answers.light)-Number(a.light===answers.light)||difficulties.indexOf(a.difficulty)-difficulties.indexOf(b.difficulty)): [];
  const guidance='Hello Avadh Nursery, I would like help choosing plants.\n'+['Growing space: '+answers.space,'Plant type: '+answers.type,'Light: '+answers.light,'Experience: '+answers.experience,'Budget: '+answers.budget,'Climate: '+answers.climate,'State: '+(answers.state||'Not provided'),...(matches.length?['Shortlist: '+matches.slice(0,6).map(p=>p.name).join(', ')]:[])].join('\n');
  const optionIcons:Record<string,typeof Sprout>={Balcony:Flower2,Terrace:Sun,Garden:Sprout,'Indoor space':House,Farm:TreePine,Fruit:Sprout,Flowering:Flower2,Ornamental:Leaf,Indoor:House,'Not sure':CircleHelp,'Full sun':Sun,'Partial sun':CloudSun,'Bright indirect':House,'Low light':Leaf};
  const help:Record<string,string>={Balcony:'A few pots by a railing',Terrace:'An open rooftop or terrace',Garden:'Outdoor beds or large pots','Indoor space':'A room or windowsill',Farm:'An orchard or open plot','Full sun':'Direct sun for most of the day','Partial sun':'A mix of sun and shade','Bright indirect':'Bright light out of direct sun','Low light':'Limited natural light'};
  return <><div className="finder-page-top"><PageHead title={t('Plant Finder')} summary={t('Answer six questions to find plants for your space.')}/></div>
    <section className="wrap section finder-section">
      {!done?<div className="finder-layout"><div className="finder-visual"><Photo src={img('finder-terrace')} alt="Illustrative terrace garden in Lucknow"/><span>{t('Illustrative photography')}</span></div>
      <div className="finder-card">
        <div className="finder-step"><span>{t('Step')} {step+1} / {steps.length}</span><div className="finder-progress" role="progressbar" aria-label={t('Plant Finder progress')} aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={step+1}>{steps.map(([k],i)=><span key={k} className={i<=step?'complete':''}/>)}</div></div>
        <div className="finder-question" key={key}><h2>{t(title)}</h2>
        <div className="finder-options">{options.map(item=>{
          const Icon=optionIcons[item]??Leaf;
          return <button key={item} className="finder-option" type="button" aria-pressed={answers[key]===item} onClick={()=>setAnswers(a=>({...a,[key]:item}))}><Icon size={20} strokeWidth={1.65}/><span><strong>{t(item)}</strong>{help[item]&&<small>{t(help[item])}</small>}</span>{answers[key]===item&&<Check size={16}/>}</button>;
        })}</div>
        {key==='climate'&&<FilterSelect label="State" options={selectOptions(states)} value={answers.state} placeholder="Choose a state" onChange={value=>setAnswers(a=>({...a,state:value}))}/>}</div>
        <div className="finder-foot"><button type="button" className="btn btn-outline" disabled={step===0} onClick={()=>setStep(i=>i-1)}>{t('Back')}</button><button type="button" className="btn btn-dark" disabled={!answers[key]} onClick={()=>{if(step===5)track('Plant Finder completions');setStep(i=>i+1);}}>{t(step===5?'Show my plants':'Next')}<ChevronRight size={17}/></button></div>
      </div></div>:<div className="finder-results">
        <Heading title={t('Suggested plants for your space')} action={<button className="btn btn-outline" type="button" onClick={()=>{setAnswers(initialAnswers);setStep(0);}}>{t('Start again')}</button>}>{[answers.space,answers.light,answers.experience,answers.budget,answers.climate,answers.state].filter(Boolean).map(t).join(' · ')}</Heading>
        {matches.length?<><p>These suggestions fit the space, light and budget you provided. Check each plant’s care needs and discuss local conditions with the nursery.</p><ProductGrid plants={matches.slice(0,8)}/></>:<Empty title="No close matches in the sample catalogue"><p>Change one of your answers or ask the nursery for plants suited to your space.</p><button className="btn btn-outline" type="button" onClick={()=>setStep(5)}>{t('Back')}</button></Empty>}
        <div className="button-row"><a className="btn btn-dark" href={whatsapp(guidance)} target="_blank" rel="noopener noreferrer" onClick={()=>track('WhatsApp finder clicks')}><MessageCircle size={18}/>{t('Get plant guidance on WhatsApp')}</a></div><DemoNote/>
      </div>}
    </section></>;
}
export function Compare() {
  const {comparePlants,visible,t,lang,toggleCompare,add}=useStore();
  const differences:Record<string,(p:Plant)=>unknown>={'Sunlight':p=>p.light,'Pot suitability':p=>p.pot,'Growing space':p=>p.spaces.join(','),'Price':p=>p.price};
  const rows:[string,(p:Plant)=>ReactNode][]=[['Variety',p=>p.variety],['Price',p=><Price plant={p}/>],['Plant size',p=>p.height],['Pot suitability',p=>t(p.pot?'Pot-friendly':'Ground planting')],['Sunlight',p=>t(p.light)],['Growing space',p=>p.spaces.map(t).join(', ')],['Water',p=>p.water],['Care difficulty',p=>t(p.difficulty)],['Propagation',p=>p.propagation],['Climate',p=>p.climate.map(t).join(', ')]];
  return <><PageHead title={t('Compare Plants')} summary="Compare the light, space and care needs of up to three plants."/><section className="wrap section compare-page">
    {comparePlants.length<3&&<label className="field compare-select"><span>{t('Compare')} ({comparePlants.length}/3)</span><select value="" onChange={e=>{if(e.target.value)toggleCompare(e.target.value);}}><option value="">Choose a plant</option>{visible.filter(p=>!comparePlants.some(c=>c.id===p.id)).map(p=><option value={p.id} key={p.id}>{lang==='hi'?p.hindi:p.name}</option>)}</select></label>}
    {comparePlants.length?<div className="table-scroll" tabIndex={0} aria-label="Plant comparison table">
      <table className="comparison"><thead><tr><th scope="col">Plant attributes</th>{comparePlants.map(p=><th scope="col" key={p.id}><Link to={'/plants/'+p.slug}><Photo src={p.images[0]} alt=""/><span>{lang==='hi'?p.hindi:p.name}</span></Link><button type="button" className="text-link" onClick={()=>toggleCompare(p.id)}>{t('Remove')}</button></th>)}</tr></thead><tbody>
      {rows.map(([label,render])=><tr key={label} className={differences[label]&&new Set(comparePlants.map(differences[label])).size>1?'compare-highlight':''}><th scope="row">{t(label)}</th>{comparePlants.map(p=><td key={p.id}>{render(p)}</td>)}</tr>)}
      <tr><th scope="row">{t('Cart')}</th>{comparePlants.map(p=><td key={p.id}><button className="btn btn-dark btn-sm" type="button" onClick={()=>add(p.id)}>{t('Add to cart')}</button></td>)}</tr></tbody></table></div>:<Empty title="Select plants to compare"><p>Choose a plant above or add one while browsing the catalogue.</p><Link className="btn btn-dark" to="/shop">{t('Explore Plants')}</Link></Empty>}
    <DemoNote/>
  </section></>;
}
export function CompareTray() {
  const {comparePlants,t,toggleCompare}=useStore();
  if(!comparePlants.length)return null;
  return <div className="compare-tray"><GitCompareArrows size={19}/><span className="compare-selection">{comparePlants.length} {t('selected')}</span><div>{comparePlants.map(p=><button type="button" key={p.id} onClick={()=>toggleCompare(p.id)} aria-label={t('Remove')+' '+p.name}>{p.name}<X size={14}/></button>)}</div><Link to="/compare" className="btn btn-gold btn-sm">{t('Compare')} {comparePlants.length}/3</Link></div>;
}
export function Wishlist() {
  const {wishPlants,t}=useStore();
  return <><PageHead title={t('Wishlist')} summary="Keep the plants you’re considering in one place."/><section className="wrap section">{wishPlants.length?<ProductGrid plants={wishPlants}/>:<Empty title={t('Your wishlist is empty')}><Heart size={21}/><p>Tap the heart on any plant to save it here.</p><Link className="btn btn-dark" to="/shop">{t('Explore Plants')}</Link></Empty>}</section></>;
}
export function NotFound() {
  const {t}=useStore();
  return <div className="wrap section"><Empty title="This page could not be found"><CircleHelp size={25}/><Link to="/shop" className="btn btn-dark">{t('Browse the catalogue')}</Link></Empty></div>;
}
