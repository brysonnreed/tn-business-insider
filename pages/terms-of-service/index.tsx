import BlogContainer from 'components/Blog/BlogContainer'
import Footer from 'components/Footer'
import Header from 'components/Header'
import SectionSeparator from 'components/SectionSeparator'
import Link from 'next/link'
import React from 'react'

export default function TermsOfService() {
  return (
    <>
      <Header />
      <article className="mx-auto min-h-screen max-w-5xl pt-10">
        <BlogContainer>
          <div className="mb-10 flex flex-col gap-3 rounded-md bg-orange-500 px-4 py-6 text-white shadow-xl">
            <h1 className="text-3xl font-semibold  sm:text-4xl">
              Terms Of Service
            </h1>
            <p>
              By accessing and using this website, you agree to be bound by
              these Terms of Service. If you do not agree to these terms, please
              refrain from using the website.
            </p>
          </div>
          <main className="flex flex-col gap-4 border-t py-6">
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                Intellectual Property Rights:{' '}
              </span>{' '}
              All content on this website, including but not limited to text,
              graphics, logos, images, videos, and software, is the property of
              TNBusinessInsider and is protected by intellectual property laws.
              You may not reproduce, distribute, or use any content from this
              website without prior written permission.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                User Conduct:{' '}
              </span>{' '}
              You agree to use this website only for lawful purposes and in a
              manner that does not violate any applicable laws or regulations.
              Prohibited activities include, but are not limited to: - Engaging
              in any behavior that could damage, disable, or impair the
              website&apos;s functionality. - Attempting to gain unauthorized
              access to any part of the website or its related systems. -
              Uploading or transmitting any harmful or malicious content.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                User Contributions:{' '}
              </span>{' '}
              By submitting content to this website, including but not limited
              to reviews, comments, or business information, you grant [Your
              Company Name] a non-exclusive, royalty-free, perpetual,
              irrevocable, and fully sublicensable right to use, reproduce,
              modify, adapt, publish, translate, create derivative works from,
              distribute, and display such content worldwide.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                Privacy Policy:{' '}
              </span>{' '}
              Please review our Privacy Policy to understand how we collect,
              use, and disclose information from our users. By using this
              website, you consent to our Privacy Policy&apos;s practices.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                Paid Services:{' '}
              </span>{' '}
              Certain features or services on this website may require payment.
              By purchasing these services, you agree to the specific terms and
              conditions applicable to those services.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                Limitation of Liability:{' '}
              </span>{' '}
              TNBusinessInsider shall not be liable for any direct, indirect,
              incidental, consequential, or punitive damages arising from your
              use of this website or any content, products, or services provided
              herein.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                Indemnification:{' '}
              </span>{' '}
              You agree to indemnify and hold harmless TNBusinessInsider, its
              affiliates, officers, directors, employees, and agents from any
              claims, liabilities, damages, or expenses arising out of your use
              of the website.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                Modification and Termination :{' '}
              </span>{' '}
              TNBusinessInsider reserves the right to modify, suspend, or
              terminate any part of the website or these Terms of Service at any
              time without notice.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                Governing Law:{' '}
              </span>{' '}
              These Terms of Service shall be governed by and construed in
              accordance with the laws of Tennessee, without regard to its
              conflict of law principles.
            </p>
            <p className="ml-2 flex flex-col gap-2 text-gray-500">
              <span className="-ml-2 text-lg font-semibold text-black underline">
                Contact Us:{' '}
              </span>{' '}
              If you have any questions or concerns about these Terms of
              Service, please contact us at [Your Contact Email].
            </p>
          </main>
        </BlogContainer>
      </article>
      <Footer />
    </>
  )
}
