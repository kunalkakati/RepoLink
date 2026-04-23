import React from 'react'
import useAuthStore from '@/store/AuthStore'


const AuthFrom = () => {
    const [password, setPassword] = React.useState('');
    const {Authenticate} = useAuthStore();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }
    const CheckPass = (e: React.FormEvent<HTMLFormElement>) => {
        if(password === process.env.PASSWORD){
            // do something
            Authenticate();
        }
        e.preventDefault();
    }
  return (
    <div>
        <div>
            <form onSubmit={CheckPass}>
                <input onChange={handleChange} type="text" />
                <button type="submit">Submit</button>
            </form>
        </div>
    </div>
  )
}

export default AuthFrom