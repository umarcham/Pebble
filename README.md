# Pebble Store

A small, responsive children's clothing storefront built with Next.js, React, TypeScript, Tailwind CSS, and Lenis.

## Requirements

- Node.js 18.17 or later
- npm

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the store.

## Available scripts

```bash
npm run dev    # Start the development server
npm run build  # Create a production build
npm start      # Serve the production build
```

Run `npm run build` before deploying to check that the project builds successfully.

## Customizing the store

- Edit product names, prices, sizes, colours, descriptions, and store name in [`data/products.ts`](./data/products.ts).
- Product images are in [`public/products`](./public/products). Keep the existing `<product-slug>-<colour>.webp` filenames, or update the image paths in `data/products.ts` when using different names.

## Deployment

This app can be deployed to any platform that supports Next.js. For Vercel, import the GitHub repository and use the default Next.js build settings.

Before publishing, make sure you have permission to share all included images and other assets.
