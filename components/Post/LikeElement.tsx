// import { faThumbsUp } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { Post } from 'lib/sanity.queries'
// import { updatePostLikes } from 'pages/api/likes'
// import { useState } from 'react'

// export default function LikeElement(props: Pick<Post, 'slug' | 'likes'>) {
//   const { slug, likes } = props
//   const [likePost, setLikePost] = useState(likes)
//   const [isLiked, setIsLiked] = useState(false)

//   const handleLike = async () => {
//     if (!slug) {
//       console.error('Slug is missing or undefined.')
//       return
//     }

//     if (isLiked) {
//       console.warn('Post is already liked.')
//       return
//     }
//     if (!isLiked) {
//       // Make a request to your backend API to update the likes count
//       try {
//         const updatedLikes = await updatePostLikes(slug)
//         setLikePost(updatedLikes)
//         setIsLiked(true)
//       } catch (error) {
//         console.error('Error updating likes:', error)
//       }
//     }
//   }
//   return (
//     <div className="flex items-center justify-center gap-2 ">
//       <button onClick={handleLike} disabled={isLiked}>
//         {isLiked ? (
//           <FontAwesomeIcon
//             icon={faThumbsUp}
//             className="h-4 w-4 text-orange-500"
//           />
//         ) : (
//           <FontAwesomeIcon
//             icon={faThumbsUp}
//             className="h-4 w-4 text-gray-400"
//           />
//         )}
//       </button>
//       <span className="rounded-md bg-gray-100 px-2 py-1">{likes}</span>
//     </div>
//   )
// }
