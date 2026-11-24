import { useEffect, useRef, useState, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ChevronDown, ChevronRight, GitCompareArrows, Heart, House, Leaf, Menu, MessageCircle, Search, ShoppingBag, Sprout, X, Eye, Ellipsis, Plus, Minus, Instagram, Facebook, Youtube, Phone, MapPin } from 'lucide-react';
import { type Plant } from './data';
import { rupees, safeImage, safeURL, useStore } from './state';
import { usePerspective } from './motion';

export function Link({to,children,...rest}:AnchorHTMLAttributes<HTMLAnchorElement>&{to:string;children:ReactNode}) {
  const {go}=useStore();
  return <a {...rest} href={to} onClick={event=>{
    rest.onClick?.(event);
    if(event.defaultPrevented || event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || rest.target) return;
    event.preventDefault(); go(to);
  }}>{children}</a>;
}
export function IconButton({label,children,...props}:ButtonHTMLAttributes<HTMLButtonElement>&{label:string}) {
  return <button type="button" className="icon-btn" {...props} aria-label={label} title={label}>{children}</button>;
}
export function Photo({src,alt,className='',priority=false}:{src:string;alt:string;className?:string;priority?:boolean}) {
  return <img className={className} src={safeImage(src)} alt={alt} loading={priority?'eager':'lazy'} decoding={priority?'sync':'async'} onError={e=>{
    if(!e.currentTarget.src.endsWith('/images/nursery.webp')) e.currentTarget.src='/images/nursery.webp';
  }}/>;
}
export function Wordmark({footer=false}:{footer?:boolean}) {
  const {settings}=useStore();
  return <Link to="/" className={'wordmark '+(footer?'footer-mark':'')} aria-label={settings.brand+' home'} title="Proposed botanical wordmark">
    <span className="wordmark-icon"><Sprout size={31} strokeWidth={1.4}/></span><span className="wordmark-type"><strong>{settings.mark}</strong><small>&amp; GARDENING</small></span>
  </Link>;
}
const navigation=[['Home','/'],['Shop Plants','/shop'],['Fruit Varieties','/collections/fruit'],['Plant Finder','/plant-finder'],['Gardening Guide','/guide'],['Wholesale','/wholesale'],['About','/about']];
export function Header() {
  const {t,lang,setLang,cartPlants,wishPlants,settings,categories,path,setOverlay}=useStore();
  const [bar,setBar]=useState(true);
  const count=cartPlants.reduce((n,l)=>n+l.quantity,0);
  const [activeMenu,setActiveMenu]=useState<string|null>(null);
  return <header className="site-header">
    {bar&&<div className="announcement"><span><Leaf size={13}/> {t(settings.announcement)}</span><button aria-label={t('Close')} type="button" onClick={()=>setBar(false)}><X size={14}/></button></div>}
    <div className="nav-shell">
      <div className="nav-inner">
        <button className="mobile-menu icon-btn" type="button" aria-label={t('Menu')} onClick={()=>setOverlay('menu')}><Menu size={23}/></button>
        <Wordmark/>
        <nav className="desktop-nav" aria-label="Main navigation" onKeyDown={event=>{if(event.key==='Escape'&&activeMenu){event.currentTarget.querySelector<HTMLButtonElement>('button[aria-expanded="true"]')?.focus();setActiveMenu(null);}}}>
          {navigation.map(([label,to])=><div key={to} className="nav-item" onMouseLeave={()=>setActiveMenu(v=>v===to?null:v)}>
            <Link aria-current={path===to?'page':undefined} to={to} onClick={()=>setActiveMenu(null)}>{t(label)}</Link>
            {['/shop','/collections/fruit'].includes(to)&&<>
              <button type="button" aria-label={t('Browse collections')+' · '+t(label)} aria-expanded={activeMenu===to} onClick={()=>setActiveMenu(activeMenu===to?null:to)} onMouseEnter={()=>setActiveMenu(to)}><ChevronDown size={12}/></button>
              {activeMenu===to&&<div className="mega"><div className="mega-links">
                {(to==='/shop'?categories:categories.filter(c=>['fruit','mango','guava','citrus','exotic'].includes(c.id))).map(c=><Link key={c.id} to={'/collections/'+c.id} onClick={()=>setActiveMenu(null)}>{lang==='hi'?c.hindi:c.name}</Link>)}</div>
                <Link to="/collections/mango" onClick={()=>setActiveMenu(null)} className="mega-picture"><Photo src="/images/mango-editorial.webp" alt="Illustrative mangoes on the tree"/><span>{lang==='hi'?'मलिहाबाद के आम':'Explore Malihabad mangoes'}</span></Link></div>}
            </>}
          </div>)}
        </nav>
        <div className="nav-tools">
          <button type="button" className="lang-toggle" onClick={()=>setLang(lang==='en'?'hi':'en')} aria-label={lang==='en'?'Switch to Hindi':'Switch to English'}>{lang==='en'?'EN':'हिं'}<ChevronDown size={11}/></button>
          <IconButton label={t('Search')} onClick={()=>setOverlay('search')}><Search size={21} strokeWidth={1.65}/></IconButton>
          <Link to="/wishlist" className="icon-btn header-wish" aria-label={t('Wishlist')}><Heart size={21} strokeWidth={1.65}/>{wishPlants.length>0&&<sup>{wishPlants.length}</sup>}</Link>
          <IconButton label={t('Cart')} onClick={()=>setOverlay('cart')}><ShoppingBag size={21} strokeWidth={1.65}/><sup>{count}</sup></IconButton>
        </div>
      </div>
    </div>
  </header>;
}
export function MobileNavigation() {
  const {t,path,plantCartOpen}=useStore();
  if(plantCartOpen) return null;
  const active=path.startsWith('/collections/')?'/shop':path.split('?')[0].replace(/\/+$/,'')||'/';
  const nav=[['Home','/',House],['Shop Plants','/shop',Leaf],['Plant Finder','/plant-finder',Sprout],['Wishlist','/wishlist',Heart],['Cart','/cart',ShoppingBag]] as const;
  return <nav className="bottom-nav" aria-label="Mobile navigation">{nav.map(([label,to,Icon])=><Link key={to} to={to} aria-current={active===to?'page':undefined}><Icon size={19}/><span>{t(label==='Shop Plants'?'Shop':label==='Plant Finder'?'Find plants':label)}</span></Link>)}</nav>;
}
export function MobileMenu() {
  const {t,lang,categories}=useStore();
  return <div className="drawer-links">{navigation.map(([name,to])=><Link key={to} to={to}>{t(name)}<ChevronRight size={17}/></Link>)}
    <details><summary>{t('Collections')}</summary>{categories.map(c=><Link key={c.id} to={'/collections/'+c.id}>{lang==='hi'?c.hindi:c.name}</Link>)}</details>
    <Link to="/contact">{t('Contact')}<ChevronRight size={17}/></Link>
  </div>;
}
export function Heading({label,title,children,action}:{label?:string;title:string;children?:ReactNode;action?:ReactNode}) {
  return <div className="section-heading"><div>{label&&<span className="eyebrow">{label}</span>}<h2>{title}</h2>{children&&<p>{children}</p>}</div>{action}</div>;
}
export function PageHead({title,eyebrow,summary,image,crumb}:{title:string;eyebrow?:string;summary?:string;image?:string;crumb?:string}) {
  const {t}=useStore();
  return <section className={'page-head '+(image?'page-head-image':'')}>
    {image&&<Photo src={image} alt="" priority/>}
    <div className="wrap"><div className="crumb"><Link to="/">{t('Home')}</Link><ChevronRight size={13}/>{crumb&&<><Link to="/shop">{t('Shop Plants')}</Link><ChevronRight size={13}/></>}<span>{title}</span></div>
    {eyebrow&&<span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{summary&&<p>{summary}</p>}</div>
  </section>;
}
export function Price({plant}:{plant:Plant}) {
  const {t}=useStore();
  return <span className="price">{plant.price===null?t('Request price'):<>{rupees(plant.price)} <small>{t('Sample price')}</small></>}</span>;
}
export function ProductCard({plant}: {plant:Plant}) {
  const {t,lang,wish,compare,toggleWish,toggleCompare,add,setQuick}=useStore();
  const [more,setMore]=useState(false);
  const tilt=usePerspective<HTMLDivElement>();
  const name=lang==='hi'?plant.hindi:plant.name;
  return <article className="product-card">
    <div className="product-image" ref={tilt}>
      <Link to={'/plants/'+plant.slug} tabIndex={-1}><Photo src={plant.images[0]} alt={'Illustrative '+plant.name+' sapling'}/></Link>
      {plant.pot&&<span className="photo-tag">{t('Pot-friendly')}</span>}
      <div className="card-float"><IconButton label={t('Wishlist')+' · '+name} aria-pressed={wish.includes(plant.id)} onClick={()=>toggleWish(plant.id)}><Heart size={17} fill={wish.includes(plant.id)?'currentColor':'none'}/></IconButton></div>
    </div>
    <div className="product-copy">
      <Link to={'/plants/'+plant.slug}><h3>{name}</h3></Link>
      <p>{t(plant.light)} <span>·</span> {t(plant.difficulty)}</p>
      <Price plant={plant}/>
      <div className="product-actions"><button type="button" className="btn btn-outline btn-sm" onClick={()=>add(plant.id)}><Plus size={16}/>{t('Add to cart')}</button>
        <IconButton label={t('More options')+' · '+name} aria-haspopup="dialog" onClick={()=>setMore(true)}><Ellipsis size={19}/></IconButton>
      </div>
    </div>
    {more&&<Modal title={name} onClose={()=>setMore(false)}>
      <div className="plant-menu">
        <button type="button" onClick={()=>{setMore(false);setQuick(plant);}}><Eye size={19}/>{t('Quick view')}</button>
        <button type="button" aria-pressed={compare.includes(plant.id)} onClick={()=>toggleCompare(plant.id)}><GitCompareArrows size={19}/>{t(compare.includes(plant.id)?'Remove from comparison':'Compare')}</button>
        <Link to={'/checkout?plant='+plant.slug} onClick={()=>setMore(false)}><MessageCircle size={19}/>{t('WhatsApp enquiry')}</Link>
      </div>
    </Modal>}
  </article>;
}
export function ProductGrid({plants,list=false}:{plants:Plant[];list?:boolean}) {
  return <div className={'products '+(list?'products-list':'')}>{plants.map(p=><ProductCard key={p.id} plant={p}/>)}</div>;
}
export function FaqList({limit}:{limit?:number}) {
  const {faq}=useStore();
  return <div className="faq-list">{faq.slice(0,limit??faq.length).map(item=><details key={item.id}><summary>{item.question}<Plus size={19}/></summary><p>{item.answer}</p></details>)}</div>;
}
export function Quantity({value,onChange,label}:{value:number;onChange:(n:number)=>void;label:string}) {
  return <div className="quantity" aria-label={label}><button type="button" aria-label={label+' minus'} disabled={value<=1} onClick={()=>onChange(value-1)}><Minus size={15}/></button>
  <output aria-live="polite">{value}</output><button type="button" aria-label={label+' plus'} disabled={value>=999} onClick={()=>onChange(value+1)}><Plus size={15}/></button></div>;
}
export function Modal({title,children,onClose,drawer=false}:{title:string;children:ReactNode;onClose:()=>void;drawer?:boolean}) {
  const dialog=useRef<HTMLDialogElement>(null);
  const {t}=useStore();
  useEffect(()=>{
    const el=dialog.current;
    el?.showModal();
    const old=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return ()=>{el?.close();document.body.style.overflow=old;};
  },[]);
  return <dialog ref={dialog} className={drawer?'modal drawer':'modal'} aria-label={title} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="modal-head"><h2>{title}</h2><IconButton label={t('Close')} onClick={onClose}><X size={23}/></IconButton></div>
    <div className="modal-body">{children}</div>
  </dialog>;
}
export function Empty({title,children}:{title:string;children?:ReactNode}) {
  return <div className="empty"><Sprout size={38} strokeWidth={1.25}/><h2>{title}</h2>{children}</div>;
}
export function DemoNote() {
  const {t}=useStore();
  return <p className="demo-note"><Leaf size={15}/>{t('This demo uses illustrative images and indicative prices. Confirm availability and final costs with the nursery.')}</p>;
}
export function SocialLinks() {
  const {settings}=useStore();
  const items=[[settings.instagram,'Instagram',Instagram],[settings.facebook,'Facebook',Facebook],[settings.youtube,'YouTube',Youtube]] as const;
  return <div className="social-links">{items.filter(([url])=>safeURL(url)).map(([url,name,Icon])=><a key={name} href={url} target="_blank" rel="noopener noreferrer" aria-label={name}><Icon size={18}/></a>)}</div>;
}
export const mapLink=(address:string)=>'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(address);
export function Footer() {
  const {t,settings,categories,lang}=useStore();
  const support=[['Contact','/contact'],['FAQ','/faq'],['Order tracking','/track'],['Shipping information','/shipping'],['Returns & replacements','/returns'],['Privacy policy','/privacy'],['Terms & conditions','/terms']];
  return <footer className="footer"><div className="wrap footer-grid">
    <div><Wordmark footer/><p>{lang==='hi'?'मलिहाबाद, लखनऊ से फलदार और बागवानी के पौधे।':'Fruit plants and greenery from Malihabad, Lucknow.'}</p><SocialLinks/></div>
    <div><h3>{t('Collections')}</h3>{categories.slice(0,6).map(c=><Link key={c.id} to={'/collections/'+c.id}>{lang==='hi'?c.hindi:c.name}</Link>)}</div>
    <div><h3>{t('Customer support')}</h3>{support.map(([label,to])=><Link key={to} to={to}>{t(label)}</Link>)}</div>
    <div><h3>{t('Visit the nursery')}</h3><a href={mapLink(settings.address)} target="_blank" rel="noopener noreferrer"><MapPin size={18}/>{settings.address}</a><a href={'tel:+'+settings.phone}><Phone size={17}/>{settings.phone.startsWith('91')?'+91 '+settings.phone.slice(2):'+'+settings.phone}</a><a href={'https://wa.me/'+settings.phone} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-sm"><MessageCircle size={16}/>WhatsApp</a></div>
  </div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} {settings.brand}</span><span>Demo catalogue · Proposed logo concept</span><Link to="/admin">Demo admin</Link></div></footer>;
}
