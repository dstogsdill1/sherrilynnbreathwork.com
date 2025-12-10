// Re-export all Contentful functions from the new contentful.ts
// This file is kept for backward compatibility

export {
  getSiteContent,
  getHeroContent,
  getAboutContent,
  getServices,
  getTestimonials,
  getContactContent,
  getGallerySections,
  getBlogPosts,
  getBlogPostBySlug,
  getAssetUrl,
} from './contentful';

export type {
  HeroContent,
  AboutContent,
  ServiceContent,
  TestimonialContent,
  ContactContent,
  GallerySection,
  GalleryImage,
  SiteContent,
  BlogPost,
} from './contentful';
