import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { mkdtemp, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const tmp = await mkdtemp(resolve(tmpdir(),'avadh-routes-'));
const origin = new URL(process.env.SITE_URL || (process.env.VERCEL_URL ? 'https://' + process.env.VERCEL_URL : 'http://localhost:4173')).origin;
const esc = text => text.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
try {
  execFileSync(process.execPath,['node_modules/typescript/bin/tsc','src/seo.ts','src/data.ts','--outDir',tmp,'--target','ES2022','--module','commonjs','--skipLibCheck'],{stdio:'inherit'});
  const { seedRoutes, pageMetadata } = (await import(pathToFileURL(resolve(tmp,'seo.js')).href)).default;
  const original=await readFile('dist/index.html','utf8');
  for(const route of seedRoutes){
    const {title,description,image}=pageMetadata(route);
    const url=origin+route;
    const schema=route==='/'
      ? {'@context':'https://schema.org','@type':'Store',name:'Avadh Nursery & Gardening',telephone:'+91 7518482140',url, address:{'@type':'PostalAddress',streetAddress:'WP8C+HF7, Mujasa, Malihabad',addressLocality:'Lucknow',addressRegion:'Uttar Pradesh',postalCode:'226102',addressCountry:'IN'},sameAs:['https://www.instagram.com/avadhnursery/']}
      : route.startsWith('/plants/')
        ? {'@context':'https://schema.org','@type':'Product',name:title.split(' | ')[0],description:description+' Illustrative demonstration listing.',image:origin+image,brand:{'@type':'Brand',name:'Avadh Nursery & Gardening'}}
        : undefined;
    const html=original.replace(/<title>.*?<\/title>/, '<title>'+esc(title)+'</title>')
      .replace(/(<meta name="description" content=")[^"]*/,(_,tag)=>tag+esc(description))
      .replace(/(<meta property="og:title" content=")[^"]*/,(_,tag)=>tag+esc(title))
      .replace(/(<meta property="og:description" content=")[^"]*/,(_,tag)=>tag+esc(description))
      .replace(/(<meta property="og:image" content=")[^"]*/,(_,tag)=>tag+esc(origin+image))
      .replace('</head>', '<link rel="canonical" href="'+esc(url)+'" />\n<meta property="og:url" content="'+esc(url)+'" />\n'+(schema?'<script type="application/ld+json">'+JSON.stringify(schema).replaceAll('<','\\u003c')+'</script>\n':'')+'</head>');
    const file=resolve('dist','.'+route,'index.html');
    await mkdir(dirname(file),{recursive:true});
    await writeFile(file,html);
  }
  await writeFile('dist/404.html',original);
  await writeFile('dist/_redirects','/* /index.html 200\n');
  const urls=seedRoutes.filter(r=>!['/admin','/cart','/checkout','/wishlist','/track'].some(p=>r===p||r.startsWith(p+'/')));
  await writeFile('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(r=>'<url><loc>'+esc(origin+r)+'</loc></url>').join('')+'</urlset>\n');
  console.log('Generated '+seedRoutes.length+' route entrypoints and sitemap.');
} finally {
  await rm(tmp,{recursive:true,force:true});
}
