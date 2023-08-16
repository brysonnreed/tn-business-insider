import { validateAndSanitizeInput } from 'lib/sanitizeUserInput'
import styles from 'styles/Form.module.css'

function NameSection({ register, errors }) {
  return (
    <label className="flex flex-col gap-5">
      <div className="flex flex-col">
        <label>
          Business Name{' '}
          <span className="text-lg font-semibold text-red-600">*</span>
        </label>
        <div
          className={`${styles.input_group} ${
            errors.name?.type === 'required' ? 'border-rose-600' : ''
          }`}
        >
          <input
            {...register('name', {
              required: true,
              validate: validateAndSanitizeInput,
            })}
            className={styles.input_text}
            placeholder="Business Name"
            type="text"
            aria-invalid={errors.name ? 'true' : 'false'}
          />
        </div>
        {errors.name?.type == 'validate' && (
          <p className="text-red-500">Invalid characters are not allowed</p>
        )}
      </div>
    </label>
  )
}

export default NameSection
