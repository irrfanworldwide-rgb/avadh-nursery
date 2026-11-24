import { useState, type FormEvent, type ReactNode } from 'react';
import { Boxes, ChevronDown, ClipboardList, ExternalLink, FileText, Gauge, ImagePlus, Leaf, Menu, Settings2, Sprout, TreePine, TriangleAlert } from 'lucide-react';
import { climates, difficulties, img, inCollection, lights, spaces, statuses, types, type Article, type Category, type Enquiry, type FAQ, type Plant, type Settings } from './data';
import { rupees, safeImage, safeURL, slugify, useStore } from './state';
import { Empty, Link, Modal, Photo } from './ui';
const menu=[['Overview','',Gauge],['Products','products',Sprout],['Categories','categories',TreePine],['Order enquiries','enquiries',ClipboardList],['Bulk enquiries','bulk',Boxes],['Content','content',FileText],['Settings','settings',Settings2]] as const;

const field=(label:string,name:string,value:string|number|null='',options:{required?:boolean;type?:string;wide?:boolean;max?:number;min?:number}={})=>
  <label className={'field '+(options.wide?'wide':'')} key={name}><span>{label}</span>{options.type==='textarea'?<textarea name={name} defaultValue={value??''} required={options.required} maxLength={options.max??4000} rows={4}/>:<input name={name} type={options.type??'text'} min={options.min??(options.type==='number'?0:undefined)} max={options.type==='number'?options.max:undefined} maxLength={options.type==='number'?undefined:options.max??180} defaultValue={value??''} required={options.required}/>}</label>;
const select=(label:string,name:string,value:string,options:readonly (readonly [string,string])[])=><label className="field" key={name}><span>{label}</span><select name={name} defaultValue={value} required>{options.map(([key,label])=><option key={key} value={key}>{label}</option>)}</select></label>;
const options=(items:readonly string[])=>items.map(i=>[i,i] as const);
const checked=(label:string,name:string,value:boolean)=><label className="consent" key={name}><input name={name} type="checkbox" defaultChecked={value}/><span>{label}</span></label>;
const get=(f:FormData,k:string)=>String(f.get(k)??'').trim();

