import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast'

import { axiosInstance } from '../../api/apiConfig'
import useAuth from '../../hooks/useAuth'

export default function Login() {

    const { setAccessToken, setCSRFToken, setIsLoggedIn } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const fromLocation = location?.state?.from?.pathname || '/'
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [show, setShow] = useState(false)
    const [error, setError] = useState({})

    function onEmailChange(event) {
        setEmail(event.target.value)
    }

    function onPasswordChange(event) {
        setPassword(event.target.value)
    }

    async function onSubmitForm(event) {
        event.preventDefault()

        setLoading(true)

        try {
            const response = await axiosInstance.post('auth/login', JSON.stringify({
                email,
                password
            }))

            setAccessToken(response?.data?.access_token)
            setCSRFToken(response.headers["x-csrftoken"])
            setIsLoggedIn(true);
            setEmail()
            setPassword()
            setLoading(false)

            navigate('/hello_world')
            // navigate(fromLocation, { replace: true })
        } catch (error) {
            setLoading(false)
            setShow(true)
            setError(error?.response?.data)
        }
    }

    return (
        <>
        <div className='container'>
            <h2>Login</h2>
            <form onSubmit={onSubmitForm}>
                <div className="mb-3">
                    <input type="email" placeholder='Email' autoComplete='off' className='form-control' id="email" onChange={onEmailChange} />
                </div>
                <div className="mb-3">
                    <input type="password" placeholder='Password' autoComplete='off' className='form-control' id="password" onChange={onPasswordChange} />
                </div>
                <div className="mb-3">
                    <button disabled={loading} className='btn btn-success' type="submit">Login</button>
                </div>
            </form>
        </div>
        <Toast className="position-fixed top-0 end-0 m-3" onClose={() => setShow(false)} show={show} delay={3000} autohide>
            <Toast.Header>
                <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                />
            <strong className="me-auto">Message</strong>
            </Toast.Header>
            <Toast.Body>
                {Object.entries(error)?.map(([key, value]) => (
                    <div key={key}>
                        {key?.replace(/_/g, ' ')?.replace(/\b\w/g, char => char.toUpperCase())} {value?.toString()?.replace(/^This field\s+/, '')}
                    </div>
                ))}
            </Toast.Body>
        </Toast>
        </>
    )
}
