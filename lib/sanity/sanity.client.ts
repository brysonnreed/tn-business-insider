import { apiVersion, dataset, projectId, useCdn } from 'lib/sanity/sanity.api'
import {
  basicBusinessProfileFields,
  BusinessCategoriesSlugsQuery,
  type BusinessProfile,
  businessProfileBySlugQuery,
  type BusinessProfileCategory,
  businessProfileCategoryFields,
  businessProfileFields,
  businessProfileSlugsQuery,
  businessProfilesQuery,
  CategoriesSlugsQuery,
  type Category,
  categoryQuery,
  Cities,
  CitiesSlugsQuery,
  cityFields,
  indexQuery,
  type Post,
  postAndMoreStoriesQuery,
  postBySlugQuery,
  postFields,
  postSlugsQuery,
  type Settings,
  settingsQuery,
} from 'lib/sanity/sanity.queries'
import { createClient, groq, type SanityClient } from 'next-sanity'

export function getClient(preview?: { token: string }): SanityClient {
  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: 'published',
  })
  if (preview) {
    if (!preview.token) {
      throw new Error('You must provide a token to preview drafts')
    }
    return client.withConfig({
      token: preview.token,
      useCdn: false,
      ignoreBrowserTokenWarning: true,
      perspective: 'previewDrafts',
    })
  }
  return client
}

export const getSanityImageConfig = () => getClient()

export async function getSettings(client: SanityClient): Promise<Settings> {
  return (await client.fetch(settingsQuery)) || {}
}