function AdminForm({children,onSave,close}:{children:ReactNode;onSave:(f:FormData)=>string|void;close?:()=>void}) {
  const [error,setError]=useState('');
  function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const invalid=Array.from(e.currentTarget.elements).find(el=>(el instanceof HTMLInputElement||el instanceof HTMLTextAreaElement)&&el.required&&!el.value.trim());
    if(invalid){(invalid as HTMLInputElement).focus();setError('Complete every required field.');return;}
    setError(onSave(new FormData(e.currentTarget))??'');
  }
  return <form className="form-grid admin-form" onSubmit={submit}>{children}{error&&<p className="form-error wide" role="alert">{error}</p>}
    <div className="wide button-row">{close&&<button className="btn btn-outline" type="button" onClick={close}>Cancel</button>}<button className="btn btn-dark" type="submit">Save changes</button></div></form>;
}
function ImageEditor({initial,name='images',multiple=false}:{initial:string[];name?:string;multiple?:boolean}) {
  const [images,setImages]=useState(initial);
  const [warning,setWarning]=useState('');
  const upload=async(files:FileList|null)=>{
    if(!files?.length)return;
    const selected=Array.from(files);
    if(selected.some(file=>!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>6_000_000)){
      setWarning('Choose JPG, PNG or WebP images under 6 MB each.');return;
    }
    try {
      const next=await Promise.all(selected.slice(0,multiple?4:1).map(async file=>{
        const picture=await createImageBitmap(file);
        const factor=Math.min(1,600/Math.max(picture.width,picture.height));
        const canvas=document.createElement('canvas');
        canvas.width=Math.max(1,Math.round(picture.width*factor));canvas.height=Math.max(1,Math.round(picture.height*factor));
        const context=canvas.getContext('2d');
        if(!context){picture.close();throw new Error('Image preview unavailable');}
        context.drawImage(picture,0,0,canvas.width,canvas.height);picture.close();return canvas.toDataURL('image/webp',0.78);
      }));
      setImages(current=>multiple?[...current,...next].slice(0,5):next);setWarning('');
    }catch{setWarning('This image could not be opened. Choose a different image.');}
  };
  return <div className="wide image-editor"><label className="field"><span><ImagePlus size={17}/> {multiple?'Plant images':'Cover image'}</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple={multiple} onChange={e=>{void upload(e.target.files);e.target.value='';}}/></label>
    {warning&&<p className="form-error" role="alert">{warning}</p>}
    <input type="hidden" name={name} value={JSON.stringify(images)}/>
    <div className="image-previews">{images.map((src,i)=><div key={i}><Photo src={src} alt="Image preview"/><button type="button" className="text-link" onClick={()=>setImages(list=>list.filter((_,index)=>index!==i))}>Remove</button></div>)}</div>
  </div>;
}
function Overview() {
  const {plants,visible,categories,orders,bulks,activity}=useStore();
  const metrics=[
    ['Catalogue listings',plants.length,'/admin/products',Sprout],
    ['Sample order enquiries',orders.length,'/admin/enquiries',ClipboardList],
    ['Low demo stock',plants.filter(p=>p.stock>0&&p.stock<=3).length,'/admin/products?stock=low',TriangleAlert],
    ['Sample bulk enquiries',bulks.length,'/admin/bulk',Boxes],
  ] as const;
  const events=['Catalogue visits','Plant detail views','Plant Finder completions','Wishlist additions','Cart additions','WhatsApp checkout clicks','Wholesale enquiry clicks'];
  const chart=[['Mon',3],['Tue',5],['Wed',4],['Thu',6],['Fri',5],['Sat',8],['Sun',6]] as const;
  const recent=[...orders.map(order=>({order,to:'/admin/enquiries'})),...bulks.map(order=>({order,to:'/admin/bulk'}))].sort((a,b)=>b.order.date.localeCompare(a.order.date)).slice(0,5);
  return <><div className="admin-metrics">{metrics.map(([label,value,to,Icon])=><Link key={label} to={to}><Icon size={19} strokeWidth={1.7}/><strong>{value}</strong><small>{label}</small></Link>)}</div>
    <div className="admin-columns overview-activity"><section className="admin-card"><div className="admin-section-title"><h2>Enquiry activity</h2><span>Sample week</span></div><div className="chart" aria-label="Sample enquiries from Monday to Sunday" role="img">{chart.map(([day,num])=><div key={day}><span>{num}</span><i style={{height:num*13}}/><small>{day}</small></div>)}</div></section>
    <section className="admin-card"><div className="admin-section-title"><h2>Storefront activity</h2><span>This browser</span></div><dl className="fact-list">{events.map(e=><div key={e}><dt>{e}</dt><dd>{activity[e]||0}</dd></div>)}</dl></section></div>
    <div className="admin-columns"><section className="admin-card"><div className="admin-section-title"><h2>Catalogue collections</h2><span>Published</span></div><dl className="fact-list">{categories.map(c=><div key={c.id}><dt><Link to={'/collections/'+c.id}>{c.name}</Link></dt><dd>{visible.filter(p=>inCollection(p,c.id,c.space)).length}</dd></div>)}</dl></section>
    <section className="admin-card"><div className="admin-section-title"><h2>Recent enquiries</h2><span>Sample records</span></div>{recent.map(({order:o,to})=><Link className="admin-recent" key={o.id} to={to}><span><strong>{o.name}</strong><small>{o.id}</small></span><span>{o.status}</span></Link>)}</section></div></>;
}
function PlantForm({plant,close}:{plant?:Plant;close:()=>void}) {
  const {plants,categories,setPlants,setNotice}=useStore();
  const save=(f:FormData)=>{
    const name=get(f,'name');
    const slug=plant?.slug??slugify(name);
    if(!slug)return 'Use an English plant name to create its URL.';
    if(plants.some(p=>p.slug===slug&&p.id!==plant?.id))return 'A plant with that name already exists.';
    const images=(JSON.parse(get(f,'images')) as string[]).map(safeImage);
    const location=f.getAll('spaces').map(String) as Plant['spaces'];
    const climate=f.getAll('climate').map(String) as Plant['climate'];
    if(!location.length||!climate.length)return 'Choose at least one growing space and climate.';
    const product:Plant={
      id:plant?.id??'AV-'+crypto.randomUUID().slice(0,8).toUpperCase(),slug,name,hindi:get(f,'hindi')||name,category:get(f,'category'),variety:get(f,'variety'),
      botanical:get(f,'botanical'),price:get(f,'price')?Number(get(f,'price')):null,stock:Number(get(f,'stock')),height:get(f,'height'),
      size:get(f,'size') as Plant['size'],type:get(f,'type') as Plant['type'],light:get(f,'light') as Plant['light'],
      difficulty:get(f,'difficulty') as Plant['difficulty'],pot:f.has('pot'),featured:f.has('featured'),published:f.has('published'),
      propagation:get(f,'propagation'),water:get(f,'water'),fruiting:get(f,'fruiting'),spaces:location,climate,images:images.length?images:[categories.find(c=>c.id===get(f,'category'))?.image??img('nursery')],
      summary:get(f,'summary'),description:get(f,'description'),
    };
    setPlants(items=>plant?items.map(p=>p.id===plant.id?product:p):[...items,product]);
    setNotice('Plant saved to the demo storefront.');close();
  };
  return <AdminForm close={close} onSave={save}>
    {field('Plant name','name',plant?.name,{required:true})}{field('Hindi display name','hindi',plant?.hindi)}
    {select('Category','category',plant?.category??categories[0].id,categories.map(c=>[c.id,c.name]))}{field('Variety or cultivar','variety',plant?.variety,{required:true})}
    {field('Botanical name','botanical',plant?.botanical)}{field('Sample price in INR (blank for quote)','price',plant?.price,{type:'number',max:1000000})}
    {field('Sample stock','stock',plant?.stock??0,{type:'number',required:true,max:1000000})}{field('Sample height range','height',plant?.height,{required:true})}
    {select('Plant size','size',plant?.size??'Medium',options(['Small','Medium','Large']))}{select('Plant type','type',plant?.type??'Fruit',options(types))}
    {select('Sunlight','light',plant?.light??'Full sun',options(lights))}{select('Care difficulty','difficulty',plant?.difficulty??'Beginner',options(difficulties))}
    {field('Propagation','propagation',plant?.propagation,{required:true})}{field('Watering','water',plant?.water,{required:true})}
    {field('Fruiting notes','fruiting',plant?.fruiting,{wide:true})}
    <fieldset className="wide admin-checks"><legend>Growing spaces</legend>{spaces.map(s=><label className="consent" key={s}><input type="checkbox" name="spaces" value={s} defaultChecked={plant?.spaces.includes(s)??s==='Garden'}/>{s}</label>)}</fieldset>
    <fieldset className="wide admin-checks"><legend>Climate</legend>{climates.map(c=><label className="consent" key={c}><input type="checkbox" name="climate" value={c} defaultChecked={plant?.climate.includes(c)??c==='Warm subtropical'}/>{c}</label>)}</fieldset>
    {field('Short description','summary',plant?.summary,{required:true,wide:true,max:300})}{field('Detailed description','description',plant?.description,{required:true,wide:true,type:'textarea'})}
    <ImageEditor initial={plant?.images??[]} multiple/>
    <div className="wide admin-checks">{checked('Pot-friendly','pot',plant?.pot??false)}{checked('Featured on homepage','featured',plant?.featured??false)}{checked('Published in demo','published',plant?.published??true)}</div>
  </AdminForm>;
}
function Products() {
  const {plants,setPlants,categories,path}=useStore();
  const [search,setSearch]=useState('');
  const [category,setCategory]=useState('');
  const [lowStock,setLowStock]=useState(new URLSearchParams(path.split('?')[1]).get('stock')==='low');
  const [editing,setEditing]=useState<Plant|'new'|null>(null);
  const [deleting,setDeleting]=useState<Plant|null>(null);
  const show=plants.filter(p=>(!lowStock||(p.stock>0&&p.stock<=3))&&(!category||p.category===category)&&(p.name+' '+p.id+' '+p.variety).toLowerCase().includes(search.trim().toLowerCase()));
  return <section className="admin-card"><div className="admin-toolbar"><input aria-label="Search products" placeholder="Search name, variety or ID" value={search} onChange={e=>setSearch(e.target.value)}/><select aria-label="Filter by category" value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select><button className="btn btn-dark btn-sm" type="button" onClick={()=>setEditing('new')}>Add product</button><button type="button" className="btn btn-outline btn-sm stock-filter" aria-pressed={lowStock} onClick={()=>setLowStock(v=>!v)}>Low demo stock</button></div>
    <div className="table-scroll"><table className="admin-table admin-product-table"><thead><tr><th>Product</th><th>Sample price</th><th>Demo stock</th><th>Visibility</th><th>Actions</th></tr></thead><tbody>{show.map(p=><tr key={p.id}><th scope="row"><div className="admin-plant"><Photo src={p.images[0]} alt=""/><span>{p.name}<small>{p.variety} · {p.id}</small></span></div></th><td data-label="Sample price">{p.price===null?'Quote':rupees(p.price)}</td><td data-label="Demo stock">{p.stock}</td><td><button type="button" className="status-toggle" aria-label={(p.published?'Unpublish ':'Publish ')+p.name} onClick={()=>setPlants(items=>items.map(x=>x.id===p.id?{...x,published:!x.published}:x))}>{p.published?'Published':'Unpublished'}</button></td><td><div className="admin-actions"><button className="text-link" type="button" onClick={()=>setEditing(p)}>Edit</button><button className="text-link danger" type="button" onClick={()=>setDeleting(p)}>Delete</button></div></td></tr>)}</tbody></table></div>
    {!show.length&&<Empty title="No products found"/>}
    {editing&&<Modal title={editing==='new'?'Add product':'Edit '+editing.name} onClose={()=>setEditing(null)}><PlantForm plant={editing==='new'?undefined:editing} close={()=>setEditing(null)}/></Modal>}
    {deleting&&<Modal title="Delete product?" onClose={()=>setDeleting(null)}><p>{deleting.name} will be removed from this browser’s catalogue.</p><div className="button-row"><button type="button" className="btn btn-outline" onClick={()=>setDeleting(null)}>Cancel</button><button type="button" className="btn btn-danger" onClick={()=>{setPlants(items=>items.filter(p=>p.id!==deleting.id));setDeleting(null);}}>Delete product</button></div></Modal>}
  </section>;
}
function Categories() {
  const {categories,setCategories,plants}=useStore();
  const [editing,setEditing]=useState<Category|'new'|null>(null);
  const current=editing==='new'?undefined:editing??undefined;
  const move=(i:number,delta:number)=>setCategories(items=>{const copy=[...items];[copy[i],copy[i+delta]]=[copy[i+delta],copy[i]];return copy;});
  const save=(f:FormData)=>{
    const id=current?.id??slugify(get(f,'name'));
    if(!id||categories.some(c=>c.id===id&&c.id!==current?.id))return 'Use a unique category name in English.';
    const space=get(f,'space') as Category['space'];
    const source=(JSON.parse(get(f,'image')) as string[])[0];
    const item={id,name:get(f,'name'),hindi:get(f,'hindi'),description:get(f,'description'),image:source?safeImage(source):img('nursery'),space:space||undefined};
    setCategories(items=>current?items.map(c=>c.id===current.id?item:c):[...items,item]);setEditing(null);
  };
  return <section className="admin-card"><div className="admin-toolbar"><button className="btn btn-dark btn-sm" type="button" onClick={()=>setEditing('new')}>Add category</button></div>
    <div className="table-scroll"><table className="admin-table"><thead><tr><th>Category</th><th>Assigned products</th><th>Actions</th></tr></thead><tbody>{categories.map((c,i)=><tr key={c.id}><th scope="row">{c.name}</th><td>{plants.filter(p=>p.category===c.id).length}</td><td className="admin-actions"><button className="text-link" type="button" onClick={()=>setEditing(c)}>Edit</button><button className="text-link" type="button" disabled={i===0} onClick={()=>move(i,-1)}>Move up</button><button className="text-link" type="button" disabled={i===categories.length-1} onClick={()=>move(i,1)}>Move down</button></td></tr>)}</tbody></table></div>
    <p className="caption">Assign a product to a category in the product editor.</p>
    {editing&&<Modal title={current?'Edit category':'Add category'} onClose={()=>setEditing(null)}><AdminForm onSave={save} close={()=>setEditing(null)}>
      {field('Category name','name',current?.name,{required:true})}{field('Hindi name','hindi',current?.hindi,{required:true})}
      {field('Description','description',current?.description,{wide:true,type:'textarea',required:true})}
      <label className="field wide"><span>Automatic growing-space collection (optional)</span><select name="space" defaultValue={current?.space??''}><option value="">Use assigned products</option>{spaces.map(s=><option key={s}>{s}</option>)}</select></label>
      <ImageEditor initial={current?[current.image]:[]} name="image"/>
    </AdminForm></Modal>}
  </section>;
}
function csv(items:Enquiry[],file:string) {
  const cell=(value:string)=>{
    const safe=/^[=+@\-\t\r]/.test(value)?"'"+value:value;
    return '"'+safe.replace(/"/g,'""')+'"';
  };
  const text=[['Reference','Sample buyer','Requested items','Region','Status','Date'],...items.map(o=>[o.id,o.name,o.items,o.region,o.status,o.date])].map(row=>row.map(cell).join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob(['\ufeff'+text],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download=file;a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function Enquiries({bulk=false}:{bulk?:boolean}) {
  const {orders,setOrders,bulks,setBulks}=useStore();
  const items=bulk?bulks:orders;
  const set=bulk?setBulks:setOrders;
  const [search,setSearch]=useState('');
  const [status,setStatus]=useState('');
  const [editing,setEditing]=useState<Enquiry|null>(null);
  const found=items.filter(i=>(!status||i.status===status)&&[i.id,i.name,i.items,i.region].join(' ').toLowerCase().includes(search.trim().toLowerCase()));
  return <section className="admin-card"><div className="admin-toolbar"><input aria-label="Search enquiries" placeholder="Search sample enquiries" value={search} onChange={e=>setSearch(e.target.value)}/><select aria-label="Filter by status" value={status} onChange={e=>setStatus(e.target.value)}><option value="">All statuses</option>{statuses.map(s=><option key={s}>{s}</option>)}</select>
    <button className="btn btn-outline btn-sm" type="button" onClick={()=>csv(found,bulk?'avadh-bulk-sample.csv':'avadh-enquiries-sample.csv')}>Export sample CSV</button></div>
    <div className="table-scroll"><table className="admin-table"><thead><tr><th>Reference</th><th>Requested plants</th><th>Region</th><th>Status</th><th>Actions</th></tr></thead><tbody>{found.map(o=><tr key={o.id}><th scope="row">{o.id}<small>{o.name} · {o.date}</small></th><td>{o.items}</td><td>{o.region}</td><td>{o.status}</td><td><button type="button" className="text-link" onClick={()=>setEditing(o)}>Review</button></td></tr>)}</tbody></table></div>
    {!found.length&&<Empty title="No sample records match"/>}
    {editing&&<Modal title={editing.id} onClose={()=>setEditing(null)}><AdminForm close={()=>setEditing(null)} onSave={f=>{set(items=>items.map(o=>o.id===editing.id?{...o,status:get(f,'status'),items:get(f,'items'),region:get(f,'region')}:o));setEditing(null);}}>
      <p className="wide">Sample enquiry · {editing.name}</p>{field('Requested items','items',editing.items,{required:true,wide:true,type:'textarea'})}{field('Delivery region','region',editing.region,{required:true})}{select('Internal status','status',editing.status,options(statuses))}
    </AdminForm></Modal>}
  </section>;
}
function Content() {
  const {settings,setSettings,articles,setArticles,faq,setFaq,plants,setPlants,categories,setNotice}=useStore();
  const [tab,setTab]=useState('Homepage');
  const [article,setArticle]=useState<Article|'new'|null>(null);
  const [question,setQuestion]=useState<FAQ|'new'|null>(null);
  const [remove,setRemove]=useState<{id:string;label:string;kind:'article'|'faq'}|null>(null);
  const a=article==='new'?undefined:article??undefined;
  const q=question==='new'?undefined:question??undefined;
  return <section className="admin-card"><div className="detail-tabs">{['Homepage','Articles','FAQ'].map(k=><button type="button" key={k} aria-pressed={k===tab} onClick={()=>setTab(k)}>{k}</button>)}</div>
    {tab==='Homepage'&&<AdminForm onSave={f=>{
      const heroImage=(JSON.parse(get(f,'heroImage')) as string[])[0];
      setSettings(s=>({...s,announcement:get(f,'announcement'),hero:get(f,'hero'),heroSubtitle:get(f,'heroSubtitle'),heroImage:heroImage?safeImage(heroImage):undefined}));
      const set=new Set(f.getAll('feature').map(String));
      setPlants(items=>items.map(p=>({...p,featured:set.has(p.id)})));setNotice('Homepage saved.');
    }}>{field('Announcement','announcement',settings.announcement,{required:true,wide:true})}{field('Hero headline','hero',settings.hero,{required:true,wide:true})}{field('Hero supporting text','heroSubtitle',settings.heroSubtitle,{required:true,wide:true})}<ImageEditor name="heroImage" initial={settings.heroImage?[settings.heroImage]:[]}/><fieldset className="wide admin-checks"><legend>Featured products</legend>{plants.filter(p=>p.published).map(p=><label key={p.id} className="consent"><input name="feature" type="checkbox" value={p.id} defaultChecked={p.featured}/>{p.name}</label>)}</fieldset></AdminForm>}
    {tab==='Articles'&&<><div className="admin-toolbar"><button className="btn btn-dark btn-sm" type="button" onClick={()=>setArticle('new')}>Add article</button></div>
      {articles.map(a=><div className="admin-content-row" key={a.id}><Link to={'/guide/'+a.id}>{a.title}</Link><button className="text-link" type="button" onClick={()=>setArticle(a)}>Edit</button><button type="button" className="text-link danger" onClick={()=>setRemove({id:a.id,label:a.title,kind:'article'})}>Delete</button></div>)}</>}
    {tab==='FAQ'&&<><div className="admin-toolbar"><button className="btn btn-dark btn-sm" type="button" onClick={()=>setQuestion('new')}>Add question</button></div>
      {faq.map(q=><div className="admin-content-row" key={q.id}><span>{q.question}</span><button className="text-link" type="button" onClick={()=>setQuestion(q)}>Edit</button><button type="button" className="text-link danger" onClick={()=>setRemove({id:q.id,label:q.question,kind:'faq'})}>Delete</button></div>)}</>}
    {article&&<Modal title={a?'Edit article':'Add article'} onClose={()=>setArticle(null)}><AdminForm close={()=>setArticle(null)} onSave={f=>{
      const id=a?.id??slugify(get(f,'title'));
      if(!id||articles.some(row=>row.id===id&&row.id!==a?.id))return 'Choose a unique English article title.';
      const source=get(f,'source');if(source&&!safeURL(source))return 'Use an HTTPS reference URL.';
      const next:Article={id,title:get(f,'title'),category:get(f,'category'),summary:get(f,'summary'),image:safeImage((JSON.parse(get(f,'image')) as string[])[0]??img('terrace')),body:get(f,'body').split(/\n\s*\n/).filter(Boolean),collection:get(f,'collection'),source};
      setArticles(items=>a?items.map(row=>row.id===id?next:row):[...items,next]);setArticle(null);
    }}>
      {field('Title','title',a?.title,{required:true,wide:true})}{field('Article category','category',a?.category,{required:true})}{select('Related collection','collection',a?.collection??'fruit',categories.map(c=>[c.id,c.name]))}{field('Short summary','summary',a?.summary,{required:true,wide:true})}{field('Article text (blank line between paragraphs)','body',a?.body.join('\n\n'),{required:true,wide:true,type:'textarea',max:10000})}{field('Reference URL','source',a?.source,{type:'url',wide:true,max:500})}<ImageEditor name="image" initial={a?[a.image]:[]}/>
    </AdminForm></Modal>}
    {question&&<Modal title={q?'Edit question':'Add question'} onClose={()=>setQuestion(null)}><AdminForm close={()=>setQuestion(null)} onSave={f=>{
      const next={id:q?.id??crypto.randomUUID(),question:get(f,'question'),answer:get(f,'answer')};
      setFaq(items=>q?items.map(row=>row.id===q.id?next:row):[...items,next]);setQuestion(null);
    }}>{field('Question','question',q?.question,{required:true,wide:true})}{field('Answer','answer',q?.answer,{required:true,wide:true,type:'textarea'})}</AdminForm></Modal>}
    {remove&&<Modal title="Delete content?" onClose={()=>setRemove(null)}><p>{remove.label}</p><div className="button-row"><button type="button" className="btn btn-outline" onClick={()=>setRemove(null)}>Cancel</button><button type="button" className="btn btn-danger" onClick={()=>{if(remove.kind==='article')setArticles(items=>items.filter(row=>row.id!==remove.id));else setFaq(items=>items.filter(row=>row.id!==remove.id));setRemove(null);}}>Delete</button></div></Modal>}
  </section>;
}
function SiteSettings() {
  const {settings,setSettings,setNotice}=useStore();
  const fields:[keyof Settings,string,string,boolean?][]=[['brand','Business name','text',true],['mark','Proposed wordmark title','text',true],['phone','WhatsApp number with country code','tel',true],['address','Nursery address','text',true],['instagram','Instagram URL','url'],['facebook','Facebook URL','url'],['youtube','YouTube URL','url'],['delivery','Delivery confirmation guidance','text',true],['payments','Future payment integration notes','text']];
  return <section className="admin-card"><p>Changes affect this browser. Payment settings are planning notes for a future integration.</p><AdminForm onSave={f=>{
    const next={...settings};
    for(const [k,,kind] of fields){const v=get(f,k);if(kind==='url'&&v&&!safeURL(v))return 'Social links must use HTTPS.';next[k]=v;}
    if(!/^91[6-9][0-9]{9}$/.test(next.phone.replace(/\D/g,'')))return 'Enter an Indian WhatsApp mobile number with country code 91.';
    next.phone=next.phone.replace(/\D/g,'');setSettings(next);setNotice('Business settings saved.');
  }}>{fields.map(([name,label,type,required])=>field(label,name,settings[name],{type,required,wide:['address','delivery','payments'].includes(name),max:type==='url'?400:240}))}</AdminForm></section>;
}
export default function Admin({section}:{section:string}) {
  const [open,setOpen]=useState(false);
  const {settings}=useStore();
  const active=menu.find(([,id])=>id===section)??menu[0];
  const views:Record<string,ReactNode>={'':<Overview/>,products:<Products/>,categories:<Categories/>,enquiries:<Enquiries key="orders"/>,bulk:<Enquiries bulk key="bulk"/>,content:<Content/>,settings:<SiteSettings/>};
  const nav=<nav className="admin-menu" aria-label="Demo administration">{menu.map(([name,id,Icon])=><Link aria-current={active[1]===id?'page':undefined} key={id} to={'/admin'+(id?'/'+id:'')} onClick={()=>setOpen(false)}><Icon size={18}/>{name}</Link>)}</nav>;
  return <div className="admin-shell">
    <aside className="admin-nav"><Link to="/admin" className="admin-brand"><Sprout size={24}/><span>{settings.mark}<small>Nursery management</small></span></Link>{nav}<Link className="admin-storefront" to="/"><ExternalLink size={16}/>View storefront</Link></aside>
    <div className="admin-main"><header className="admin-top"><div className="admin-top-tools"><button type="button" className="admin-mobile-menu btn btn-outline btn-sm" aria-haspopup="dialog" aria-expanded={open} onClick={()=>setOpen(true)}><Menu size={17}/>Admin menu<ChevronDown size={13}/></button><span className="admin-mode"><Leaf size={14}/> Demo mode</span></div><Link to="/"><ExternalLink size={15}/>Storefront</Link></header>
    <div className="admin-content"><div className="admin-title"><div><h1>{active[0]==='Overview'?'Nursery overview':active[0]}</h1><p>{active[0]==='Overview'?'Manage your catalogue and review sample enquiries.':'Changes are saved in this browser.'}</p></div>{active[0]==='Overview'&&<Link className="btn btn-dark btn-sm" to="/admin/products"><Sprout size={17}/>Manage products</Link>}</div>{views[active[1]]}</div></div>
    {open&&<Modal title="Nursery administration" drawer onClose={()=>setOpen(false)}>{nav}</Modal>}
  </div>;
}
