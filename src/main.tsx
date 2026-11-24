import { createRoot } from 'react-dom/client';
import { lazy, Suspense, useEffect } from 'react';
import '@fontsource-variable/cormorant-garamond';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
import '@fontsource-variable/manrope';
import '@fontsource-variable/noto-sans-devanagari';
import './styles.css';
import './polish.css';
import { Provider, safeImage, useStore } from './state';
import { Header, Footer, MobileNavigation, MobileMenu, Modal } from './ui';
import { Home } from './Home';
import { Catalog, Compare, CompareTray, Finder, NotFound, PlantDetail, SearchOverlay, Wishlist } from './Catalog';
import { Cart, Checkout, Contact, Tracking, Wholesale } from './Commerce';
import { About, ArticlePage, FaqPage, Gallery, Guide, Policy } from './Info';
import { pageMetadata } from './seo';
const Admin=lazy(()=>import('./Admin'));

function App() {
  const {path,t,overlay,setOverlay,quick,setQuick,notice,visible,categories,articles,settings}=useStore();
  const [routeRaw,search='']=path.split('?');
  const route=routeRaw.replace(/\/+$/,'')||'/';
  const [section,id]=route.split('/').filter(Boolean);
  useEffect(()=>{
    const metadata=pageMetadata(route,visible,categories,articles,settings.brand);
    document.title=metadata.title;
    const set=(name:string,value:string)=>document.querySelector(name)?.setAttribute('content',value);
    set('meta[name="description"]',metadata.description);
    set('meta[property="og:title"]',metadata.title);
    set('meta[property="og:description"]',metadata.description);
    set('meta[property="og:image"]',new URL(safeImage(metadata.image).startsWith('data:')?'/images/hero.webp':safeImage(metadata.image),location.origin).href);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href',location.origin+route);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content',location.origin+route);
  },[route,visible,categories,articles,settings.brand]);
  let content;
  switch(section){
    case undefined:content=<Home/>;break;
    case 'shop':content=<Catalog search={search}/>;break;
    case 'collections':content=<Catalog categoryId={id} search={search}/>;break;
    case 'plants':{
      const item=visible.find(p=>p.slug===id);content=item?<PlantDetail plant={item}/>:<NotFound/>;break;
    }
    case 'plant-finder':content=<Finder/>;break;
    case 'compare':content=<Compare/>;break;
    case 'wishlist':content=<Wishlist/>;break;
    case 'cart':content=<Cart/>;break;
    case 'checkout':content=<Checkout search={search}/>;break;
    case 'wholesale':content=<Wholesale/>;break;
    case 'guide':{
      const item=articles.find(a=>a.id===id);content=id?(item?<ArticlePage article={item}/>:<NotFound/>):<Guide/>;break;
    }
    case 'about':content=<About/>;break;
    case 'gallery':content=<Gallery/>;break;
    case 'faq':content=<FaqPage/>;break;
    case 'contact':content=<Contact/>;break;
    case 'track':content=<Tracking/>;break;
    case 'shipping':case 'returns':case 'privacy':case 'terms':content=<Policy name={section}/>;break;
    case 'admin':content=<Suspense fallback={<p className="wrap section" role="status">Loading dashboard…</p>}><Admin section={id??''}/></Suspense>;break;
    default:content=<NotFound/>;
  }
  const isAdmin=section==='admin';
  return <>
    <a className="skip-link" href="#content">Skip to content</a>
    {!isAdmin&&<Header/>}
    <main tabIndex={-1} id="content" key={path} className={isAdmin?'admin-page':'store-page'}>{content}</main>
    {!isAdmin&&<><Footer/><MobileNavigation/>{['shop','collections','plants','plant-finder','wishlist'].includes(section??'')&&<CompareTray/>}</>}
    {overlay==='search'&&<Modal title={t('Search')} onClose={()=>setOverlay(null)}><SearchOverlay/></Modal>}
    {overlay==='menu'&&<Modal title={t('Menu')} drawer onClose={()=>setOverlay(null)}><MobileMenu/></Modal>}
    {overlay==='cart'&&<Modal title={t('Cart')} drawer onClose={()=>setOverlay(null)}><Cart drawer/></Modal>}
    {quick&&<Modal title={t('Quick view')} onClose={()=>setQuick(null)}><PlantDetail plant={quick} quick/></Modal>}
    <div aria-live="polite" className={notice?'toast visible':'toast'}>{notice}</div>
  </>;
}
createRoot(document.getElementById('root')!).render(<Provider><App/></Provider>);
