import { faArrowRight, faCalendar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Avatar from 'components/AuthorAvatar'
import CoverImage from 'components/CoverImage'
import type { Post } from 'lib/sanity.queries'
import Link from 'next/link'
import Router from 'next/router'

import Date from '../Post/PostDate'

export default function Event({ name, date, description, dateEstimate, link }) {
  return (
    <article className="flex flex-col items-start justify-center gap-4 border-b pb-5">
      <div className="flex items-center justify-center gap-2 border-b-4 border-black pb-2">
        <FontAwesomeIcon
          icon={faCalendar}
          className="h-7 w-7 text-orange-500"
        />
        <h2 className="border-r pr-5 text-2xl font-semibold leading-snug">
          {name}
        </h2>
        <div className="flex items-center justify-center pl-5">
          {date ? <Date dateString={date} /> : dateEstimate}
        </div>
      </div>
      <div className="">
        <p className="">{description}</p>
        {link && (
          <div className="mt-4 flex items-end justify-end">
            <a href={link}>
              <button className="flex items-center justify-center gap-2 rounded-full bg-orange-500  px-3 py-1 text-base text-white transition-all hover:scale-105">
                Learn More
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ color: 'white' }}
                  className="h-3 w-3 sm:h-5 sm:w-5"
                />
              </button>
            </a>
          </div>
        )}
      </div>
    </article>
  )
}
