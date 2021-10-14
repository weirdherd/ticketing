import axios from 'axios'
import { useState } from 'react'

const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null)

  const doRequest = async (props = {}) => {
    try {
      setErrors(null)
      const response = await axios[method](url, 
        { ...body, ...props }   // merge the body and the props
      )

      if (onSuccess) {
        onSuccess(response.data)
      }

      return response.data
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>呜……</h4>
          <ul className="my-p">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      )
    }
  }

  return { doRequest, errors } // follows React convention of hooks
}

export default useRequest
