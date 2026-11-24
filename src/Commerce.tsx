import { useState, type FormEvent, type ReactNode } from 'react';
import { Leaf, MapPin, MessageCircle, PackageOpen, Phone, ShoppingBag } from 'lucide-react';
import { img, states, type Plant } from './data';
import { rupees, useStore } from './state';
import { DemoNote, Empty, Heading, Link, PageHead, Photo, Price, ProductGrid, Quantity, SocialLinks, mapLink } from './ui';

type CartLine={plant:Plant; id:string; quantity:number};
export function CartLines({lines,drawer=false}:{lines:CartLine[];drawer?:boolean}) {
  const {t,lang,quantity,setSaved}=useStore();
  return <ul className="cart-lines">{lines.map(l=><li key={l.id}><Link to={'/plants/'+l.plant.slug}><Photo src={l.plant.images[0]} alt=""/></Link>
    <div className="cart-line-info"><Link to={'/plants/'+l.plant.slug}><strong>{lang==='hi'?l.plant.hindi:l.plant.name}</strong></Link><Price plant={l.plant}/>
      <div className="cart-line-tools"><Quantity label={t('Quantity')+' '+l.plant.name} value={l.quantity} onChange={n=>quantity(l.id,n)}/><button type="button" className="text-link" onClick={()=>quantity(l.id,0)}>{t('Remove')}</button>{!drawer&&<button type="button" className="text-link" onClick={()=>{setSaved(ids=>ids.includes(l.id)?ids:[...ids,l.id]);quantity(l.id,0);}}>{t('Save for later')}</button>}</div>
    </div>{!drawer&&l.plant.price!==null&&<strong className="line-total">{rupees(l.quantity*l.plant.price)}</strong>}</li>)}</ul>;
}
function Summary({lines,checkout=true}:{lines:CartLine[];checkout?:boolean}) {
  const {t}=useStore();
  const amount=lines.reduce((sum,l)=>sum+(l.plant.price??0)*l.quantity,0);
  return <div className="order-summary"><h2>{checkout?t('Estimated subtotal'):'Enquiry summary'}</h2>{!checkout&&<ul>{lines.map(l=><li key={l.id}>{l.quantity} × {l.plant.name}<span>{l.plant.price===null?t('Request price'):rupees(l.quantity*l.plant.price)}</span></li>)}</ul>}
    <strong className="summary-price">{lines.every(line=>line.plant.price===null)?t('Request price'):rupees(amount)}</strong>
    <p>{lines.some(line=>line.plant.price===null)?'Quote-only items are priced by the nursery. ':''}Confirm the final price, delivery charges and payment options with the nursery.</p>
    {checkout&&<><Link to="/checkout" className="btn btn-dark"><ShoppingBag size={18}/>{t('Checkout')}</Link><Link to="/shop" className="text-link">{t('Continue shopping')}</Link></>}
  </div>;
}
export function Cart({drawer=false}:{drawer?:boolean}) {
  const {t,cartPlants,saved,setSaved,visible,add}=useStore();
  const savedPlants=saved.flatMap(id=>visible.filter(p=>p.id===id));
  const content=cartPlants.length?<><CartLines lines={cartPlants} drawer={drawer}/><Summary lines={cartPlants}/></>:<Empty title={t('Your cart is empty')}><p>Browse plants and add the varieties you want to enquire about.</p><Link to="/shop" className="btn btn-dark">{t('Continue shopping')}</Link></Empty>;
  if(drawer)return <div className="drawer-cart">{content}{cartPlants.length>0&&<Link className="btn btn-outline" to="/cart">{t('View cart')}</Link>}</div>;
  const related=visible.filter(p=>p.featured&&!cartPlants.some(l=>l.id===p.id)).slice(0,4);
  return <><PageHead title={t('Cart')} summary="Review the plants and quantities for your nursery enquiry."/><section className="wrap section">
    <div className={cartPlants.length?'cart-layout':''}>{content}</div>
    {savedPlants.length>0&&<div className="saved-list"><h2>{t('Saved for later')}</h2>{savedPlants.map(p=><div key={p.id}><Link to={'/plants/'+p.slug}>{p.name}</Link><Price plant={p}/><button className="text-link" type="button" onClick={()=>add(p.id)}>{t('Move to cart')}</button><button className="text-link" type="button" onClick={()=>setSaved(ids=>ids.filter(id=>id!==p.id))}>{t('Remove')}</button></div>)}</div>}
    {related.length>0&&<div className="section compact"><Heading title={t('Related plants')}/><ProductGrid plants={related}/></div>}
  </section></>;
}

