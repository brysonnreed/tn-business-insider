export default function PostTitle({ children }) {
  return (
    <h1 className="mb-6 text-center text-3xl font-bold capitalize leading-tight tracking-tighter md:text-left md:text-4xl md:leading-none lg:text-5xl">
      {children}
    </h1>
  )
}
