import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { validateAndSanitizeInput } from 'lib/sanitizeUserInput'
import styles from 'styles/Form.module.css'

function DescriptionSection({ register, errors }) {
  return (
    <label className="flex flex-col gap-5">
      <div className="flex flex-col">
        <label className="mb-2 text-lg font-bold">
          Business Description
          <span className="text-lg font-semibold text-red-600"> *</span>
        </label>
        <div
          className={`${styles.input_group} ${
            errors.description?.type === 'required' ||
            errors.description?.type == 'validate'
              ? 'border-rose-600'
              : ''
          }`}
        >
          <textarea
            {...register('description', {
              required: true,
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
          <div className="mt-2 flex items-center gap-2">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="h-4 w-4 text-red-500"
            />
            <p className="text-sm text-red-500">
              Invalid characters are not allowed
            </p>
          </div>
        )}
        {errors.description?.type === 'required' && (
          <div className="mt-2 flex items-center gap-2">
            <FontAwesomeIcon
              icon={faExclamationCircle}
              className="h-4 w-4 text-red-500"
            />
            <p className="text-sm text-red-500">
              Business description is required
            </p>
          </div>
        )}
      </div>
    </label>
  )
}

export default DescriptionSection
