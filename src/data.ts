export const spaces = ['Balcony', 'Terrace', 'Garden', 'Indoor space', 'Farm'] as const;
export const lights = ['Full sun', 'Partial sun', 'Bright indirect', 'Low light'] as const;
export const difficulties = ['Beginner', 'Intermediate', 'Experienced'] as const;
export const climates = ['Warm subtropical', 'Warm tropical', 'Hot and dry', 'Cool winters (shelter)'] as const;
export const types = ['Fruit', 'Flowering', 'Ornamental', 'Indoor'] as const;
export type Space = typeof spaces[number];
export type Light = typeof lights[number];
export type Difficulty = typeof difficulties[number];
export type Climate = typeof climates[number];
export type PlantType = typeof types[number];

export interface Category {
  id: string; name: string; hindi: string; image: string; description: string; space?: Space;
}
export interface Plant {
  id: string; slug: string; name: string; hindi: string; category: string; variety: string;
  botanical: string; images: string[]; price: number | null; summary: string; description: string;
  height: string; size: 'Small' | 'Medium' | 'Large'; propagation: string; light: Light;
  water: string; spaces: Space[]; climate: Climate[]; difficulty: Difficulty; fruiting: string;
  pot: boolean; stock: number; published: boolean; featured: boolean; type: PlantType;
}
export interface Article {
  id: string; title: string; category: string; summary: string; image: string; body: string[]; collection: string; source: string;
}
export interface FAQ { id: string; question: string; answer: string; }
export interface Enquiry { id: string; name: string; items: string; region: string; status: string; date: string; }
export interface Settings {
  brand: string; phone: string; instagram: string; facebook: string; youtube: string; address: string;
  announcement: string; hero: string; heroSubtitle: string; delivery: string; payments: string; mark: string; heroImage?: string;
}

export const img = (name: string) => '/images/' + name + '.webp';
export const settingsSeed: Settings = {
  brand: 'Avadh Nursery & Gardening', phone: '917518482140',
  instagram: 'https://www.instagram.com/avadhnursery/', facebook: '',
  youtube: 'https://www.youtube.com/watch?v=HQCn9mcT0_I',
  address: 'WP8C+HF7, Mujasa, Malihabad, Lucknow, Uttar Pradesh 226102, India',
  announcement: 'Plants from Malihabad | Delivery enquiries across India',
  hero: 'From Malihabad, ready to grow.', heroSubtitle: 'Explore fruit saplings and garden plants for your terrace, garden or orchard.',
  delivery: 'Send your PIN code to our nursery team for delivery confirmation.', payments: 'WhatsApp-assisted enquiry', mark: 'Avadh Nursery',
};
export const categoriesSeed: Category[] = [
  {id:'mango',name:'Mango Plants',hindi:'आम के पौधे',image:img('mango-editorial'),description:'Explore mango cultivars for sunny gardens, terraces and orchards.'},
  {id:'guava',name:'Guava Plants',hindi:'अमरूद के पौधे',image:img('guava'),description:'Compare white- and pink-fleshed guava varieties and their growing needs.'},
  {id:'citrus',name:'Citrus Plants',hindi:'खट्टे फल के पौधे',image:img('lemon'),description:'Find lemons, sweet lime, oranges and kinnow for sunny spaces.'},
  {id:'exotic',name:'Exotic Fruit Plants',hindi:'विशेष फल के पौधे',image:img('dragon'),description:'Explore dragon fruit, fig, avocado and other fruit plants.'},
  {id:'indoor',name:'Indoor Plants',hindi:'घर के अंदर के पौधे',image:img('snake'),description:'Find foliage plants for windowsills and bright rooms.'},
  {id:'outdoor',name:'Outdoor & Ornamental',hindi:'बाहरी और सजावटी पौधे',image:img('hibiscus'),description:'Bring colour and texture to gardens and sunny outdoor spaces.'},
  {id:'commercial',name:'Commercial & Orchard',hindi:'बाग और व्यावसायिक पौधे',image:img('orchard'),description:'Browse varieties for orchard planning, resale and larger orders.',space:'Farm'},
  {id:'terrace',name:'Balcony & Terrace',hindi:'बालकनी और छत के पौधे',image:img('terrace'),description:'Discover container-friendly plants for balconies and terraces.',space:'Terrace'},
  {id:'fruit',name:'All Fruit Plants',hindi:'सभी फलदार पौधे',image:img('mango-editorial'),description:'Discover mango, guava, citrus and other fruiting plants.'},
];

