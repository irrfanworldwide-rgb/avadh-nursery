import { articlesSeed, categoriesSeed, plantsSeed, settingsSeed, type Article, type Category, type Plant } from './data';

const descriptions:Record<string,[string,string]> = {
  '/':['Plants from Malihabad','Explore fruit plants, ornamental plants and gardening guidance from Avadh Nursery in Malihabad.'],
  '/shop':['Shop fruit and garden plants','Browse an illustrative nursery catalogue of mango, guava, citrus, terrace and indoor plants.'],
  '/plant-finder':['Plant Finder','Find plants for your growing space, sunlight and budget.'],
  '/compare':['Compare plant varieties','Compare the price, climate, pot suitability and care of up to three plants.'],
  '/wishlist':['Wishlist','Save plants you want to explore or enquire about.'],
  '/cart':['Shopping cart','Review plant selections and quantities for a quote enquiry.'],
  '/checkout':['Order enquiry','Prepare a plant order enquiry for Avadh Nursery on WhatsApp.'],
  '/wholesale':['Wholesale and orchard plants','Request a bulk plant quote for orchard planting, resale or landscaping.'],
  '/guide':['Gardening Knowledge Centre','Read practical plant care guides and gardening advice for home and terrace growers.'],
  '/about':['About Avadh Nursery Malihabad','Learn about Avadh Nursery and its location in Mujasa, Malihabad, Lucknow.'],
  '/gallery':['Nursery gallery','Explore illustrative nursery photography and the official nursery social links.'],
  '/faq':['Frequently asked questions','Find answers about varieties, delivery, order enquiries and bulk purchases.'],
  '/contact':['Contact Avadh Nursery','Find Avadh Nursery in Malihabad or contact the team about plant availability.'],
  '/track':['Sample enquiry tracking','View statuses for local demonstration enquiry records.'],
  '/shipping':['Draft shipping information','Find out how to enquire about plant delivery to your PIN code.'],
  '/returns':['Draft returns and replacements','Read the draft contact guidance for plant returns and replacements.'],
  '/privacy':['Draft privacy policy','Learn how this demonstration handles browser data and enquiry details.'],
  '/terms':['Draft terms and conditions','Read the draft terms for this demonstration catalogue.'],
};
export const defaultImage='/images/hero.webp';
export function pageMetadata(path:string,plants:Plant[]=plantsSeed,categories:Category[]=categoriesSeed,articles:Article[]=articlesSeed,brand=settingsSeed.brand) {
  const [section,id]=path.split('/').filter(Boolean);
  const plant=section==='plants'?plants.find(p=>p.slug===id&&p.published):undefined;
  const category=section==='collections'?categories.find(c=>c.id===id):undefined;
  const article=section==='guide'&&id?articles.find(a=>a.id===id):undefined;
  const [title,description]=descriptions[path]??(section==='admin'?['Demo administration','Browser-local catalogue and sample enquiry management.']:['Page unavailable','Explore the Avadh Nursery demo storefront.']);
  return {title:(plant?.name??category?.name??article?.title??title)+' | '+brand, description:plant?.summary??category?.description??article?.summary??description,image:plant?.images[0]??category?.image??article?.image??defaultImage};
}
export const seedRoutes=[...Object.keys(descriptions),...categoriesSeed.map(c=>'/collections/'+c.id),...plantsSeed.map(p=>'/plants/'+p.slug),...articlesSeed.map(a=>'/guide/'+a.id),...['','/products','/categories','/enquiries','/bulk','/content','/settings'].map(p=>'/admin'+p)];
