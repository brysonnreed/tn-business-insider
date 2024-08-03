import 'react-multi-carousel/lib/styles.css'

import AuthorAvatar from 'components/Features/Blog/AuthorAvatar'
import Date from 'components/Features/Blog/Post/PostDate'
import { Post } from 'lib/sanity/sanity.queries'
import Carousel from 'react-multi-carousel'

import CoverImage from '../Features/Blog/Post/CoverImage'

interface FeaturedBlogPostsProps {
  posts: Post[]
}

const FeaturedBlogPosts: React.FC<FeaturedBlogPostsProps> = ({ posts }) => {
  const showcasePosts = posts.filter((post) =>
    post.categories?.some((category) => category.name === 'Showcase')
  )

  if (showcasePosts.length === 0) {
    return <h2>There are no posts to showcase!</h2>
  }
  const responsive = {
    desktop: {
      breakpoint: {
        max: 3000,
        min: 1024,
      },
      items: 3,
      partialVisibilityGutter: 40,
    },
    mobile: {
      breakpoint: {
        max: 464,
        min: 0,
      },
      items: 1,
      partialVisibilityGutter: 30,
    },
    tablet: {
      breakpoint: {
        max: 1024,
        min: 464,
      },
      items: 2,
      partialVisibilityGutter: 30,
    },
  }

  return (
    <div className="">
      <Carousel
        additionalTransfrom={0}
        arrows={false}
        autoPlay
        autoPlaySpeed={2500}
        centerMode={false}
        containerClass="container-with-dots"
        draggable={true}
        focusOnSelect={true}
        infinite
        keyBoardControl
        minimumTouchDrag={80}
        pauseOnHover={true}
        renderArrowsWhenDisabled={false}
        renderButtonGroupOutside={false}
        renderDotsOutside={false}
        responsive={responsive}
        rewind={false}
        rewindWithAnimation={false}
        rtl={false}
        shouldResetAutoplay
        showDots={false}
        slidesToSlide={1}
        swipeable={true}
        customTransition="transform 500ms ease-in-out"
        itemClass="carousel-item"
        partialVisible={false}
      >
        {showcasePosts.map((post, i) => (
          <div
            key={i + 1}
            className="carousel-item flex h-[450px] flex-col rounded-lg border border-gray-200 p-2 shadow transition-all sm:hover:scale-[1.01] md:m-4"
          >
            <div className="mb-3">
              <CoverImage
                slug={post.slug}
                title={post.title}
                image={post.coverImage}
                priority={false}
              />
            </div>
            <div className="flex h-full flex-col justify-between">
              <div className="mb-3 text-2xl font-semibold leading-snug">
                <a className="hover:underline" href={`/posts/${post.slug}`}>
                  {post.title}
                </a>
                <div className="mb-3 text-lg font-normal text-gray-500">
                  <Date dateString={post.date} />
                </div>
                {post.excerpt && (
                  <p className="mb-4 line-clamp-2 overflow-hidden text-lg font-normal leading-relaxed md:line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
              </div>

              {post.author && (
                <AuthorAvatar
                  name={post.author.name}
                  picture={post.author.picture}
                />
              )}
            </div>
          </div>
        ))}
      </Carousel>
      <style jsx>{`
        .carousel-item {
          margin-right: 10px;
          margin-bottom: 50px; /* Adjust the margin value to control the space */
        }
      `}</style>
    </div>
  )
}

export default FeaturedBlogPosts
