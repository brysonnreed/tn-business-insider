interface DropdownFilterProps {
  label: string
  options: Option[]
  selectedOption: string
  onChange: (value: string) => void
}

interface Option {
  slug: string
  name: string
}

export default function DropdownFilter({
  label,
  options,
  selectedOption,
  onChange,
}: DropdownFilterProps) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value)
  }

  return (
    <div className="flex flex-col items-center justify-center gap-2 xs:flex-row">
      <label htmlFor={label} className="font-bold">
        {label}:
      </label>
      <select
        id={label}
        value={selectedOption || ''}
        onChange={handleSelectChange}
        className="ml-2 w-full rounded-md border border-gray-300 px-2 py-1"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.slug} value={option.slug}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}
