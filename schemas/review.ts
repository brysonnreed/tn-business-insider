import { BookIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'review',
  title: 'Review',
  icon: BookIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'User Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'User Email',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'User Image',
      type: 'url',
    }),
    defineField({
      name: 'text',
      title: 'Review Text',
      type: 'text',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (rule) => rule.min(1).max(5), // Assuming a 1-5 star system.
    }),
    defineField({
      name: 'business',
      title: 'Reviewed Business',
      type: 'reference',
      to: [{ type: 'businessProfile' }],
    }),
  ],
})
