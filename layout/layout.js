import Header from 'components/Header/Header'

import styles from '../styles/Layout.module.css'
function layout({ children }) {
  return (
    <>
      {/* <Header /> */}
      <div className="flex h-[100vh] bg-orange-400 p-4 xs:px-10">
        <div className="md: m-auto grid  min-h-[85%] w-full rounded-md bg-slate-50 shadow-2xl  lg:grid-cols-2 xl:w-4/5 2xl:w-[70%]">
          <div className={styles.imgStyle}>
            <div className={styles.cartoonImg}></div>
            <div className={styles.cloud1}></div>
            <div className={styles.cloud2}></div>
          </div>
          <div className="flex flex-col justify-center rounded-b-md  lg:rounded-b-none lg:rounded-r-md">
            <div className="text-center ">{children}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default layout
