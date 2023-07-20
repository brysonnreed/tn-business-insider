import { groq } from 'next-sanity'

export const postFields = groq`
  _id,
  title,
  date,
  _updatedAt,
  excerpt,
  metaDescription,
  keywords,
  coverImage,
  "slug": slug.current,
  "author": author->{name, picture},
  "categories": categories[]->{_id, name, slug},
`

export const businessProfileFields = groq`
  _id,
  name,
  "slug": slug.current,
  logo,
  verified,
  
  description,
  services,
  images,
  hours,
  amenities,
  socialMedia,
  address,
  mapLocation,
  "category": category->name,
  "city": city->name,
`

export const categoryQuery = groq`
  *[_type == "category"] {
    _id,
    name,
    "slug": slug.current
  }
`
export const cityFields = groq`
  *[_type == "city"] {
    name,
    "slug": slug.current
  }
`
export const businessProfileCategoryFields = groq`
  *[_type == "businessProfileCategory"] {
    name,
    "slug": slug.current,
  }
`

export const CitiesSlugsQuery = groq`
*[_type == "city" && defined(slug.current)][].slug.current
`
export const CategoriesSlugsQuery = groq`
*[_type == "category" && defined(slug.current)][].slug.current
`
export const BusinessCategoriesSlugsQuery = groq`
*[_type == "businessProfileCategory" && defined(slug.current)][].slug.current
`

export const settingsQuery = groq`*[_type == "settings"][0]`

export const indexQuery = groq`
*[_type == "post"] | order(date desc, _updatedAt desc) {
  ${postFields}
}`

export const postAndMoreStoriesQuery = groq`
{
  "post": *[_type == "post" && slug.current == $slug] | order(_updatedAt desc) [0] {
    content,
    ${postFields}
  },
  "morePosts": *[_type == "post" && slug.current != $slug] | order(date desc, _updatedAt desc) [0...6] {
    content,
    ${postFields}
  }
}`

export const postSlugsQuery = groq`
*[_type == "post" && defined(slug.current)][].slug.current
`

export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug][0] {
  ${postFields}
  "categories": categories[]->name
}
`

export const postsByCategoryQuery = groq`
*[_type == "post" && $category in categories[]->name] | order(date desc, _updatedAt desc) {
  ${postFields}
}`
export const businessProfilesQuery = groq`
*[_type == "businessProfile"] {
  ${businessProfileFields}
}[]
`

export const businessProfileCategoriesQuery = groq`
*[_type == "businessProfileCategory"] {
  name
}`

export const businessProfileBySlugQuery = groq`
*[_type == "businessProfile" && slug.current == $slug][0] {
  ${businessProfileFields}
}
`
export const businessProfileSlugsQuery = groq`
*[_type == "businessProfile" && defined(slug.current)][].slug.current
`

export interface Author {
  name?: string
  picture?: any
}

export interface Post {
  metaDescription?: string
  keywords?: string[]
  _id: string
  title?: string
  coverImage?: any
  date?: string
  _updatedAt?: string
  excerpt?: string
  author?: Author
  slug?: string
  content?: any
  categories?: any[]
}

export interface Settings {
  title?: string
  description?: any[]
  ogImage?: {
    title?: string
  }
}
export interface BusinessProfileCategory {
  name: string
  slug: string
  _id: string
}
export interface Category {
  _id: string
  name: string
  slug: string
}
export interface Cities {
  _id: string
  name: string
  slug: string
}

export interface SocialMedia {
  platform: string
  url: string
}

export interface BusinessProfile {
  _id: string
  name: string
  slug: string
  logo?: any
  description: string
  services?: string[]
  images?: any[]
  verified?: boolean
  city?: string
  hours?: {
    monday?: {
      isOpen: boolean
      hours?: {
        open: string
        close: string
      }
    }
    tuesday?: {
      isOpen: boolean
      hours?: {
        open: string
        close: string
      }
    }
    wednesday?: {
      isOpen: boolean
      hours?: {
        open: string
        close: string
      }
    }
    thursday?: {
      isOpen: boolean
      hours?: {
        open: string
        close: string
      }
    }
    friday?: {
      isOpen: boolean
      hours?: {
        open: string
        close: string
      }
    }
    saturday?: {
      isOpen: boolean
      hours?: {
        open: string
        close: string
      }
    }
    sunday?: {
      isOpen: boolean
      hours?: {
        open: string
        close: string
      }
    }
  }
  amenities?: string[]
  socialMedia?: SocialMedia[]
  address?: string
  mapLocation?: any
  category?: string
}
