import styles from 'styles/Hours.module.css'

const BusinessHoursSection = ({
  open247,
  setOpen247,
  businessHours,
  handleHoursChange,
  handleIsOpenChange,
}) => {
  const daysOfWeek = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ]
  // Function to generate times in 15 minute intervals
  const generateTimes = (start, end) => {
    let times = []
    let current = start
    while (current < end) {
      let hour = Math.floor(current)
      let minutes = (current - hour) * 60
      let displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      let displayMinutes = minutes < 10 ? `0${minutes}` : minutes
      let ampm = hour < 12 || hour === 24 ? 'AM' : 'PM'
      let displayTime = `${displayHour}:${displayMinutes} ${ampm}`
      times.push(displayTime)
      current += 0.25 // Adding 15 mins
    }
    return times
  }

  // Generate times in 15 minute intervals from 00:00 to 24:00
  const times = generateTimes(0, 24)
  return (
    <div>
      <div className="flex flex-col justify-between sm:flex-row">
        <div>
          <label className="mb-2 text-lg font-bold">Business Hours</label>
          <p className="mb-4">
            Please select the days your business is open and specify the opening
            and closing times:
          </p>
        </div>
        <div className="mb-4 flex flex-col justify-start border-b pb-2 sm:mb-0 sm:flex-row sm:items-center sm:border-b-0 ">
          <div className="flex justify-between">
            <label htmlFor="open-24-7" className="w-28 font-medium capitalize">
              Open 24/7
            </label>
            <label className={`switch`}>
              <input
                type="checkbox"
                id="open-24-7"
                className="mr-2"
                checked={open247}
                onChange={(e) => setOpen247(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      {!open247 &&
        daysOfWeek.map((day) => (
          <div
            key={day}
            className="mb-4 flex flex-col justify-start sm:flex-row sm:items-center "
          >
            <div className="flex justify-between">
              <label
                htmlFor={`${day}-checkbox`}
                className="w-28 font-medium capitalize"
              >
                {day}
              </label>
              <label className={`switch }`}>
                <input
                  type="checkbox"
                  id={`${day}-checkbox`}
                  checked={businessHours[day]?.isOpen || ''}
                  onChange={(e) => handleIsOpenChange(day, e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="flex items-center justify-center">
              {businessHours[day]?.isOpen && (
                <div className="mt-3 flex justify-start space-x-4 sm:ml-4 sm:mt-0 sm:items-center">
                  <div className={`relative`}>
                    <select
                      id={`${day}-open`}
                      value={businessHours[day]?.open || ''}
                      onChange={(e) =>
                        handleHoursChange(day, 'open', e.target.value)
                      }
                      className={` rounded-md border px-3 py-2 ${styles.selectInput}`}
                    >
                      {times.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex flex-row items-center justify-center">
                    <p className="mr-4 hidden text-lg xs:block">to</p>

                    <select
                      id={`${day}-close`}
                      value={businessHours[day]?.close || ''}
                      onChange={(e) =>
                        handleHoursChange(day, 'close', e.target.value)
                      }
                      className={`rounded-md border px-3 py-2 ${styles.selectInput}`}
                    >
                      {times.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  )
}

export default BusinessHoursSection
