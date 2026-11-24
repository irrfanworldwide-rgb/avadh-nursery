# Avadh Nursery & Gardening

A private, noindex commerce demonstration for the Avadh Nursery team in Mujasa, Malihabad. It includes a multi-page storefront and a separate browser-local owner dashboard.

## Run locally

Requirements are Node.js 20.19+ or 22.12+ and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Open `/admin` for the demo dashboard. No account, secret or environment file is required.

## Build and host

```sh
npm run build
npm run preview
```

Deploy the contents of `dist/` to a static hosting provider. For your own preview host, set the optional `SITE_URL` environment variable to its HTTPS origin when running the build. Configure a single-page-app fallback to `/index.html` for browser-local listings added in demo admin. The build generates static HTML entrypoints for all seeded routes, an XML sitemap, canonical URLs and social metadata. Demo pages carry a noindex/nofollow directive and the preview robots rules disallow crawling. Keep these restrictions until launch approval. Use the host's private-access setting for a client preview. The source archive also includes a prebuilt copy of the demo.

## Suggested owner walkthrough

1. Open the storefront and shop for mango plants. Try searching for `aam` or `आम`.
2. Compare Amrapali and Mallika. Check their space, care and sample pricing.
3. Try Plant Finder with Terrace, Fruit, Full sun, Beginner, ₹450 and Warm subtropical.
4. Add a plant to the cart and prepare checkout with example details. Stop at the message preview unless you intend to contact the real nursery.
5. Visit `/wholesale` for a sample orchard quote request.
6. Sign-in-free demo admin is at `/admin`. Edit a product there and use View storefront in the same browser. To demo product variants as independently priced options, add a separate listing per cultivar or size.
7. Visit `/track` and use `AV-DEMO-1001` to see a local enquiry record.

## Demo capabilities and production integrations

| Implemented in the demo | Production upgrade |
| --- | --- |
| 33 sample plant listings, nine collection views, illustrative photography, proposed wordmark | Owner-approved catalogue, prices, real stock, and photos with usage permission |
| Search in English, Hindi and common transliterations, filters, sorting, comparison, and a six-step rule-based Plant Finder | Tune attributes to local varieties and nursery advice |
| Core English and Hindi navigation, shopping actions and form labels | Approve translations and localize editorial articles, detailed plant copy and policies |
| Persistent browser-local wishlist, comparison, cart and saved items | Optional customer accounts and server-backed cart sync |
| Guest checkout, wholesale and contact forms that prepare WhatsApp drafts | A secure enquiry service, verified notifications and status history if wanted |
| PIN validation and delivery enquiry | Courier serviceability, packaging and rate rules, and authenticated tracking |
| Demo admin, product/category editing, image uploads, content editing, and sample enquiry CSV | Protected admin authentication, database, role-based access, backups, media storage and audit logs |
| Browser-local aggregate click counters and an illustrative admin chart | Consent-aware reporting that distinguishes enquiry clicks from confirmed sales |
| Draft policy pages | Owner-approved policies, privacy copy and payment configuration |

The demo does not capture real orders, payments or shipment records. A click on the Open WhatsApp link passes the draft to WhatsApp. Only the visitor decides whether to send it. Form contact details are held in memory. Demo records and settings persist in the active browser. Hosted access and browser-local admin data serve different purposes. Do not enter real customer records in demo admin.

## Owner material for launch

- Official high-resolution logo, approved business name, nursery description, address and map pin.
- Confirmed business WhatsApp number, contact hours, official Facebook URL and any other social channels.
- Inventory by cultivar, retail and wholesale pricing, available sizes and stocks, propagation, and plant-specific care guidance.
- Nursery, sapling and variety images with permission for website use. The demo photographs are generated illustrations, including orchard views and product examples.
- PIN coverage, packaging, fulfilment periods, delivery charges, bulk minimums and quote rules.
- Approved return, replacement, cancellation, privacy and terms copy.
- Any approved payment methods, domain, analytics consent settings and staff access responsibilities.

## Production roadmap

1. Confirm business details and replace the sample catalogue and images with approved material.
2. Move browser-local products, stock, media and enquiries to a database. Add server validation and role-based staff access with audit logging.
3. Confirm shipping and payments with the owner, then integrate the provider APIs and verify webhook signatures.
4. Verify accessibility, mobile performance, real enquiry routing, shipping outcomes and any purchase flows in staging.
5. Add the approved domain, canonical URLs and opt-in analytics. Remove noindex only after owner sign-off.

## Storefront and admin refresh

The homepage uses two WebP photo layers for pointer-reactive CSS perspective on desktop and scroll-linked depth on supported mobile browsers. Users with reduced motion enabled see the static composition. The images are illustrative. The mobile catalogue shows removable applied filters, the product page has one purchase bar, and the dashboard menu opens as a drawer.

Design references include [Baymard’s applied filter research](https://baymard.com/research-articles/how-to-design-applied-filters) and the [web.dev animation performance guide](https://web.dev/articles/animations-guide).

## Source layout

- `src/data.ts` contains sample products, growing attributes, guides and enquiries.
- `src/state.tsx` owns navigation and local storefront/admin state.
- `src/Catalog.tsx`, `src/Commerce.tsx` and `src/Admin.tsx` implement discovery, ordering and management.
- `src/i18n.ts` contains English-to-Hindi interface strings.
- `src/seo.ts` and `scripts/static-routes.mjs` generate demo metadata and route entrypoints.
- `public/images/` contains bundled WebP illustrations. The Knowledge Centre articles link to horticultural reading from UF/IFAS and University of Minnesota Extension.
