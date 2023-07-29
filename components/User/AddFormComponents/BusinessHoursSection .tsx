import React from 'react'

const BusinessHoursSection = ({
  open247,
  setOpen247,
  businessHours,
  setBusinessHours,
  handleHoursChange,
  handleIsOpenChange,
  times,
  daysOfWeek,
}) => {
  return (
    <div>
      <label className="mb-2 text-lg font-bold">Business Hours</label>
      <p className="mb-4">
        Please select the days your business is open and specify the opening and
        closing times:
      </p>

      <div className="mb-4">
        <input
          type="checkbox"
          id="open-24-7"
          className="mr-2"
          checked={open247}
          onChange={(e) => setOpen247(e.target.checked)}
        />
        <label htmlFor="open-24-7" className="font-medium">
          Open 24/7
        </label>
      </div>

      {!open247 &&
        daysOfWeek.map((day) => (
          <div
            key={day}
            className="mb-4 flex flex-col justify-start sm:flex-row sm:items-center "
          >
            <div className="flex justify-between">
              <label htmlFor={`${day}-checkbox`} className="w-28 font-medium">
                {day}
              </label>
              <label className={`switch }`}>
                <input
                  type="checkbox"
                  id={`${day}-checkbox`}
                  checked={businessHours[day]?.isOpen || false}
                  onChange={(e) => handleIsOpenChange(day, e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
            <div className="flex items-center justify-center">
              {businessHours[day]?.isOpen && (
                <div className="mt-3 flex justify-start space-x-4 sm:ml-4 sm:mt-0 sm:items-center">
                  <div className="relative">
                    <label htmlFor={`${day}-open`} className="sr-only">
                      Open:
                    </label>
                    <select
                      id={`${day}-open`}
                      value={businessHours[day]?.open || ''}
                      onChange={(e) =>
                        handleHoursChange(day, 'open', e.target.value)
                      }
                      className="rounded-md border px-3 py-2"
                    >
                      {times.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative flex flex-row items-center justify-center">
                    <p className="mr-4 hidden  text-lg xs:block">to</p>
                    <label htmlFor={`${day}-close`} className="sr-only">
                      Close:
                    </label>
                    <select
                      id={`${day}-close`}
                      value={businessHours[day]?.close || ''}
                      onChange={(e) =>
                        handleHoursChange(day, 'close', e.target.value)
                      }
                      className="rounded-md border px-3 py-2"
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
