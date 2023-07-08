import Header from './Header'

export default function BlogLayout({
  preview,
  loading,
  children,
}: {
  preview: boolean
  loading?: boolean
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <div className="mx-auto min-h-screen max-w-5xl pt-10">
        <main>{children}</main>
      </div>
    </>
  )
}
