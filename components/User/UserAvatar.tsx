import Image from 'next/image'
import BlankUser from 'public/images/blank-user-image.png'

export default function UserAvatar(image) {
  return (
    <div className="relative">
      <Image
        src={image ? image.image : BlankUser}
        className="h-8 w-8 rounded-full object-cover xs:h-10 xs:w-10"
        height={96}
        width={96}
        alt="profile icon"
      />
    </div>
  )
}
