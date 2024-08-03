import MoreStories from 'components/Features/Blog/MoreStories'
import PostBody from 'components/Features/Blog/Post/PostBody'
import PostHeader from 'components/Features/Blog/Post/PostHeader'
import CommentForm from 'components/Features/User/CommentForm'
import SectionSeparator from 'components/UI/SectionSeparator'
import type { Post, Settings } from 'lib/sanity/sanity.queries'

import PostPageHead from './PostMeta'

export interface PostPageProps {
  loading?: boolean
  post: Post
  morePosts: Post[]
  settings: Settings
}

const NO_POSTS: Post[] = []

export default function PostPage(props: PostPageProps) {
  const { morePosts = NO_POSTS, post, settings } = props

  const slug = post?.slug

  return (
    <>
      <PostPageHead settings={settings} post={post} />

      <main className="boxSection">
        <div className="boxContainer">
          <article>
            <PostHeader
              title={post.title}
              coverImage={post.coverImage}
              date={post.date}
              author={post.author}
              slug={post.slug}
              _id={post._id}
            />
            <PostBody content={post.content} />
          </article>
          <SectionSeparator />
          {morePosts?.length > 0 && <MoreStories posts={morePosts} />}
          <SectionSeparator />
          <CommentForm post={post} />
        </div>
      </main>
    </>
  )
}
