import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import logo from '../public/images/logo.jpg'

const Logo = () => (
  <Link href="/">
    <Image src={logo} alt="TNBusinessInside" style={{ width: '150px' }} />
  </Link>
)

export default Logo