// Posts
export async function getAllPosts(
  client: SanityClient,
  limit: number = 20,
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<Post[]> {
  const query = groq`
    *[_type == "post"] | order(date ${sortOrder}, _updatedAt ${sortOrder}) [0...${limit}] {
      ${postFields}
    }
  `

  const result = await client.fetch(query)
  return result || []
}

export async function getAllPostsSlugs(): Promise<Pick<Post, 'slug'>[]> {
  const client = getClient()
  const slugs = (await client.fetch<string[]>(postSlugsQuery)) || []
  return slugs.map((slug) => ({ slug }))
}
export async function getPostBySlug(
  client: SanityClient,
  slug: string
): Promise<Post> {
  return (await client.fetch(postBySlugQuery, { slug })) || ({} as any)
}

export async function getPostAndMoreStories(
  client: SanityClient,
  slug: string
): Promise<{ post: Post; morePosts: Post[] }> {
  return await client.fetch(postAndMoreStoriesQuery, { slug })
}
export async function getPostsByCategory(
  client: SanityClient,
  categorySlug: string,
  limit: number = 20, // Default limit to 20 posts
  sortOrder: 'asc' | 'desc' = 'desc' // Default sort order to 'desc'
): Promise<Post[]> {
  const query = groq`
    *[
      _type == "post" &&
      $categorySlug in categories[]->slug.current
    ]
    | order(_createdAt ${sortOrder})
    [0...${limit}] // Apply the limit here
    {
      ${postFields}
    }
  `
  const params = {
    categorySlug,
  }

  const result = await client.fetch(query, params)
  return result
}

{/* prettier-ignore 




*/}

// Businesses
export async function getAllBusinessProfiles(
  client: SanityClient
): Promise<BusinessProfile[]> {
  return (await client.fetch(businessProfilesQuery)) || []
}

export async function getAllBusinessProfileCategories(
  client: SanityClient
): Promise<BusinessProfileCategory[]> {
  return (await client.fetch(businessProfileCategoryFields)) || []
}

export async function getBusinessProfileBySlug(
  client: SanityClient,
  slug: string
): Promise<BusinessProfile> {
  return (
    (await client.fetch(businessProfileBySlugQuery, { slug })) || ({} as any)
  )
}

export async function getAllBusinessProfileSlugs(): Promise<
  Pick<BusinessProfile, 'slug'>[]
> {
  const client = getClient()
  const slugs = (await client.fetch<string[]>(businessProfileSlugsQuery)) || []
  return slugs.map((slug) => ({ slug }))
}

export async function getAllBusinessCategoriesSlugs(): Promise<
  Pick<BusinessProfileCategory, 'slug'>[]
> {
  const client = getClient()
  const slugs =
    (await client.fetch<string[]>(BusinessCategoriesSlugsQuery)) || []
  return slugs.map((slug) => ({ slug }))
}
export async function getBusinessCategoryBySlug(
  client: SanityClient,
  slug: string
) {
  const query = groq`
    *[_type == "businessProfileCategory" && slug.current == $slug][0] {
      name,
      "slug": slug.current
    }
  `
  const params = { slug }
  const result = await client.fetch(query, params)
  return result
}
{/* prettier-ignore 




*/}
// Categories
export async function getAllCategories(
  client: SanityClient
): Promise<Category[]> {
  return (await client.fetch(categoryQuery)) || []
}
export async function getAllCategoriesSlugs(): Promise<
  Pick<Category, 'slug'>[]
> {
  const client = getClient()
  const slugs = (await client.fetch<string[]>(CategoriesSlugsQuery)) || []
  return slugs.map((slug) => ({ slug }))
}
export async function getCategoryBySlug(
  client: SanityClient,
  slug: string
): Promise<Category> {
  const query = groq`
    *[_type == "category" && slug.current == $slug][0] {
      _id,
      name,
      "slug": slug.current
    }
  `
  const params = { slug }
  const result = await client.fetch(query, params)
  return result
}
{/* prettier-ignore 




*/}
// Cities
export async function getAllCities(client: SanityClient): Promise<Cities[]> {
  return (await client.fetch(cityFields)) || []
}

export async function getAllCitiesSlugs(): Promise<Pick<Cities, 'slug'>[]> {
  const client = getClient()
  const slugs = (await client.fetch<string[]>(CitiesSlugsQuery)) || []
  return slugs.map((slug) => ({ slug }))
}
export async function getCityBySlug(
  client: SanityClient,
  slug: string
): Promise<Cities> {
  const query = groq`
    *[_type == "city" && slug.current == $slug][0] {
      name,
      "slug": slug.current
    }
  `
  const params = { slug }
  const result = await client.fetch(query, params)
  return result
}
{/* prettier-ignore 




*/}
// New method for Dynamic routing Businesses
export async function getBusinessProfilesByCityAndCategory(
  client: SanityClient,
  citySlug: string,
  categorySlug: string
): Promise<BusinessProfile[]> {
  const query = groq`
    *[
      _type == "businessProfile" &&
      city->slug.current == $citySlug &&
      category->slug.current == $categorySlug
    ]
    {
      ${basicBusinessProfileFields}
    }
  `
  const params = {
    citySlug,
    categorySlug,
  }

  const result = await client.fetch(query, params)
  return result
}
export async function getBusinessProfilesByCity(
  client: SanityClient,
  citySlug: string
): Promise<BusinessProfile[]> {
  const query = groq`
    *[
      _type == "businessProfile" &&
      city->slug.current == $citySlug
    ]
    {
      ${basicBusinessProfileFields}
    }
  `
  const params = {
    citySlug,
  }

  const result = await client.fetch(query, params)
  return result
}
export async function getBusinessProfilesByCategory(
  client: SanityClient,
  categorySlug: string
): Promise<BusinessProfile[]> {
  const query = groq`
    *[
      _type == "businessProfile" &&
      category->slug.current == $categorySlug
    ]
    {
      ${basicBusinessProfileFields}
    }
  `
  const params = {
    categorySlug,
  }

  const result = await client.fetch(query, params)
  return result
}
{/* prettier-ignore 




*/}
// User
export async function getBusinessProfilesByUser(
  client: SanityClient,
  user: string
): Promise<BusinessProfile[]> {
  const query = groq`
    *[
      _type == "businessProfile" &&
      category->slug.current == $user
    ]
    {
      ${businessProfileFields}
    }
  `
  const params = {
    user,
  }

  const result = await client.fetch(query, params)
  return result
}

// Social Media
export async function getSocialMedias(
  client: SanityClient
): Promise<BusinessProfile[]> {
  return await client.fetch(groq`
 *[_type == "socialMediaPlatform"]{_id, platform}
`)
}
