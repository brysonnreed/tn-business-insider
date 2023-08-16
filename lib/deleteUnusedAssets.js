// This script will find and delete all assets that are not
// referenced (in use) by other documents. Sometimes refered
// to as "orphaned" assets.
//
// Place this script somewhere and run it through
// `sanity exec <script-filename.js> --with-user-token`

import { getClient } from './sanity.client.cdn'

/* eslint-disable no-console */

const client = getClient()

const assetsToExclude = [
  'image-b12a1a758aef8a689fa82d697ad1f865af09ca5e-4508x1503-jpg',
  'image-08232b0e5971e6f5a4e7a6fe2f8bdd6dd472f7e7-150x151-png',
]
const query = `
  *[ _type in ["sanity.imageAsset", "sanity.fileAsset"] ]
  {_id, "refs": count(*[ references(^._id) ])}
  [ refs == 0 && !(_id in $assetsToExclude) ]
  ._id
`

client
  .fetch(query, { assetsToExclude })
  .then((ids) => {
    if (!ids.length) {
      console.log('No assets to delete')
      return true
    }

    console.log(`Deleting ${ids.length} assets`)
    return ids
      .reduce((trx, id) => trx.delete(id), client.transaction())
      .commit()
      .then(() => console.log('Done!'))
  })
  .catch((err) => {
    if (err.message.includes('Insufficient permissions')) {
      console.error(err.message)
      console.error('Did you forget to pass `--with-user-token`?')
    } else {
      console.error(err.stack)
    }
  })
