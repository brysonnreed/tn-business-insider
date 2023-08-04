import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SanityAdapter, SanityCredentials } from 'next-auth-sanity'
import { createClient } from 'next-sanity'

import { handleSignIn } from '../../../lib/authUtils'
import { addUser } from '../addUser'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
const token = process.env.SANITY_API_WEBHOOK_TOKEN

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
})

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    SanityCredentials(client),
  ],
  // session: {
  //   strategy: 'jwt',
  // },
  secret: process.env.SECRET,

  // You can define custom pages to override the built-in pages.
  // The routes shown here are the default URLs that will be used when a custom
  // pages is not specified for that route.
  // https://next-auth.js.org/configuration/pages
  pages: {
    signIn: '/login', // Displays signin buttons
    // signOut: '/api/auth/signout', // Displays form with sign out button
    // error: '/api/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/api/auth/verify-request', // Used for check email page
    // newUser: null // If set, new users will be directed here on first sign in
  },

  // Callbacks are asynchronous functions you can use to control what happens
  // when an action is performed.
  // https://next-auth.js.org/configuration/callbacks
  callbacks: {
    // signIn: async (user, account, profile) => {
    //   return Promise.resolve(true);
    // },
    // async signIn(user, account, profile) {
    //   console.log('user: ', user)

    //   return true // Allow sign-in
    // },
    async signIn(user, account, profile) {
      handleSignIn(user)

      return true // Allow sign-in
    },
    // redirect: async (url, baseUrl) => {
    //   return Promise.resolve(baseUrl);
    // },
    // async session(session, user) {
    //   session.user = user // Set the user object in the session
    //   return session
    // },
    // async session(session, user) {
    //   console.log('Session data:', session)
    //   console.log('User data:', user)

    //   if (user && user.id) {
    //     session.user.id = user.id // Set the user's id in the session
    //   } else {
    //     console.log('User id is missing or undefined')
    //   }

    //   return session
    // },
    // jwt: async (token, user, account, profile, isNewUser) => {
    //   return Promise.resolve(token);
    // },
    // async jwt(token, user) {
    //   if (user) {
    //     token.id = user.id // Set the user's id in the token
    //   }
    //   return token
    // },
  },
}

export default NextAuth(authOptions)
