import Button from 'components/Common/Button'
import Heading from 'components/Common/Heading'
import Text from 'components/Common/Text'
import HomeMeta from 'components/Pages/Home/HomeMeta'
import type { Post, Settings } from 'lib/sanity/sanity.queries'
import Image from 'next/image'

import FeaturedBlogPosts from '../../UI/FeaturedBlogPosts'

export interface HomePageProps {
  posts: Post[]
  settings: Settings
}

export default function HomePage(props: HomePageProps) {
  const { posts, settings } = props

  return (
    <>
      <HomeMeta settings={settings} />
      <div className="flex min-h-[80vh] items-center bg-gray-100 px-5">
        <div className="mx-auto grid max-w-6xl  grid-cols-1 items-center justify-items-start gap-4 md:grid-cols-2 md:justify-items-end">
          <div>
            <Heading level={1}>
              Discover & Connect with Tennessee&apos;s{' '}
              <span className="highlight">Best Businesses</span>.
            </Heading>
            <Text>
              Find local businesses, read reviews, and access valuable resources
              for business owners. List your business in our directory to grow
              leads, increase backlinking, and grow your digital presence.
            </Text>
            <div className="mt-5 flex flex-row gap-5">
              <Button href="/businesses" styleType="secondary">
                Find Businesses
              </Button>
              <Button
                href="/businesses/business-management/add"
                styleType="secondaryWhite"
              >
                List Your Business
              </Button>
            </div>
          </div>
          <div>
            <Image
              src={`/images/Guy Celebrating - Cut Gray.png`}
              alt="Guy Celebrating at computer"
              height={350}
              width={350}
            />
          </div>
        </div>
      </div>
      <div className="flex min-h-[80vh] items-center px-5">
        <div className="mx-auto flex max-w-6xl  flex-col items-center gap-10 ">
          <div>
            <Heading className="md:text-center" level={2}>
              Maximize Your{' '}
              <span className="relative inline-block">
                <span className="relative z-10">Reach</span>
                <span className="-z-1 absolute inset-0 top-[80%] border-b-[8px] border-orange-500"></span>
              </span>
              : The Benefits of Listing Your Business
            </Heading>
            <Text className="md:text-center">
              Unlock new opportunities and boost your business&apos;s growth by
              joining Tennessee Business Insider. From increased visibility to
              higher engagement and improved conversion rates, discover the
              powerful benefits of showcasing your business on our platform. Get
              noticed, attract more customers, and elevate your brand with ease.
            </Text>
          </div>
          <div className="flex w-full flex-col justify-evenly gap-10 md:mt-20 md:flex-row md:items-center md:gap-0">
            <div className="md:border-r md:pr-20">
              <Heading
                level={3}
                className="text-[42px] text-orange-600 md:text-[60px]"
              >
                20%
              </Heading>
              <Text>More Engagement</Text>
            </div>

            <div className="md:border-r md:pr-20">
              <Heading
                level={3}
                className="text-[42px] text-orange-600 md:text-[60px]"
              >
                11%
              </Heading>
              <Text>More Leads</Text>
            </div>
            <div>
              <Heading
                level={3}
                className="text-[42px] text-orange-600 md:text-[60px]"
              >
                26%
              </Heading>
              <Text>Higher Conversion Rates</Text>
            </div>
          </div>
        </div>
      </div>
      <main className="boxSection">
        <div className="boxContainer">
          <Heading level={2} className="text-center">
            Stay up to date on Business Insights
          </Heading>
          <FeaturedBlogPosts posts={posts} />
          <div className="flex items-center justify-center">
            <Button href="/blog" styleType="secondary">
              More Blog Posts
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}
