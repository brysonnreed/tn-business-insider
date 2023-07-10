import { EarthAmericasIcon, LinkIcon, PinIcon, StarIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'businessProfile',
  title: 'Business Profile',
  icon: EarthAmericasIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Business Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Images of the business',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'verified',
      title: 'Verfified',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({ name: 'city', title: 'City', type: 'string' }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'businessProfileCategory' }],
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of services offered by the business',
    }),

    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility.',
            },
          ],
        },
      ],
      description: 'Images of the business',
    }),

    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'socialMedia',
      title: 'Social Media',
      icon: StarIcon,
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'Twitter', value: 'twitter' },
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'LinkedIn', value: 'linkedIn' },
                  // Add more social media platforms as needed
                ],
              },
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              icon: LinkIcon,
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
    }),
    defineField({
      name: 'mapLocation',
      title: 'Map Location',
      type: 'url',
      description: 'Paste the Google Maps iframe url code here',
      icon: PinIcon,
    }),
    defineField({
      name: 'hours',
      title: 'Business Hours',
      type: 'object',
      fields: [
        {
          name: 'monday',
          title: 'Monday',
          description: 'Format Example: 5:00 PM',
          type: 'object',
          fields: [
            {
              name: 'isOpen',
              title: 'Open',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'object',
              fields: [
                {
                  name: 'open',
                  title: 'Open Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
                {
                  name: 'close',
                  title: 'Close Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'tuesday',
          title: 'Tuesday',
          description: 'Format Example: 5:00 PM',
          type: 'object',
          fields: [
            {
              name: 'isOpen',
              title: 'Open',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'object',
              fields: [
                {
                  name: 'open',
                  title: 'Open Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
                {
                  name: 'close',
                  title: 'Close Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'wednesday',
          title: 'Wednesday',
          description: 'Format Example: 5:00 PM',
          type: 'object',
          fields: [
            {
              name: 'isOpen',
              title: 'Open',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'object',
              fields: [
                {
                  name: 'open',
                  title: 'Open Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
                {
                  name: 'close',
                  title: 'Close Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'thursday',
          title: 'Thursday',
          description: 'Format Example: 5:00 PM',
          type: 'object',
          fields: [
            {
              name: 'isOpen',
              title: 'Open',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'object',
              fields: [
                {
                  name: 'open',
                  title: 'Open Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
                {
                  name: 'close',
                  title: 'Close Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'friday',
          title: 'Friday',
          description: 'Format Example: 5:00 PM',
          type: 'object',
          fields: [
            {
              name: 'isOpen',
              title: 'Open',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'object',
              fields: [
                {
                  name: 'open',
                  title: 'Open Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
                {
                  name: 'close',
                  title: 'Close Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'saturday',
          title: 'Saturday',
          description: 'Format Example: 5:00 PM',
          type: 'object',
          fields: [
            {
              name: 'isOpen',
              title: 'Open',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'object',
              fields: [
                {
                  name: 'open',
                  title: 'Open Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
                {
                  name: 'close',
                  title: 'Close Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'sunday',
          title: 'Sunday',
          description: 'Format Example: 5:00 PM',
          type: 'object',
          fields: [
            {
              name: 'isOpen',
              title: 'Open',
              type: 'boolean',
              initialValue: false,
            },
            {
              name: 'hours',
              title: 'Hours',
              type: 'object',
              fields: [
                {
                  name: 'open',
                  title: 'Open Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
                {
                  name: 'close',
                  title: 'Close Time',
                  type: 'string',
                  options: {
                    condition: 'isOpen',
                  },
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
})
