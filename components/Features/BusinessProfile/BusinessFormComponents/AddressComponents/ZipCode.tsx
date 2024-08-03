import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { validateAndSanitizeInput } from 'lib/sanitizeUserInput'
import styles from 'styles/Form.module.css'
function ZipCode({ register, errors }) {
  return (
    <label className="flex flex-col gap-5">
      <div className="flex flex-col">
        <label>Zip Code</label>
        <div className={`${styles.input_group}`}>
          <input
            {...register('zipCode', {
              required: false,
              validate: validateAndSanitizeInput,
            })}
            className={styles.input_text}
            placeholder="Zip Code"
            type="text"
          />
        </div>
        {errors.zipCode?.type == 'validate' && (
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
      </div>
    </label>
  )
}

export default ZipCode
