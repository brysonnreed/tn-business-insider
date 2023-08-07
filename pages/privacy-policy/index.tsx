import BlogContainer from 'components/Blog/BlogContainer'
import Footer from 'components/Footer'
import Header from 'components/Header'
import SectionSeparator from 'components/SectionSeparator'
import Link from 'next/link'
import React from 'react'

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <article className="mx-auto min-h-screen max-w-5xl pt-10">
        <BlogContainer>
          <div className="mb-10 flex flex-col gap-3 rounded-md bg-orange-500 px-4 py-6 text-white shadow-xl">
            <h1 className="text-3xl font-semibold  sm:text-4xl">
              Privacy Policy
            </h1>
            <p>
              This Privacy Policy outlines how{' '}
              <Link
                href={'/'}
                className="font-semibold underline  hover:underline"
              >
                TNBusinessInsider
              </Link>{' '}
              collects, uses, discloses, and protects personal information
              collected from users of this website
            </p>
          </div>
          <main className="flex flex-col gap-4 border-t py-6">
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                Information We Collect:{' '}
              </span>{' '}
              We may collect personal information, such as names, email
              addresses, phone numbers, and other data provided voluntarily by
              users through website forms, registration, or other interactions.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                {' '}
                How We Use Your Information:{' '}
              </span>{' '}
              We may use your personal information for the following purposes: -
              To provide and maintain the website&apos;s functionality. - To
              respond to your inquiries, requests, or customer service needs. -
              To personalize your user experience on the website. - To send you
              marketing communications, with your consent. - To analyze website
              usage and improve our services.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                {' '}
                Cookies and Tracking Technologies:
              </span>{' '}
              This website uses cookies and similar tracking technologies to
              enhance user experience, analyze usage patterns, and provide
              relevant content. You may disable cookies through your browser
              settings, but this may affect certain website features.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                {' '}
                Sharing Your Information:
              </span>{' '}
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except as
              required by law or to provide services requested by you.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                Data Security:
              </span>{' '}
              We implement appropriate security measures to protect your
              personal information from unauthorized access, disclosure,
              alteration, or destruction.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                {' '}
                Third-Party Links:
              </span>{' '}
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices or content of these
              websites. Please review their respective Privacy Policies when
              visiting them.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                {' '}
                Children&apos;s Privacy:
              </span>{' '}
              This website is not intended for children under the age of 13. We
              do not knowingly collect personal information from children.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                Your Choices:
              </span>{' '}
              You may have the right to access, correct, or delete your personal
              information. Please contact us at info@tnbusinessinsider.com to
              make such requests.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                {' '}
                Updates to this Policy:
              </span>{' '}
              We reserve the right to update or modify this Privacy Policy at
              any time.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                Contact Us:
              </span>{' '}
              If you have any questions or concerns about this Privacy Policy,
              please contact us at [Your Contact Email].
            </p>
          </main>
        </BlogContainer>
      </article>
      <Footer />
    </>
  )
}
