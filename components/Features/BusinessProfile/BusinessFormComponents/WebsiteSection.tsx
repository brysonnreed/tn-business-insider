import { sanitizeURL } from 'lib/sanitizeUserInput'
import styles from 'styles/Form.module.css'

function WebsiteSection({ register, errors }) {
  return (
    <label className="flex flex-col gap-5">
      <div className="flex flex-col">
        <label className="mb-2 text-lg font-bold">Website</label>
        <div
          className={`${styles.input_group} ${
            errors.website?.type === 'validate' ? 'border-rose-600' : ''
          }`}
        >
          <input
            {...register('website', {
              required: false,
              validate: (value) =>
                sanitizeURL(value) || 'Invalid or unsafe URL',
            })}
            className={styles.input_text}
            placeholder="Website Link"
            type="url"
          />
        </div>
      </div>
      {errors.website?.type === 'validate' && (
        <p className="text-red-500">Invalid or unsafe URL</p>
      )}
    </label>
  )
}

export default WebsiteSection
