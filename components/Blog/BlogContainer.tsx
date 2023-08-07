export default function BlogContainer({ children }) {
  return (
    <>
      <div className="mx-auto rounded-lg px-3 py-5 shadow-2xl md:container md:px-5">
        {children}
      </div>
    </>
  )
}
