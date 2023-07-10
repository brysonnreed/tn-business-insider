import 'react-multi-carousel/lib/styles.css'

import AuthorAvatar from 'components/AuthorAvatar'
import Date from 'components/PostDate'
import { Post } from 'lib/sanity.queries'
import { useRouter } from 'next/router'
import Carousel from 'react-multi-carousel'

import CoverImage from './CoverImage'

interface ShowcaseSliderProps {
  posts: Post[]
}

const ShowcaseSlider: React.FC<ShowcaseSliderProps> = ({ posts }) => {
  const router = useRouter()

  console.log('All Posts:', posts)

  const showcasePosts = posts.filter((post) =>
    post.categories?.some((category) => category.name === 'Showcase')
  )

  console.log('Showcase Posts:', showcasePosts)

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
        pauseOnHover
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
            className="carousel-item flex h-[450px] flex-col justify-between rounded-lg border border-gray-200 p-2 shadow-2xl transition-all hover:scale-105 md:p-4"
          >
            <div className="mb-5">
              <CoverImage
                slug={post.slug}
                title={post.title}
                image={post.coverImage}
                priority={false}
              />
            </div>
            <h3 className="mb-3 text-2xl font-semibold leading-snug">
              <a className="hover:underline" href={`/posts/${post.slug}`}>
                {post.title}
              </a>
            </h3>
            <div className="mb-4 text-lg">
              <Date dateString={post.date} />
            </div>
            {post.excerpt && (
              <p className="mb-4 line-clamp-3 overflow-hidden text-lg leading-relaxed">
                {post.excerpt}
              </p>
            )}
            {post.author && (
              <AuthorAvatar
                name={post.author.name}
                picture={post.author.picture}
              />
            )}
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

export default ShowcaseSlider
