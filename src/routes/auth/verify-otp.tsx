import { createFileRoute } from '@tanstack/react-router';
import { useState, type ChangeEvent } from 'react';

export const Route = createFileRoute('/auth/verify-otp')({
  component: VerifyOtp,
});

function VerifyOtp() {
  const [optLength, setOtpLength] = useState(6);
  const [otp, setOtp] = useState<string[]>(Array.from({ length: optLength }));
  const [error, setError] = useState<{ isError: boolean; index: number[] }>({ isError: false, index: [] });

  function handleChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const value = e.target.value;
    console.log(value);

    if (Number.isNaN(Number(value))) {
      setError((curr) => ({ isError: true, index: [...curr.index, index] }));
    }

    setOtp((curr) => curr.map((val, i) => (i === index ? value : val)));

    const inputElement = document.querySelector(`.otp-input-${value === '' ? index - 1 : index + 1}`) as HTMLInputElement | null;

    if (!inputElement) return;

    // change focus to next input element
    inputElement.focus();
  }

  return (
    <div className='space-x-4 p-3'>
      {otp.map((_, index) => {
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <input key={index} className={`border size-10 p-1 otp-input-${index}`} value={otp[index] ?? ''} onChange={(e) => handleChange(e, index)} />
        );
      })}

      {error.isError && <p className='text-red-400'>Only numebers are allowed in OTP</p>}
    </div>
  );
}
