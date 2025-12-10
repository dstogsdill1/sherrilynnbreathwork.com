# Sherri Lynn Breathwork Website

A transformational breathwork services website built with Next.js and Contentful CMS.

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **CMS**: Contentful
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: Three.js / React Three Fiber
- **Auth**: NextAuth.js

## Getting Started

### 1. Clone and Install

```bash
git clone https://github.com/dstogsdill1/sherrilynnbreathwork.com.git
cd sherrilynnbreathwork.com
npm install
```

### 2. Environment Variables

Copy `env.local.example` to `.env.local` and fill in your Contentful credentials:

```bash
cp env.local.example .env.local
```

Required variables:
- `CONTENTFUL_SPACE_ID` - Your Contentful space ID
- `CONTENTFUL_ACCESS_TOKEN` - Delivery API token
- `CONTENTFUL_PREVIEW_ACCESS_TOKEN` - Preview API token
- `CONTENTFUL_MANAGEMENT_TOKEN` - For user-submitted content (testimonials)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Contentful Setup

Create these content types in your Contentful space:

| Content Type | Fields |
|-------------|--------|
| `hero` | title, subtitle, description, ctaText, ctaLink, image |
| `about` | title, quote, description1, description2, image |
| `service` | title, description, duration, price, features, order |
| `testimonial` | name, text, role, rating |
| `contact` | title, subtitle, address, phone, email, hours |
| `gallerySection` | title, description, images |
| `post` | title, slug, excerpt, body (Rich Text), publishedAt, mainImage |

## Deployment

Deploy to Vercel:

```bash
npm run build
vercel
```

Set environment variables in Vercel dashboard.

## License

ISC
