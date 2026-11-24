import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode, type SetStateAction } from 'react';
import { articlesSeed, bulkSeed, categoriesSeed, faqSeed, ordersSeed, plantsSeed, settingsSeed, type Plant } from './data';
import { translate } from './i18n';

export function useStored<T>(key:string, initial:T) {
  const storageKey = 'avadh.v1.' + key;
  const read = (raw:string|null) => {
    try { return raw===null?initial:JSON.parse(raw) as T; }
    catch { return initial; }
  };
  const [value,setSnapshot]=useState<T>(() => {
    try { return read(localStorage.getItem(storageKey)); }
    catch { return initial; }
  });
  const current=useRef(value);
  const setValue=useCallback((update:SetStateAction<T>)=>{
    const next=typeof update==='function'?(update as (value:T)=>T)(current.current):update;
    current.current=next;
    setSnapshot(next);
    try { localStorage.setItem(storageKey,JSON.stringify(next)); }
    catch { window.dispatchEvent(new CustomEvent('avadh:storageError')); }
  },[storageKey]);
  useEffect(()=>{
    const sync=(event:StorageEvent)=>{
      if(event.key!==storageKey&&event.key!==null)return;
      const next=read(event.newValue);
      current.current=next;
      setSnapshot(next);
    };
    window.addEventListener('storage',sync);
    return ()=>window.removeEventListener('storage',sync);
  },[storageKey]);
  return [value,setValue] as const;
}
type Line = {id:string; quantity:number};
function useApp() {
  const [path,setPath] = useState(() => location.pathname + location.search);
  const [lang,setLang] = useStored('lang','en');
  const [plants,setPlants] = useStored('plants',plantsSeed);
  const [categories,setCategories] = useStored('categories',categoriesSeed);
  const [articles,setArticles] = useStored('articles',articlesSeed);
  const [faq,setFaq] = useStored('faq',faqSeed);
  const [settings,setSettings] = useStored('settings',settingsSeed);
  const [orders,setOrders] = useStored('orders',ordersSeed);
  const [bulks,setBulks] = useStored('bulk',bulkSeed);
  const [cart,setCart] = useStored<Line[]>('cart',[]);
  const [wish,setWish] = useStored<string[]>('wish',[]);
  const [saved,setSaved] = useStored<string[]>('saved',[]);
  const [compare,setCompare] = useStored<string[]>('compare',[]);
  const [activity,setActivity] = useStored<Record<string,number>>('activity',{});
  const [overlay,setOverlay] = useState<'search'|'menu'|'cart'|null>(null);
  const [quick,setQuick] = useState<Plant|null>(null);
  const [notice,setNotice] = useState('');
  const [plantCartOpen,setPlantCartOpen] = useState(false);
  const t = (s:string) => translate(s,lang);
  useEffect(() => {
    const pop = () => { setPath(location.pathname + location.search); setOverlay(null); setQuick(null); };
    const storageError = () => setNotice('Browser storage is full or disabled. Changes may be lost on refresh.');
    window.addEventListener('popstate',pop);
    window.addEventListener('avadh:storageError',storageError);
    return () => { window.removeEventListener('popstate',pop); window.removeEventListener('avadh:storageError',storageError); };
  },[]);
  useEffect(() => { document.documentElement.lang=lang; },[lang]);
  useEffect(() => {
    if (!notice) return;
    const timer=window.setTimeout(() => setNotice(''),3000);
    return () => clearTimeout(timer);
  },[notice]);
  const go = (to:string) => {
    if (to !== path) {
      window.history.pushState({},'',to);
      setPath(to);
      window.scrollTo(0,0);
      requestAnimationFrame(() => document.querySelector<HTMLElement>('main')?.focus({preventScroll:true}));
    }
    setOverlay(null); setQuick(null);
  };
  const track = (name:string) => {
    const mobile=window.matchMedia('(max-width: 700px)').matches;
    const mobileKey='Mobile · '+name;
    setActivity(a=>({...a,[name]:(a[name]||0)+1,...(mobile?{[mobileKey]:(a[mobileKey]||0)+1}:{})}));
  };
  const add = (id:string, quantity=1, drawer=false) => {
    setCart(lines => {
      const line = lines.find(l=>l.id===id);
      return line ? lines.map(l=>l.id===id? {...l,quantity:Math.min(999,l.quantity+quantity)}:l) : [...lines,{id,quantity}];
    });
    setSaved(ids=>ids.filter(x=>x!==id));
    setNotice(t('Added to cart'));
    track('Cart additions');
    if(drawer) setOverlay('cart');
  };
  const quantity = (id:string, value:number) => setCart(lines => value<1 ? lines.filter(l=>l.id!==id) : lines.map(l=>l.id===id?{...l,quantity:Math.min(999,value)}:l));
  const toggleWish = (id:string) => {
    if (!wish.includes(id)) track('Wishlist additions');
    setWish(ids=>ids.includes(id)?ids.filter(x=>x!==id):[...ids,id]);
  };
  const toggleCompare=(id:string)=>{
    if(compare.includes(id)) setCompare(ids=>ids.filter(x=>x!==id));
    else if(compare.length<3) setCompare(ids=>ids.length<3?[...ids,id]:ids);
    else setNotice(lang==='hi'?'अधिकतम तीन पौधों की तुलना करें।':'Compare up to three plants at a time.');
  };
  const visible=plants.filter(p=>p.published);
  const cartPlants=cart.flatMap(line=>{const plant=visible.find(p=>p.id===line.id);return plant?[{...line,plant}]:[];});
  const wishPlants=visible.filter(p=>wish.includes(p.id));
  const comparePlants=compare.flatMap(id=>visible.filter(p=>p.id===id));
  const subtotal=cartPlants.reduce((sum,l)=>sum+(l.plant.price??0)*l.quantity,0);
  const whatsapp=(message:string)=>'https://wa.me/'+settings.phone.replace(/\D/g,'')+'?text='+encodeURIComponent(message);
  return {path,go,lang,setLang,t,plants,setPlants,visible,categories,setCategories,articles,setArticles,faq,setFaq,settings,setSettings,orders,setOrders,bulks,setBulks,cart,cartPlants,subtotal,add,quantity,wish,wishPlants,toggleWish,saved,setSaved,compare,comparePlants,toggleCompare,overlay,setOverlay,quick,setQuick,notice,setNotice,whatsapp,activity,track,plantCartOpen,setPlantCartOpen};
}
const Context=createContext<ReturnType<typeof useApp>|null>(null);
export function Provider({children}:{children:ReactNode}) { return <Context.Provider value={useApp()}>{children}</Context.Provider>; }
export function useStore() {
  const value=useContext(Context);
  if(!value) throw new Error('Store provider missing');
  return value;
}
export const rupees=(n:number)=>'₹'+new Intl.NumberFormat('en-IN').format(n);
export const slugify=(text:string)=> text.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export function safeImage(src:string) { return /^(\/images\/[a-z\d.-]+|data:image\/(png|webp|jpe?g);base64,[a-z\d+/=]+)$/i.test(src) ? src : '/images/nursery.webp'; }
export function safeURL(url:string) {
  try { return new URL(url).protocol === 'https:' ? url : ''; } catch { return ''; }
}
