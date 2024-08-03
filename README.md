# 🚀 Tennessee Business Insider

![Tennessee Business Insider Logo](https://tn-business-insider.vercel.app/images/logo.jpg)

Welcome to **Tennessee Business Insider**! This platform allows users to search for businesses, list their own businesses, and access valuable blog posts. Leveraging a Headless CMS and modern technologies, it provides a comprehensive solution for both users and business owners.

## 🏆 Features

### 📝 Headless CMS with Sanity.io

- **Sanity.io Integration**: Manage your content seamlessly with Sanity.io.
- **Rich Content Support**: Includes text, images, and more.
- **Database**: Enables easy visualization and editing of data.

**_Implementation Details_**
To set up the headless CMS, I created a 'studio' folder and installed all necessary npm packages. I then configured the CMS by creating schemas and setting up the Sanity config file. This setup allows for the complete customization of the dashboard's appearance and functionality. Additionally, the database capabilities of Sanity.io allow for easy visualization and editing of content, ensuring efficient data management. A theme file was also developed to give the CMS a unique, branded look.

<img src="https://tn-business-insider.vercel.app/images/sanity-cms.png" alt="Sanity CMS" style="width:100%; max-width:600px; border-radius:10px;">

### 🔐 User Management

- **Secure Login**: Traditional email/password with Hashing and Salting (Argon2) or Google Auth sign-in.
- **Registration & Verification**: Email verification for valid accounts.
- **Profile Management**: Update profile picture, name, and manage account details.
- **Dashboard**: View liked blog posts and reviews.

**_Implementation Details_**
I designed a custom user schema in Sanity to handle user data. Using NextAuth, I implemented secure authentication with options for traditional email/password and Google Auth sign-in. A utility file (authUtils) was created to manage user sessions and ensure that Google-authenticated users are linked to the database. Passwords are hashed and salted using Argon2 for security. During registration, passwords are sent to an API to be securely stored. Users receive a verification email via Nodemailer, and upon clicking the link, their account is automatically created. Profile management and dashboard data are fetched using Next.js's getServerSideProps to ensure real-time updates.

<img src="https://tn-business-insider.vercel.app/images/user-dashboard.png" alt="User Dashboard" style="width:100%; max-width:600px; border-radius:10px;">

### 🏢 Business Listings

- **Create & Manage**: Add and update your business information.
- **Analytics**: View performance metrics (work in progress).
- **Lead Tracking**: Monitor lead generation (work in progress).

**_Implementation Details_**
I used react-hook-form for creating and managing business forms, ensuring data validation with type definitions. A sanitizeUserInput.js file was implemented to sanitize and validate inputs, including email, URLs, and preventing malicious content. Business data is updated using the same approach as user information. For analytics and lead tracking, I developed a custom analytics feature to track page views using useEffect and sessionStorage. This setup checks if a user has viewed a business profile within a certain timeframe and updates the view count in the database accordingly.

<img src="https://tn-business-insider.vercel.app/images/business-listing.png" alt="Business Listings" style="width:100%; max-width:600px; border-radius:10px;">
<img src="https://tn-business-insider.vercel.app/images/business-management.png" alt="Business Management Dashboard" style="width:100%; max-width:600px; border-radius:10px;">
<img src="https://tn-business-insider.vercel.app/images/business-update.png" alt="Business Management Dashboard" style="width:100%; max-width:600px; border-radius:10px;">

### ✔️ Verified Profiles

- **Profile Verification**: Subscribe to get verified status for better visibility (work in progress).

### ⭐ Business Reviews

- **Receive Reviews**: Gather and showcase reviews from users.

<img src="https://tn-business-insider.vercel.app/images/business-reviews.png" alt="Business Reviews" style="width:100%; max-width:600px; border-radius:10px;">
<img src="https://tn-business-insider.vercel.app/images/add-business-reviews.png" alt="Adding Business Reviews" style="width:100%; max-width:600px; border-radius:10px;">

### 🌐 Dynamic Content Generation

- **Nested Dynamic Routes for Businesses**: This project utilizes nested dynamic routes to automatically generate pages for each city and business category in the database. For instance, if there are 30+ categories and a new city is added, the system will create 30+ new pages, one for each category in that city. With 345 cities in Tennessee and 50+ business categories, this capability results in the creation of over 17,250 pages, ensuring comprehensive coverage and easy navigation.

**_Implementation Details_**
The folder structure follows /businesses/[category]/[city], and I utilized getStaticProps and getStaticPaths to generate static pages for better SEO. The implementation involves fetching data for categories and cities from the Sanity database and dynamically generating paths. This setup allows for efficient page generation and ensures that all relevant business categories and cities are covered.

### 🔍 Advanced Search Functionality

- **Integrated Search Bar**: Located in the header, the search bar allows users to easily find businesses or blog posts from any page on the site. This feature enhances user experience by providing quick and efficient access to desired content.

### 🔐 Protected Page Routes

- **Protected routes for whether a user is signed in/out**:

**_Implementation Details_**
To protect sensitive routes, I used getServerSideProps to check if a session exists before rendering the page. If a session is not active, users are redirected to the login page with a callback URL, ensuring that only authenticated users can access certain pages.
