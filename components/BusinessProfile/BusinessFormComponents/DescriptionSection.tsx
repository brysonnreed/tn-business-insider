import { validateAndSanitizeInput } from 'lib/sanitizeUserInput'
import styles from 'styles/Form.module.css'

function DescriptionSection({ register, errors }) {
  return (
    <label className="flex flex-col gap-5">
      <div className="flex flex-col">
        <label>
          Business Description
          <span className="text-lg font-semibold text-red-600"> *</span>
        </label>
        <div
          className={`${styles.input_group} ${
            errors.description?.type === 'required' ||
            errors.description?.type == 'minLength'
              ? 'border-rose-600'
              : ''
          }`}
        >
          <textarea
            {...register('description', {
              required: true,
              minLength: {
                value: 5,
              },
              validate: validateAndSanitizeInput,
            })}
            aria-invalid={errors.description ? 'true' : 'false'}
            className={styles.input_text}
            placeholder="Enter a description of your business"
            rows={8}
            maxLength={1200}
          />
        </div>
        {errors.description?.type == 'validate' && (
          <p className="text-red-500">Invalid characters are not allowed</p>
        )}
      </div>
    </label>
  )
}

export default DescriptionSection
