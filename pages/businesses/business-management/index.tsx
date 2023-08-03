import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import BlogContainer from 'components/Blog/BlogContainer'
import Header from 'components/Header'
import BusinessAccordian from 'components/User/BusinessAccordian'
import ManageBusinessProfile from 'components/User/ManageBusinessProfile'
import { getClient } from 'lib/sanity.client.cdn'
import Link from 'next/link'
import { getSession, useSession } from 'next-auth/react'

function BusinessManagement({ businesses }) {
  return (
    <>
      <Header />

      <section className="mx-auto min-h-screen max-w-5xl pt-10">
        <BlogContainer>
          <div className="min-h-[75vh]">
            <div className="mb-5 ">
              <div className="flex flex-row items-center justify-between">
                <h1 className="mb-1 text-2xl font-semibold sm:text-4xl">
                  Your{' '}
                  <span className="font-bold text-orange-500">Businesses</span>
                </h1>
                <Link href={'/businesses/business-management/add'}>
                  <button className="group flex flex-row items-center justify-center gap-2 rounded border bg-slate-100 px-2 py-1 transition-all duration-200 hover:border-none hover:bg-orange-500 hover:text-white">
                    Add New{' '}
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="h-4 w-4 transition-all duration-200 group-hover:rotate-90 group-hover:text-white "
                    />
                  </button>
                </Link>
              </div>
              <p className="text-sm xs:text-base">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti, aspernatur labore architecto accusamus nemo atque rem
                aut amet laboriosam at nobis, praesentium nulla inventore
                consequuntur rerum, exercitationem libero quod ab.
              </p>
            </div>
            <div>
              {businesses.length > 0 ? (
                businesses.map((business) => (
                  <ManageBusinessProfile
                    key={business._id}
                    business={business}
                  />
                ))
              ) : (
                <div className="mt-10 flex min-h-[40vh] items-center justify-center rounded-md border-t bg-slate-200 transition-all duration-200 hover:shadow-lg">
                  <p className="text-center text-base font-thin text-gray-800 sm:text-xl">
                    It doesnt look like you are managing any businesses yet.{' '}
                    <br></br>
                    <Link
                      href={`/businesses/business-management/add`}
                      className="underline"
                    >
                      Click here
                    </Link>{' '}
                    to add one
                  </p>
                </div>
              )}
            </div>
            <BusinessAccordian />
          </div>
        </BlogContainer>
      </section>
    </>
  )
}

export default BusinessManagement

export async function getServerSideProps({ req }) {
  console.log('req: ', { req })
  const session = await getSession({ req })
  console.log('session: ', session)

  if (!session) {
    // If the session is not active, redirect to the login page
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const userEmail = session.user?.email

  const client = getClient()

  try {
    // Fetch the user document based on the email
    let user = await client.fetch('*[_type == "users" && email == $email][0]', {
      email: userEmail,
    })

    if (!user) {
      // Make a POST request to your addUser API route
      const baseUrl = req.headers.host
      const url = `http://${baseUrl}/api/addUser`

      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Include any other relevant user information
          name: session.user.name,
          email: session.user.email,
        }),
      })
      // After creating the user, fetch the updated user document
      // This ensures that the user is now present in the database
      const updatedUser = await client.fetch(
        '*[_type == "users" && email == $email][0]',
        {
          email: userEmail,
        }
      )
      // Set the user variable to the updated user
      // Now you can access the businesses property safely
      user = updatedUser
    }

    // Extract the business references from the user document
    const businessReferences = user.businesses.map((business) => business._ref)

    // Fetch the business profiles based on the references
    const businesses = await client.fetch(
      '*[_type == "businessProfile" && _id in $businessReferences]',
      {
        businessReferences,
      }
    )

    return {
      props: {
        businesses,
      },
    }
  } catch (error) {
    // Handle any errors
    console.error(error)
    return {
      props: {
        businesses: [],
      },
    }
  }
}
