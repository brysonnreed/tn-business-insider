import { TagIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'businessProfileCategory',
  title: 'Business Profile Category',
  icon: TagIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    // Add more fields specific to business profile categories if needed
  ],
})
