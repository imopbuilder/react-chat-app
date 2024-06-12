import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';

export const Route = createFileRoute('/auth/login')({
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    console.log(email, phone);
    navigate({ to: '/auth/verify-otp' });
  }

  return (
    <section>
      <div>
        <div className='space-x-4'>
          <button type='button' onClick={() => setTab('email')}>
            Email
          </button>
          <button type='button' onClick={() => setTab('phone')}>
            Phone
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {tab === 'email' ? (
            <div>
              <label htmlFor='email'>Email</label>
              <br />
              <input className='border' type='email' name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          ) : (
            <div>
              <label htmlFor='email'>Phone</label>
              <br />
              <input className='border' type='number' name='phone' id='phone' value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          )}
          <button type='submit'>Login</button>
        </form>
      </div>
    </section>
  );
}
