import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <script
        defer
        async
        type="text/javascript"
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_PLACES_API_KEY}&libraries=places`}
      ></script>
      <body className="bg-white text-black transition-all duration-500 scrollbar scrollbar-track-gray-200 scrollbar-thumb-slate-300 hover:scrollbar-thumb-slate-400">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
