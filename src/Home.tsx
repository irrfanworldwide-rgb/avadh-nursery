import { ArrowDownRight, Boxes, ChevronRight, Leaf, MapPin, MessageCircle, ScanLine, Sprout, Truck } from 'lucide-react';
import { img } from './data';
import { DemoNote, FaqList, Heading, Link, Photo, ProductGrid, SocialLinks } from './ui';
import { safeImage, useStore } from './state';
import { ArticleCards } from './Info';
import { usePerspective } from './motion';
const benefits=[
  [MapPin,'Based in Malihabad','Mujasa, Lucknow','/about'],
  [Truck,'Delivery enquiries','Ask about delivery to your PIN','/shipping'],
  [MessageCircle,'Talk to the nursery','Get help choosing a variety','/contact'],
] as const;
export function Home() {
  const {t,lang,settings,categories,visible,articles}=useStore();
  const scene=usePerspective<HTMLDivElement>(10);
  const standardHero=['Bring Nature Closer to Home.','From Malihabad, ready to grow.'].includes(settings.hero);
  const standardSubtitle=['Discover fruit plants, unique varieties and greenery from Avadh Nursery, Malihabad.','Explore fruit saplings and garden plants for your terrace, garden or orchard.'].includes(settings.heroSubtitle);
  const growing=[['Balcony','terrace'],['Terrace','finder-terrace'],['Garden','nursery'],['Farm','orchard'],['Indoor space','areca']];
  const homeCats=categories.filter(c=>c.id!=='fruit');
  return <>
    <section className="nursery-hero">
      <div className="wrap nursery-hero-grid">
        <div className="nursery-hero-copy">
          <div className="eyebrow"><MapPin size={16} strokeWidth={1.55}/>{t('Malihabad, Lucknow')}</div>
          <h1>{standardHero&&lang==='en'?<>From Malihabad,<br/><em>ready to grow.</em></>:t(standardHero?'From Malihabad, ready to grow.':settings.hero)}</h1>
          <p>{t(standardSubtitle?'Explore fruit saplings and garden plants for your terrace, garden or orchard.':settings.heroSubtitle)}</p>
          <div className="nursery-hero-actions"><Link className="btn btn-dark" to="/shop">{t('Explore Plants')}<ChevronRight size={17}/></Link><Link className="btn btn-outline" to="/plant-finder"><Sprout size={18}/>{t('Plant Finder')}</Link></div>
        </div>
        <div className="orchard-frame" ref={scene}>
          <div className="orchard-scene">
            <picture className="orchard-back">
              {!settings.heroImage&&<source media="(max-width: 700px)" srcSet={img('orchard-depth-mobile')}/>}
              <img src={settings.heroImage?safeImage(settings.heroImage):img('orchard-depth')} alt={settings.heroImage?'Homepage banner image':'Illustrative mango orchard in dappled sunlight'} fetchPriority="high" width={944} height={1180}/>
            </picture>
            {!settings.heroImage&&<><span className="orchard-shade"/><picture className="orchard-branch"><source media="(max-width: 700px)" srcSet={img('mango-branch-mobile')}/><img src={img('mango-branch')} width={706} height={1060} alt="" /></picture></>}
            {!settings.heroImage&&<div className="orchard-overlay">
              <Link to="/collections/mango" className="orchard-caption"><strong>{t('Browse mango varieties')}</strong><ChevronRight size={20}/></Link>
              <small>{t('Illustrative photography')}</small>
            </div>}
          </div>
        </div>
      </div>
    </section>
    <section className="nursery-benefits" aria-label="Nursery services"><div className="wrap nursery-benefits-grid">{benefits.map(([Icon,title,desc,to])=><Link key={title} to={to}><Icon size={22} strokeWidth={1.6}/><span><strong>{t(title)}</strong><small>{t(desc)}</small></span></Link>)}</div></section>
    <section className="section wrap" id="collections">
      <Heading title={t('Shop by Category')} action={<Link className="text-link" to="/shop">{t('Shop all plants')}</Link>}/>
      <div className="collection-grid">{homeCats.map(c=><Link to={'/collections/'+c.id} className={'category-tile category-'+c.id} key={c.id}>
        <Photo src={c.image} alt="" /><span>{lang==='hi'?c.hindi:c.name}<ArrowDownRight size={17}/></span></Link>)}</div>
    </section>
    <section className="section tint"><div className="wrap">
      <Heading title={t('Featured Plants')} action={<Link className="text-link" to="/shop">{t('View all plants')}</Link>}/>
      <ProductGrid plants={visible.filter(p=>p.featured).slice(0,8)}/><DemoNote/>
    </div></section>
    <section className="story-block"><Photo src={img('mango-editorial')} alt="Illustrative close-up of mangoes on a tree"/><div className="story-copy"><span className="eyebrow"><MapPin size={13}/> MALIHABAD MANGO COLLECTION</span><h2>The mangoes of<br/><em>Malihabad.</em></h2><p>Compare Dasheri, Amrapali and Langra by sunlight, space and container suitability.</p><Link className="btn btn-gold" to="/collections/mango">Discover Mango Varieties</Link></div></section>
    <section className="section wrap discovery"><div className="discover-copy"><span className="eyebrow"><ScanLine size={16}/> {t('Plant Finder')}</span><h2>Find plants for<br/>your space.</h2><p>Answer six questions about your growing space, light and budget. We’ll suggest plants you can compare or discuss with the nursery.</p><Link className="btn btn-dark" to="/plant-finder">{t('Find Your Perfect Plant')}</Link></div>
    <div className="finder-mosaic"><Photo src={img('finder-terrace')} alt="Illustrative terrace garden"/><Photo src={img('money')} alt="Illustrative potted money plant"/><div><Sprout size={29} strokeWidth={1.4}/><Link className="text-link" to="/compare">{t('Compare Plants')}</Link><small>Find the differences in light, space and care.</small></div></div></section>
    <section className="section tint"><div className="wrap"><Heading title="Shop by growing space"/><div className="space-grid">{growing.map(([space,image])=><Link key={space} to={'/shop?space='+encodeURIComponent(space)}><Photo src={img(image)} alt=""/><span>{t(space)}</span></Link>)}</div></div></section>
    <section className="section wrap nursery-story"><Photo src={img('nursery')} alt="Illustrative rows of plants in a shade nursery"/><div><h2>Visit us in<br/>Malihabad.</h2><p>Find Avadh Nursery &amp; Gardening in Mujasa, near Malihabad, Lucknow. Explore the catalogue before visiting, or share your shortlist to ask about current varieties.</p><Link className="btn btn-outline" to="/about">{t('About')} Avadh Nursery</Link><p className="caption">Illustrative nursery photography</p></div></section>
    <section className="section tint"><div className="wrap"><Heading title={t('Gardening Knowledge Centre')} action={<Link to="/guide" className="text-link">{t('Gardening Guide')}<ArrowDownRight size={16}/></Link>}/><ArticleCards articles={articles.slice(0,3)}/></div></section>
    <section className="section wrap"><div className="wholesale-banner"><Photo src={img('orchard')} alt=""/><div><span className="eyebrow"><Boxes size={16}/> COMMERCIAL & ORCHARD ORDERS</span><h2>Planning to grow at scale?</h2><p>Share your varieties, quantities and planting window for a quote enquiry.</p><Link className="btn btn-gold" to="/wholesale">{t('Request bulk quote')}</Link></div></div></section>
    <section className="section wrap home-gallery"><Heading title={t('Nursery gallery')} action={<Link className="text-link" to="/gallery">{t('Open gallery')}<ArrowDownRight size={16}/></Link>}>See the nursery’s social channels and browse illustrative growing spaces.</Heading><div className="home-gallery-grid">{['nursery','mango-editorial','terrace','orchard'].map(x=><Link key={x} to="/gallery"><Photo src={img(x)} alt={'Illustrative '+x.replace('-editorial','')+' photography'}/></Link>)}</div><SocialLinks/></section>
    <section className="section tint"><div className="wrap home-faq"><Heading title="Frequently asked questions" action={<Link to="/faq" className="text-link">{t('FAQ')}<ArrowDownRight size={16}/></Link>}/><FaqList limit={5}/></div></section>
  </>;
}