function Field({label,name,optional=false,kind='text',half=false,max=120,pattern,autoComplete,placeholder}:{label:string;name:string;optional?:boolean;kind?:string;half?:boolean;max?:number;pattern?:string;autoComplete?:string;placeholder?:string}) {
  const {t}=useStore();
  return <label className={'field '+(half?'':'wide')}><span>{t(label)}{!optional&&<span className="required" aria-hidden="true"> *</span>}</span>
    {kind==='textarea'?<textarea name={name} required={!optional} maxLength={800} rows={3} placeholder={placeholder}/>:<input name={name} required={!optional} type={kind} min={kind==='number'?1:undefined} max={kind==='number'?1000000:undefined} maxLength={max} pattern={pattern??(kind==='text'&&!optional?'.*\\S.*':undefined)} inputMode={name==='pin'?'numeric':undefined} autoComplete={autoComplete} placeholder={placeholder} />}</label>;
}
function LocationFields() {
  const {t}=useStore();
  return <><label className="field"><span>{t('State')} <span className="required" aria-hidden="true">*</span></span><select name="state" autoComplete="address-level1" required defaultValue=""><option value="">{t('Choose a state')}</option>{states.map(s=><option key={s}>{s}</option>)}</select></label>
    <Field label="City" name="city" autoComplete="address-level2" half max={60}/><Field label="PIN code" name="pin" autoComplete="postal-code" half max={6} pattern="[1-9][0-9]{5}" placeholder="226102"/></>;
}
function EnquiryForm({children,heading,makeMessage,event}:{children:ReactNode;heading:string;makeMessage:(f:FormData)=>string;event:string}) {
  const {t,whatsapp,track}=useStore();
  const [message,setMessage]=useState('');
  const [error,setError]=useState('');
  const submit=(e:FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const data=new FormData(e.currentTarget);
    const blankField=Array.from(e.currentTarget.elements).find(el=>(el instanceof HTMLInputElement||el instanceof HTMLTextAreaElement)&&el.required&&el.type!=='checkbox'&&!el.value.trim());
    if(blankField){
      (blankField as HTMLInputElement|HTMLTextAreaElement).focus();
      setError('Please complete all required fields.');
      return;
    }
    setError('');
    setMessage(makeMessage(data));
  };
  return <div className="enquiry-card"><h2>{heading}</h2>
    <form className="form-grid" hidden={Boolean(message)} onSubmit={submit}>
      {children}
      <label className="consent wide"><input type="checkbox" name="consent" required/><span>{t('I agree to share the information below with the nursery through WhatsApp.')}</span></label>
      {error&&<p role="alert" className="form-error wide">{error}</p>}
      <button type="submit" className="btn btn-dark wide"><MessageCircle size={18}/>{t('Prepare WhatsApp enquiry')}</button>
    </form>
    {message&&<div className="message-preview"><pre tabIndex={0}>{message}</pre><p>{t('This opens the actual Avadh Nursery WhatsApp number. You decide whether to send the message.')}</p>
      <div className="button-row"><button type="button" className="btn btn-outline" onClick={()=>setMessage('')}>{t('Edit details')}</button><a href={whatsapp(message)} target="_blank" rel="noopener noreferrer" className="btn btn-dark" onClick={()=>track(event)}><MessageCircle size={18}/>{t('Open WhatsApp')}</a></div></div>}
  </div>;
}
const value=(form:FormData,key:string)=>String(form.get(key)||'').trim();
const contactFields=(phoneRequired=true)=><><Field label="Your name" name="name" autoComplete="name" half max={70}/><Field label="Mobile number" name="phone" autoComplete="tel" kind="tel" half optional={!phoneRequired} pattern="[+]?(91[ ]?)?[6-9][0-9]{9}" max={15} placeholder="10-digit Indian number"/></>;
export function Checkout({search}:{search:string}) {
  const {t,visible,cartPlants}=useStore();
  const p=new URLSearchParams(search);
  const request=p.get('plant');
  const product=visible.find(plant=>plant.slug===request);
  const qty=Math.max(1,Math.min(999,Math.floor(Number(p.get('qty'))) || 1));
  const lines=request?(product?[{plant:product,id:product.id,quantity:qty}]:[]):cartPlants;
  return <><PageHead title={t('Checkout and order enquiry')} summary="Confirm your details and review your message before opening WhatsApp."/><section className="section wrap checkout">
    {lines.length?<div className="form-layout"><EnquiryForm heading={t('Delivery')} event="WhatsApp checkout clicks" makeMessage={f=>{
      const products=lines.map(l=>'Product: '+l.plant.name+' ('+l.plant.id+')\nQuantity: '+l.quantity).join('\n\n');
      return 'Hello Avadh Nursery,\n\nI would like to enquire about the following plants:\n\n'+products+'\n\nName: '+value(f,'name')+'\nMobile: '+value(f,'phone')+'\nCity: '+value(f,'city')+'\nState: '+value(f,'state')+'\nPIN Code: '+value(f,'pin')+(value(f,'address')?'\nDelivery address: '+value(f,'address'):'')+(value(f,'notes')?'\nAdditional requirements: '+value(f,'notes'):'')+'\n\nPlease confirm availability, final pricing, delivery charges and payment options.\n\nThank you.';
    }}>{contactFields()}<LocationFields/><Field label="Delivery address (optional)" name="address" optional autoComplete="street-address" max={220}/><Field label="Additional requirements (optional)" name="notes" optional kind="textarea"/></EnquiryForm><Summary lines={lines} checkout={false}/></div>:<Empty title={t('Your cart is empty')}><Link to="/shop" className="btn btn-dark">{t('Continue shopping')}</Link></Empty>}
    <DemoNote/>
  </section></>;
}
export function Wholesale() {
  const {t,visible,lang}=useStore();
  const [varieties,setVarieties]=useState<string[]>([]);
  const [variety,setVariety]=useState('');
  return <><PageHead title={t('Wholesale')} image={img('orchard')} eyebrow="FARMERS, RESELLERS & LANDSCAPERS" summary="Request a nursery quote for orchard planting, resale or landscaping."/><section className="wrap section form-layout">
    <EnquiryForm heading={t('Request bulk quote')} event="Wholesale enquiry clicks" makeMessage={f=>'Hello Avadh Nursery,\n\nI would like a bulk plant quote.\n\nBusiness: '+(value(f,'business')||'Individual buyer')+'\nBuyer: '+value(f,'name')+'\nMobile: '+value(f,'phone')+'\nVarieties: '+[...varieties,value(f,'other')].filter(Boolean).join(', ')+'\nTotal quantity: '+value(f,'quantity')+'\nDelivery location: '+value(f,'city')+', '+value(f,'state')+' '+value(f,'pin')+'\nExpected delivery period: '+value(f,'period')+'\nProject: '+value(f,'project')+(value(f,'notes')?'\nNotes: '+value(f,'notes'):'')+'\n\nPlease share availability, delivery options and a quote.'}>
      <Field label="Business name" name="business" optional/>{contactFields()}
      <div className="wide"><label className="field"><span>{t('Plant varieties')}</span><select value={variety} onChange={e=>{const val=e.target.value;setVariety('');if(val)setVarieties(items=>items.includes(val)?items:[...items,val]);}}><option value="">Choose varieties from the catalogue</option>{visible.filter(p=>!varieties.includes(p.name)).map(p=><option value={p.name} key={p.id}>{lang==='hi'?p.hindi:p.name}</option>)}</select></label>
      <div className="selection-chips">{varieties.map(x=><button type="button" key={x} onClick={()=>setVarieties(v=>v.filter(i=>i!==x))}>{x} ×</button>)}</div></div>
      <Field label={varieties.length?'Other varieties (optional)':'Variety or plant requirements'} name="other" optional={varieties.length>0}/>
      <Field label="Required quantity" name="quantity" kind="number" half/><Field label="Expected delivery period" name="period" half placeholder="e.g. February planting"/>
      <LocationFields/><Field label="Project details" name="project" kind="textarea"/><Field label="Notes (optional)" name="notes" kind="textarea" optional/>
    </EnquiryForm>
    <aside className="order-summary"><PackageOpen size={30} strokeWidth={1.4}/><h2>Plan your plant order</h2><p>For a more useful quote, include preferred cultivars, approximate quantities by variety and your expected planting date.</p><Link to="/collections/commercial" className="btn btn-outline">Browse orchard plants</Link><Link to="/guide/grafted-or-seed-grown" className="text-link">Learn about grafted plants</Link></aside>
  </section></>;
}
export function Contact() {
  const {t,settings,whatsapp,track}=useStore();
  return <><PageHead title={t('Contact')} summary="Ask about plant varieties, delivery or visiting the nursery."/><section className="section wrap form-layout">
    <EnquiryForm heading="Message the nursery" event="WhatsApp contact clicks" makeMessage={f=>'Hello Avadh Nursery,\n\n'+value(f,'message')+'\n\nName: '+value(f,'name')+(value(f,'phone')?'\nMobile: '+value(f,'phone'):'')}>{contactFields(false)}<Field label="Your message" name="message" kind="textarea"/></EnquiryForm>
    <aside className="order-summary contact-address"><MapPin size={27}/><h2>{t('Visit the nursery')}</h2><p>{settings.address}</p><a className="btn btn-outline" href={mapLink(settings.address)} target="_blank" rel="noopener noreferrer">{t('Get directions')}</a><a className="text-link" href={'tel:+'+settings.phone}><Phone size={17}/>{t('Call the nursery')}</a><a className="text-link" href={whatsapp('Hello Avadh Nursery, I have a question about your plants.')} target="_blank" rel="noopener noreferrer" onClick={()=>track('WhatsApp contact clicks')}><MessageCircle size={17}/>WhatsApp +{settings.phone}</a><SocialLinks/></aside>
  </section></>;
}
export function Tracking() {
  const {t,orders}=useStore();
  const [code,setCode]=useState('');
  const [lookup,setLookup]=useState('');
  const record=orders.find(o=>o.id===lookup);
  return <><PageHead title={t('Order tracking')} summary="Look up an enquiry status in the local demo records."/><section className="wrap section narrow"><form className="enquiry-card form-grid" onSubmit={e=>{e.preventDefault();setLookup(code.trim().toUpperCase());}}>
    <p className="wide demo-note"><Leaf size={16}/>Sample records only. Try AV-DEMO-1001.</p>
    <label className="field wide"><span>{t('Enquiry reference')}</span><input value={code} onChange={e=>{setCode(e.target.value);setLookup('');}} required maxLength={40} placeholder="AV-DEMO-1001"/></label>
    <button type="submit" className="btn btn-dark wide">{t('Check status')}</button>
    {lookup&&<div className="delivery-result wide" aria-live="polite">{record?<><strong>{record.id} · {record.status}</strong><p>{record.items}</p><small>Sample enquiry in {record.region}</small></>:<p>No sample enquiry found for {lookup}. Check the reference and try again.</p>}</div>}
  </form></section></>;
}
