import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from 'react-bootstrap/Toast';

import { axiosInstance } from '../../api/apiConfig'

export default function Register() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [error, setError] = useState({})

    const first_name = useRef()
    const last_name = useRef()
    const email = useRef()
    const wallet_address = useRef()
    const password = useRef()
    const password2 = useRef(undefined)


    async function onSubmitForm(event) {
        event.preventDefault()
        const data = {
            first_name: first_name.current.value,
            last_name: last_name.current.value,
            email: email.current.value,
            wallet_address: wallet_address.current.value,
            password: password.current.value,
            password2: password2.current.value
        };

        setLoading(true)

        try {
            await axiosInstance.post('auth/register', JSON.stringify(data))

            setLoading(false)

            navigate('/auth/login')
        } catch (error) {
            setError(error?.response?.data)
            setShow(true)
            setLoading(false)
        }
    }

    return (
        <>
        <div className='container'>
            <h2>Register</h2>
            <form onSubmit={onSubmitForm}>
                <div className="mb-3">
                    <input type="text" placeholder='First Name' autoComplete='off' className='form-control' id='first_name' ref={first_name} />
                </div>
                <div className="mb-3">
                    <input type="text" placeholder='Last Name' autoComplete='off' className='form-control' id='last_name' ref={last_name} />
                </div>
                <div className="mb-3">
                    <input type="email" placeholder='Email' autoComplete='off' className='form-control' id="email" ref={email} />
                </div>
                <div className="mb-3">
                    <input type="text" placeholder='Wallet Address' autoComplete='off' className='form-control' id="wallet" ref={wallet_address} />
                </div>
                <div className="mb-3">
                    <input type="password" placeholder='Password' autoComplete='off' className='form-control' id="password" ref={password} />
                </div>
                <div className="mb-3">
                    <input type="password" placeholder='Confirm Password' autoComplete='off' className='form-control' id="passwordConfirmation" ref={password2} />
                </div>
                <div className="mb-3">
                    <button disabled={loading} className='btn btn-success' type="submit">Register</button>
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
