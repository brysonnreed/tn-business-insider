import Image from 'next/image'
import BlankUser from 'public/images/blank-user-image.png'

export default function UserAvatar(image) {
  return (
    <Image
      src={image ? image.image : BlankUser}
      className="h-10 w-10 rounded-full"
      height={96}
      width={96}
      alt="profile icon"
    />
  )
}
