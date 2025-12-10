import { createClient, Entry, Asset } from 'contentful';

// Initialize Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// Preview client for draft content
const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN || '',
  host: 'preview.contentful.com',
});

function getClient(preview = false) {
  return preview ? previewClient : client;
}

// Helper to extract image URL from Contentful Asset
export function getAssetUrl(asset: Asset | any | undefined): string {
  if (!asset?.fields?.file?.url) return '';
  // Contentful URLs start with // so we add https:
  const url = asset.fields.file.url as string;
  return url.startsWith('//') ? `https:${url}` : url;
}

// ==========================================
// Content Type Interfaces
// ==========================================

export interface HeroContent {
  title: string;
  subtitle: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  image?: string;
}

export interface AboutContent {
  title: string;
  quote?: string;
  description1: string;
  description2?: string;
  image?: string;
}

export interface ServiceContent {
  title: string;
  description: string;
  duration?: string;
  price?: string;
  features?: string[];
}

export interface TestimonialContent {
  name: string;
  text: string;
  role?: string;
  rating?: number;
}

export interface ContactContent {
  title?: string;
  subtitle?: string;
  address: string;
  phone: string;
  email: string;
  hours?: string;
}

export interface GalleryImage {
  url: string;
  alt?: string;
}

export interface GallerySection {
  title: string;
  description?: string;
  images: GalleryImage[];
}

export interface SiteContent {
  hero: HeroContent | null;
  about: AboutContent | null;
  services: ServiceContent[];
  testimonials: TestimonialContent[];
  contact: ContactContent | null;
  gallery: GallerySection[];
}

// ==========================================
// Fetch Functions
// ==========================================

export async function getHeroContent(preview = false): Promise<HeroContent | null> {
  try {
    const entries = await getClient(preview).getEntries({
      content_type: 'hero',
      limit: 1,
    });

    if (!entries.items.length) return null;

    const item = entries.items[0];
    const fields = item.fields as any;

    return {
      title: fields.title || '',
      subtitle: fields.subtitle || '',
      description: fields.description || '',
      ctaText: fields.ctaText || '',
      ctaLink: fields.ctaLink || '',
      image: getAssetUrl(fields.image) || undefined,
    };
  } catch (error) {
    console.error('Error fetching hero content:', error);
    return null;
  }
}

export async function getAboutContent(preview = false): Promise<AboutContent | null> {
  try {
    const entries = await getClient(preview).getEntries({
      content_type: 'about',
      limit: 1,
    });

    if (!entries.items.length) return null;

    const item = entries.items[0];
    const fields = item.fields as any;

    return {
      title: fields.title || '',
      quote: fields.quote || '',
      description1: fields.description1 || '',
      description2: fields.description2 || '',
      image: getAssetUrl(fields.image) || undefined,
    };
  } catch (error) {
    console.error('Error fetching about content:', error);
    return null;
  }
}

export async function getServices(preview = false): Promise<ServiceContent[]> {
  try {
    const entries = await getClient(preview).getEntries({
      content_type: 'service',
      order: ['fields.order'] as any,
    });

    return entries.items.map((item) => {
      const fields = item.fields as any;
      return {
        title: fields.title || '',
        description: fields.description || '',
        duration: fields.duration || '',
        price: fields.price || '',
        features: fields.features || [],
      };
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export async function getTestimonials(preview = false, limit = 10): Promise<TestimonialContent[]> {
  try {
    const entries = await getClient(preview).getEntries({
      content_type: 'testimonial',
      limit,
    });

    return entries.items.map((item) => {
      const fields = item.fields as any;
      return {
        name: fields.name || '',
        text: fields.text || fields.quote || '',
        role: fields.role || '',
        rating: fields.rating || 5,
      };
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function getContactContent(preview = false): Promise<ContactContent | null> {
  try {
    const entries = await getClient(preview).getEntries({
      content_type: 'contact',
      limit: 1,
    });

    if (!entries.items.length) {
      return {
        title: 'Get in Touch',
        subtitle: 'Have questions about breathwork or want to know more about upcoming sessions?',
        address: 'Oklahoma City, OK',
        phone: '(405) 555-1234',
        email: 'contact@sherrilynnbreathwork.com',
        hours: 'By Appointment',
      };
    }

    const item = entries.items[0];
    const fields = item.fields as any;

    return {
      title: fields.title || 'Get in Touch',
      subtitle: fields.subtitle || '',
      address: fields.address || 'Oklahoma City, OK',
      phone: fields.phone || '(405) 555-1234',
      email: fields.email || 'contact@sherrilynnbreathwork.com',
      hours: fields.hours || '',
    };
  } catch (error) {
    console.error('Error fetching contact content:', error);
    return {
      title: 'Get in Touch',
      address: 'Oklahoma City, OK',
      phone: '(405) 555-1234',
      email: 'contact@sherrilynnbreathwork.com',
    };
  }
}

export async function getGallerySections(preview = false): Promise<GallerySection[]> {
  try {
    const entries = await getClient(preview).getEntries({
      content_type: 'gallerySection',
    });

    return entries.items.map((item) => {
      const fields = item.fields as any;
      const images = (fields.images || []).map((img: Asset) => ({
        url: getAssetUrl(img) || '',
        alt: img.fields?.title || '',
      }));

      return {
        title: fields.title || '',
        description: fields.description || '',
        images,
      };
    });
  } catch (error) {
    console.error('Error fetching gallery sections:', error);
    return [];
  }
}

export async function getSiteContent(preview = false): Promise<SiteContent> {
  try {
    const [hero, about, services, testimonials, contact, gallery] = await Promise.all([
      getHeroContent(preview),
      getAboutContent(preview),
      getServices(preview),
      getTestimonials(preview),
      getContactContent(preview),
      getGallerySections(preview),
    ]);

    return {
      hero,
      about,
      services,
      testimonials,
      contact,
      gallery,
    };
  } catch (error) {
    console.error('Error fetching site content:', error);
    return {
      hero: null,
      about: null,
      services: [],
      testimonials: [],
      contact: null,
      gallery: [],
    };
  }
}

// ==========================================
// Blog/Posts
// ==========================================

export interface BlogPost {
  title: string;
  slug: string;
  excerpt?: string;
  body?: any;
  publishedAt: string;
  mainImage?: any;
}

export async function getBlogPosts(preview = false, limit = 10): Promise<BlogPost[]> {
  try {
    const entries = await getClient(preview).getEntries({
      content_type: 'post',
      order: ['-fields.publishedAt'] as any,
      limit,
      include: 2,
    });

    return entries.items.map((item) => {
      const fields = item.fields as any;
      return {
        title: fields.title || '',
        slug: fields.slug || '',
        excerpt: fields.excerpt || '',
        body: fields.body || null,
        publishedAt: fields.publishedAt || new Date().toISOString(),
        mainImage: fields.mainImage || fields.featuredImage || null,
      };
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPostBySlug(slug: string, preview = false): Promise<BlogPost | null> {
  try {
    const entries = await getClient(preview).getEntries({
      content_type: 'post',
      'fields.slug': slug,
      limit: 1,
      include: 2,
    });

    if (!entries.items.length) return null;

    const item = entries.items[0];
    const fields = item.fields as any;

    return {
      title: fields.title || '',
      slug: fields.slug || '',
      excerpt: fields.excerpt || '',
      body: fields.body || null,
      publishedAt: fields.publishedAt || new Date().toISOString(),
      mainImage: fields.mainImage || fields.featuredImage || null,
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}
