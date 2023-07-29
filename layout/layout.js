import Header from 'components/Header'

import styles from '../styles/Layout.module.css'
function layout({ children }) {
  return (
    <>
      <Header />
      <div className="flex h-[85vh] p-4 xs:px-10">
        <div className="md: m-auto grid h-3/4 w-full rounded-md bg-slate-50 shadow-2xl md:w-3/4 lg:grid-cols-2 xl:w-3/5">
          <div className={styles.imgStyle}>
            <div className={styles.cartoonImg}></div>
            <div className={styles.cloud1}></div>
            <div className={styles.cloud2}></div>
          </div>
          <div className="flex flex-col justify-center rounded-b-md bg-orange-500 lg:rounded-b-none lg:rounded-r-md">
            <div className="text-center ">{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default layout