type Seed = [string,string,string,string,string,number|null,boolean,string];
const catalogue: Seed[] = [
  ['amrapali-mango','Amrapali Mango','आम आम्रपाली','mango','mango-copper',449,true,'A compact-growing mango worth considering for a sunny terrace with a large container.'],
  ['thai-guava','Thai Guava','थाई अमरूद','guava','guava',399,true,'A guava selection to discuss with the nursery if you have a sunny garden or a generous container.'],
  ['lemon','Lemon','नींबू','citrus','lemon',279,true,'A familiar citrus for sunny courtyards and terraces with freely draining soil.'],
  ['dragon-fruit','Dragon Fruit','ड्रैगन फल','exotic','dragon',349,true,'A climbing cactus that needs a sturdy support and a bright, warm spot.'],
  ['dasheri-mango','Dasheri Mango','दशहरी आम','mango','mango',399,false,'A smooth-fleshed mango cultivar with strong associations with Malihabad.'],
  ['langra-mango','Langra Mango','लंगड़ा आम','mango','mango-copper',459,false,'A green-skinned mango cultivar best explored for sunny, spacious growing sites.'],
  ['chausa-mango','Chausa Mango','चौसा आम','mango','mango',449,false,'A classic fragrant mango for growers who can give it room to develop.'],
  ['alphonso-mango','Alphonso Mango','अल्फांसो आम','mango','mango-copper',549,false,'An aromatic mango cultivar. Ask the nursery about local suitability before planting.'],
  ['mallika-mango','Mallika Mango','मल्लिका आम','mango','mango',529,true,'A mango hybrid to consider where there is room for a carefully managed container tree.'],
  ['kesar-mango','Kesar Mango','केसर आम','mango','mango-copper',499,false,'A cultivar associated with saffron-coloured pulp and warm growing regions.'],
  ['pusa-arunima-mango','Pusa Arunima Mango','पूसा अरुणिमा आम','mango','mango',599,false,'A mango selection with a distinctive blush on mature fruit.'],
  ['allahabad-safeda','Allahabad Safeda Guava','इलाहाबाद सफेदा अमरूद','guava','guava-dark',329,true,'A traditional white-fleshed guava for sunny growing spaces.'],
  ['lucknow-49','Lucknow 49 Guava','लखनऊ 49 अमरूद','guava','guava',349,true,'Also called Sardar. A guava to consider for open, sunny growing sites.'],
  ['lalit-guava','Lalit Guava','ललित अमरूद','guava','guava-dark',389,true,'A pink-fleshed guava selection for gardeners comparing fruit varieties.'],
  ['pink-guava','Pink Guava','गुलाबी अमरूद','guava','guava',419,true,'A pink-fleshed guava listing. Confirm the named cultivar with the nursery.'],
  ['sweet-lime','Sweet Lime','मौसंबी','citrus','lemon',389,true,'Also called mosambi. Ask about rootstock and frost protection for your area.'],
  ['orange','Sweet Orange','संतरा','citrus','orange',449,true,'A citrus option for well-lit, ventilated sites with sensible frost protection.'],
  ['kinnow','Kinnow Mandarin','किन्नू','citrus','orange',429,true,'A mandarin hybrid to consider for warm, sunny spaces.'],
  ['fig','Fig','अंजीर','exotic','fig',389,true,'A lobed-leaf fruit plant that can work in a suitably sized container.'],
  ['avocado','Avocado','एवोकाडो','exotic','avocado',699,false,'An orchard or garden option for sheltered locations with excellent drainage.'],
  ['jamun','Jamun','जामुन','exotic','jamun',359,false,'A tree for a site with space for a substantial mature canopy.'],
  ['pomegranate','Pomegranate','अनार','exotic','pomegranate',389,true,'A sun-loving fruiting shrub to consider for dry, open spaces.'],
  ['lychee','Lychee','लीची','exotic','lychee',579,false,'A fruit tree for a sheltered garden with room and consistent moisture.'],
  ['mulberry','Mulberry','शहतूत','exotic','mulberry',329,true,'A vigorous fruiting plant. Ask about the cultivar and pruning before choosing a pot.'],
  ['jackfruit','Jackfruit','कटहल','exotic','jackfruit',499,false,'A large tropical fruit tree most suited to a spacious home garden or farm.'],
  ['chikoo','Chikoo','चीकू','exotic','chikoo',469,false,'Also called sapota. Choose a sheltered warm site with space for the canopy.'],
  ['snake-plant','Snake Plant','स्नेक प्लांट','indoor','snake',299,true,'Upright, architectural foliage for a bright room and a pot with good drainage.'],
  ['areca-palm','Areca Palm','एरेका पाम','indoor','areca',429,true,'Feathery foliage for a bright room with filtered light.'],
  ['money-plant','Money Plant','मनी प्लांट','indoor','money',219,true,'A trailing vine suited to a shelf, hook or small climbing support.'],
  ['peace-lily','Peace Lily','पीस लिली','indoor','peace',369,true,'Glossy foliage for a bright spot with filtered light and consistent moisture.'],
  ['hibiscus','Hibiscus','गुड़हल','outdoor','hibiscus',289,true,'A flowering shrub for a sunny balcony or the edge of a garden.'],
  ['jasmine','Arabian Jasmine','मोगरा','outdoor','jasmine',299,true,'A fragrant flowering shrub for a bright outdoor position.'],
  ['orchard-mango','Orchard Mango Selection','बाग के लिए आम','mango','mango',null,false,'Ask for a nursery-recommended mix of cultivars for your orchard site and goals.'],
];
const botanicalByGroup: Record<string,string> = {mango:'Mangifera indica',guava:'Psidium guajava'};
const botanicalByImage: Record<string,string> = {dragon:'Selenicereus undatus',fig:'Ficus carica',avocado:'Persea americana',jamun:'Syzygium cumini',pomegranate:'Punica granatum',lychee:'Litchi chinensis',mulberry:'Morus spp.',jackfruit:'Artocarpus heterophyllus',chikoo:'Manilkara zapota',snake:'Dracaena trifasciata',areca:'Dypsis lutescens',money:'Epipremnum aureum',peace:'Spathiphyllum spp.',hibiscus:'Hibiscus rosa-sinensis',jasmine:'Jasminum sambac'};
const bySlug: Record<string,string> = {lemon:'Citrus × limon','sweet-lime':'Citrus limetta',orange:'Citrus × sinensis',kinnow:'Citrus reticulata hybrid'};
export const plantsSeed: Plant[] = catalogue.map(([slug,name,hindi,category,image,price,pot,summary],idx) => {
  const indoor = category === 'indoor';
  const flowering = category === 'outdoor';
  const generousPot = ['mango','guava','citrus'].includes(category);
  const light = indoor ? (['snake','money'].includes(image) ? 'Low light' : 'Bright indirect') : image === 'jasmine' ? 'Partial sun' : 'Full sun';
  return {
    id: 'AV-' + String(idx+1).padStart(3,'0'), slug, name, hindi, category, variety: name.replace(/ Mango$| Guava$/,''),
    botanical: botanicalByGroup[category] || bySlug[slug] || botanicalByImage[image] || '',
    images: [img(image), ...(image.startsWith('mango') ? [img(image==='mango'?'mango-copper':'mango'),img('mango-editorial')] : image.startsWith('guava') ? [img(image==='guava'?'guava-dark':'guava')] : [])],
    price, summary, description: summary + (pot ? ' Choose a container with drainage holes and allow room for root growth.' : ' Plan for its mature size before choosing a permanent position.'),
    height: indoor ? '20–45 cm' : flowering || image === 'dragon' ? '25–45 cm' : pot ? '45–75 cm' : '60–90 cm', size: indoor || flowering || image === 'dragon' ? 'Small' : pot ? 'Medium' : 'Large',
    propagation: category === 'mango' || category === 'citrus' || image === 'avocado' ? 'Grafted (sample)' : ['guava','lychee'].includes(category) || image === 'lychee' ? 'Air-layered (sample)' : ['dragon','fig','money','jasmine','hibiscus','pomegranate','mulberry'].includes(image) ? 'Cutting (sample)' : indoor ? 'Division (sample)' : 'Confirm with nursery',
    light, water: ['dragon','snake'].includes(image) ? 'Allow mix to dry well' : ['peace','lychee','areca'].includes(image) ? 'Even moisture, free drainage' : 'Water when the surface dries',
    spaces: indoor ? ['Indoor space'] : !pot ? ['Garden','Farm'] : generousPot ? ['Terrace','Garden','Farm',...(category==='mango'?[]:['Balcony' as const])] : ['Balcony','Terrace','Garden',...(!flowering?['Farm' as const]:[])],
    climate: indoor ? [...climates] : ['Warm subtropical','Warm tropical',...(['pomegranate','dragon','fig','lemon','hibiscus','jasmine'].includes(image)?['Hot and dry' as const]:[]),...(['fig','lemon','mulberry'].includes(image)?['Cool winters (shelter)' as const]:[])],
    difficulty: indoor || flowering || ['lemon','dragon','fig','mulberry'].includes(image) ? 'Beginner' : !pot && ['avocado','lychee','jackfruit'].includes(image) ? 'Experienced' : 'Intermediate',
    fruiting: indoor || flowering ? 'Foliage or flowers' : 'Season and maturity vary with cultivar and growing conditions.',
    pot, stock: price===null || idx===22 ? 0 : idx%7===5 ? 3 : 5 + idx%11, published:true, featured:idx<4, type:indoor?'Indoor':flowering?'Flowering':'Fruit'
  };
});
const mangoSource = 'https://edis.ifas.ufl.edu/publication/MG216';
const containerSource = 'https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/houseplants/spring-houseplant-care';
const waterSource = 'https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/fertilizing-and-watering-container-plants';
export const articlesSeed: Article[] = [
  {id:'growing-mango-in-pots',title:'How to grow a mango plant in a pot',category:'Fruit plants',summary:'Choose a compact variety and give it the sun, drainage and room it needs.',image:img('mango-editorial'),collection:'mango',source:mangoSource,body:['Start with the space. Mango trees grow best in full sun. Choose a sheltered terrace or courtyard with room for a plant and its mature canopy. Ask the nursery which grafted cultivars stay manageable in containers.','Use a sturdy pot with drainage holes and a mix that drains freely. Move up in size as roots fill the pot. Avoid burying the graft junction. Water well when needed, then let excess water drain away.','Plan for local conditions. Discuss cold protection, pruning and container size with the nursery before buying. Flowering and fruiting depend on cultivar, plant maturity and management.']},
  {id:'fruit-plants-for-terraces',title:'Choosing fruit plants for a terrace garden',category:'Small spaces',summary:'Match your containers to sunlight, wind and the plant’s mature size.',image:img('terrace'),collection:'terrace',source:waterSource,body:['Observe your terrace through a full day. Note direct sun and strong winds. A sunny terrace with secure pots can suit some citrus, fig and guava selections.','Check roof loading, water drainage and access before installing heavy containers. Start with a few manageable pots you can water comfortably.','Use a mix designed for containers and group pots that have similar watering needs. Ask the nursery how large the variety can become.']},
  {id:'newly-delivered-plants',title:'Caring for a newly delivered plant',category:'Plant care',summary:'Help a new plant settle in with a simple first-week routine.',image:img('nursery'),collection:'fruit',source:containerSource,body:['Unpack carefully and inspect stems, leaves and the root ball. Take clear photos of any damage and ask the nursery for guidance.','Check the root ball before watering. Allow excess water to drain and keep the new plant in a sheltered place suited to its light needs.','Give the plant time to adjust before changing pots or increasing sun exposure. Follow the nursery’s specific instructions for your plant.']},
  {id:'grafted-or-seed-grown',title:'Grafted and seed-grown plants, explained',category:'Fruit plants',summary:'Understand what propagation means before choosing an orchard tree.',image:img('mango-copper'),collection:'commercial',source:mangoSource,body:['Grafting joins a selected cultivar to a compatible rootstock. For many mango cultivars it is a way to preserve the fruit traits of the named variety.','Seedlings can vary in growth and fruit traits. Ask the nursery which propagation method and rootstock the selected plant uses.','Use the site and the intended planting density to guide orchard choices. Ask a local horticulture adviser when planning at commercial scale.']},
  {id:'watering-containers',title:'Common watering mistakes in containers',category:'Plant care',summary:'Read the soil and weather before you reach for the watering can.',image:img('lemon'),collection:'terrace',source:waterSource,body:['Check the potting mix rather than watering on a fixed schedule. Sun, wind, plant size and pot material all affect how quickly a pot dries.','When the plant needs water, soak the mix evenly and allow it to drain. Empty saucers after watering.','Adjust as the weather changes. If a plant consistently wilts in moist soil, check drainage and ask the nursery before adding more water.']},
  {id:'seasonal-fruit-care',title:'A seasonal routine for fruit plants',category:'Plant care',summary:'Make small adjustments as heat, rainfall and day length change.',image:img('orchard'),collection:'fruit',source:waterSource,body:['During hot spells, check containers more often and shelter young plants from drying winds when necessary.','In rainy weather, keep drainage holes clear and watch for saturated pots. Reduce supplemental watering when the mix stays wet.','Ask the nursery about local cold, pruning and feeding needs. Your climate and the species are better guides than a fixed national calendar.']},
  {id:'guava-care',title:'The basics of growing guava at home',category:'Fruit plants',summary:'Find a bright space and plan around the size of your variety.',image:img('guava'),collection:'guava',source:'https://edis.ifas.ufl.edu/publication/MG045',body:['Guava generally grows well in full sun and freely draining ground. Leave enough room for the canopy and avoid spots where water collects.','If you are considering a container, ask the nursery about cultivar growth and long-term pot size. Check the mix before each watering.','Ask for local advice on fruit fly, pruning and winter protection if relevant in your area.']},
];
export const faqSeed: FAQ[] = [
  {id:'ordering',question:'How do I place a plant enquiry?',answer:'Add plants to your cart, fill in your delivery location and prepare your WhatsApp enquiry. The nursery can confirm stock, final pricing and next steps.'},
  {id:'delivery',question:'Can you deliver to my PIN code?',answer:'Send your six-digit PIN code, city and state to the nursery team. Serviceability and charges depend on the destination and plant selection.'},
  {id:'varieties',question:'Can I ask about a specific variety or graft?',answer:'Yes. Include the plant name and your preferred size or propagation method in your enquiry. The nursery can confirm which varieties and sizes are available.'},
  {id:'pots',question:'Which fruit plants can grow in pots?',answer:'Start with the Balcony & Terrace collection or use Plant Finder. Ask the nursery about cultivar, mature size and container needs for your growing space.'},
  {id:'bulk',question:'Can I enquire about bulk quantities?',answer:'Use the Wholesale enquiry form to share your varieties, quantities, delivery location and target planting period.'},
];
export const ordersSeed: Enquiry[] = [
  {id:'AV-DEMO-1001',name:'Sample gardener',items:'2 × Amrapali Mango, 1 × Thai Guava',region:'Lucknow, Uttar Pradesh',status:'Under review',date:'2026-11-20'},
  {id:'AV-DEMO-1002',name:'Sample terrace grower',items:'3 × Lemon',region:'Delhi',status:'Awaiting quote',date:'2026-11-21'},
  {id:'AV-DEMO-1003',name:'Sample home buyer',items:'1 × Money Plant',region:'Jaipur, Rajasthan',status:'Enquiry received',date:'2026-11-22'},
];
export const bulkSeed: Enquiry[] = [
  {id:'AV-BULK-201',name:'Sample orchard project',items:'120 grafted mango plants',region:'Barabanki, Uttar Pradesh',status:'Under review',date:'2026-11-20'},
  {id:'AV-BULK-202',name:'Sample landscape project',items:'50 mixed flowering plants',region:'Kanpur, Uttar Pradesh',status:'Awaiting quote',date:'2026-11-22'},
];
export const statuses = ['Enquiry received','Under review','Awaiting quote','Quote prepared','Closed'];
export const states = ['Andaman and Nicobar Islands','Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chandigarh','Chhattisgarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Goa','Gujarat','Haryana','Himachal Pradesh','Jammu and Kashmir','Jharkhand','Karnataka','Kerala','Ladakh','Lakshadweep','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Puducherry','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal'];

// A collection may contain directly assigned listings and plants that match a built-in rule.
export function inCollection(plant:Plant,id:string,space?:string) {
  if(plant.category===id)return true;
  if(id==='fruit')return plant.type==='Fruit';
  if(id==='commercial')return plant.type==='Fruit'&&plant.spaces.includes('Farm');
  if(id==='terrace')return plant.pot&&(plant.spaces.includes('Terrace')||plant.spaces.includes('Balcony'));
  return Boolean(space&&plant.spaces.some(candidate=>candidate===space));
}
