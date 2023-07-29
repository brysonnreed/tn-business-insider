import { getClient } from 'lib/sanity.client.cdn'
import type { NextApiRequest, NextApiResponse } from 'next'

const client = getClient()

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, comment, name, email, image } = JSON.parse(req.body)

  try {
    await client.create({
      _type: 'comment',
      post: {
        _type: 'reference',
        _ref: _id,
      },
      comment,
      name,
      email,
      image,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ message: 'Couldn&apos;t submit comment', error })
  }

  res.status(200).json({ message: 'Comment Submitted' })
}
