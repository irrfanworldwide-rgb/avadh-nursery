import { useState } from 'react';
import { ArrowDownRight, Leaf, MapPin, Play, Search } from 'lucide-react';
import { img, inCollection, type Article } from './data';
import { safeURL, useStore } from './state';
import { DemoNote, Empty, FaqList, Heading, Link, Modal, PageHead, Photo, ProductGrid, SocialLinks, mapLink } from './ui';
import { DeliveryCheck } from './Catalog';

export function ArticleCards({articles}:{articles:Article[]}) {
  const {t}=useStore();
  return <div className="article-grid">{articles.map(a=><article className="article-card" key={a.id}><Link to={'/guide/'+a.id} tabIndex={-1}><Photo src={a.image} alt="Illustrative gardening photography"/></Link>
    <div><span className="eyebrow">{a.category}</span><Link to={'/guide/'+a.id}><h3>{a.title}</h3></Link><p>{a.summary}</p><Link className="text-link" to={'/guide/'+a.id}>{t('Read article')}<ArrowDownRight size={15}/></Link></div>
  </article>)}</div>;
}
export function Guide() {
  const {articles,t}=useStore();
  const [q,setQ]=useState('');
  const [category,setCategory]=useState('');
  const groups=Array.from(new Set(articles.map(a=>a.category)));
  const found=articles.filter(a=>(!category||a.category===category)&&[a.title,a.summary,a.category,...a.body].join(' ').toLowerCase().includes(q.trim().toLowerCase()));
  return <><PageHead image={img('terrace')} title={t('Gardening Knowledge Centre')} summary="Practical advice for choosing plants and caring for your growing space."/><section className="wrap section">
    <div className="guide-toolbar"><div className="search-field"><Search size={19}/><input aria-label="Search articles" placeholder="Search articles" value={q} onChange={e=>setQ(e.target.value)}/></div>
    <div className="category-scroll">{['',...groups].map(g=><button type="button" key={g} aria-pressed={g===category} onClick={()=>setCategory(g)}>{g||'All articles'}</button>)}</div></div>
    {found.length?<ArticleCards articles={found}/>:<Empty title="No articles found"><button className="btn btn-outline" type="button" onClick={()=>{setQ('');setCategory('');}}>Clear search</button></Empty>}
  </section></>;
}
export function ArticlePage({article}:{article:Article}) {
  const {visible,t}=useStore();
  return <><PageHead title={article.title} eyebrow={article.category} summary={article.summary} image={article.image}/><article className="wrap section readable article-body">
    <p className="caption">Illustrative gardening photography</p>{article.body.map((text,i)=><p key={i}>{text}</p>)}
    {safeURL(article.source)&&<p className="caption"><a href={article.source} target="_blank" rel="noopener noreferrer">Horticulture reference</a></p>}
    <Link to="/guide" className="text-link">{t('Gardening Guide')}</Link>
  </article><section className="wrap section compact"><Heading title={t('Related plants')}/><ProductGrid plants={visible.filter(p=>inCollection(p,article.collection)).slice(0,4)}/></section></>;
}
export function About() {
  const {t,settings}=useStore();
  return <><PageHead title={t('About')+' Avadh Nursery'} image={img('nursery')} eyebrow="MUJASA, MALIHABAD" summary="A nursery for fruit plants, garden greenery and growing advice."/>
    <section className="wrap section nursery-story"><Photo src={img('orchard')} alt="Illustrative orchard in northern India"/><div><span className="eyebrow">GROWN FROM A PLACE</span><h2>Malihabad, Lucknow.</h2><p>{settings.brand} is based in Mujasa, near Malihabad. The nursery accepts enquiries for fruit plants, ornamentals and bulk requirements from home gardeners, farmers and resellers.</p><p>Contact the team to discuss current varieties or plan a visit.</p><div className="button-row"><a className="btn btn-dark" href={mapLink(settings.address)} target="_blank" rel="noopener noreferrer"><MapPin size={18}/>{t('Get directions')}</a><Link className="btn btn-outline" to="/gallery">{t('Open gallery')}</Link></div><p className="caption">Illustrative orchard photography · Proposed botanical wordmark</p></div></section>
    <div className="wrap compact"><DemoNote/></div>
  </>;
}
const gallery=[['nursery','A shade nursery'],['mango-editorial','Mangoes on the branch'],['terrace','A terrace growing space'],['orchard','Fruit orchard rows'],['guava','A young guava sapling'],['hibiscus','Flowering hibiscus']];
export function Gallery() {
  const {t,settings}=useStore();
  const [photo,setPhoto]=useState<string|null>(null);
  return <><PageHead title={t('Nursery gallery')} summary="Illustrative photography of saplings, fruit and growing spaces."/>
    <section className="wrap section"><div className="gallery-grid">{gallery.map(([src,name])=><button type="button" onClick={()=>setPhoto(src)} key={src}><Photo src={img(src)} alt={'Illustrative '+name.toLowerCase()}/><span>{name}</span></button>)}</div>
    <div className="gallery-social"><div><h2>See Avadh Nursery’s updates</h2><p>Visit the nursery’s social channels for its own videos and photos.</p></div><SocialLinks/>{safeURL(settings.youtube)&&<a href={settings.youtube} className="btn btn-dark" target="_blank" rel="noopener noreferrer"><Play size={17}/>Watch the nursery location video</a>}</div>
    {photo&&<Modal title={gallery.find(([src])=>src===photo)?.[1]??'Gallery'} onClose={()=>setPhoto(null)}><Photo className="zoom-image" src={img(photo)} alt="Illustrative gardening photography"/><p className="caption">Illustrative image</p></Modal>}</section></>;
}
export function FaqPage() {
  const {t}=useStore();return <><PageHead title={t('FAQ')} summary="Answers about plant enquiries, delivery and bulk orders."/><section className="wrap section readable"><FaqList/><div className="button-row"><Link to="/contact" className="btn btn-dark">{t('Contact')}</Link></div></section></>;
}
const policies:Record<string,{title:string;paragraphs:[string,string][]}>={
  shipping:{title:'Shipping information',paragraphs:[['Delivery enquiries','The nursery can review enquiries from across India. Share your destination PIN, city and state along with the plants and quantities you’re interested in.'],['Confirmation','Ask the nursery to confirm serviceability, packaging, charges and an estimated dispatch window before placing any order.']]},
  returns:{title:'Returns & replacements',paragraphs:[['Before ordering','Ask the nursery about its current cancellation, replacement and return terms. Obtain the terms that apply to your confirmed order in writing.'],['If a plant arrives damaged','Contact the nursery with your order reference and clear photos of the plant and packaging so the team can review the issue.']]},
  privacy:{title:'Privacy policy',paragraphs:[['This demonstration','Your cart, wishlist, comparison and sample admin changes are stored in your browser. Contact and delivery fields are held on the open form.'],['WhatsApp enquiries','When you click Open WhatsApp, your draft and selected fields are passed to WhatsApp for you to review. Review the message before choosing to send it.'],['Your choices','You can clear this site’s browser data to remove local cart, wishlist and demo admin changes.']]},
  terms:{title:'Terms & conditions',paragraphs:[['Catalogue demonstration','Plant images, listed prices and stock descriptions are illustrative. Ask the nursery to confirm cultivar, current size, availability and final pricing.'],['Before buying','A WhatsApp enquiry starts a conversation with the nursery. Confirm payment, delivery and any customer service terms directly with the nursery.'],['Plant care','Care information is general guidance. Local growing conditions and the needs of a specific plant can vary.']]},
};
export function Policy({name}:{name:string}) {
  const {t}=useStore();
  const page=policies[name];
  return <><PageHead title={t(page.title)} eyebrow="DRAFT · PENDING OWNER APPROVAL"/><section className="wrap section readable policy">{page.paragraphs.map(([head,body])=><section key={head}><h2>{head}</h2><p>{body}</p></section>)}{name==='shipping'&&<DeliveryCheck/>}<Link className="text-link" to="/contact"><Leaf size={16}/>{t('Contact')}</Link></section></>;
}
