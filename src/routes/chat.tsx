import { useChat } from '@/client/store/use-chat';
import { useEmail } from '@/client/store/use-email';
import { createFileRoute } from '@tanstack/react-router';
import { useState, type FormEvent } from 'react';
import { z } from 'zod';

export const Route = createFileRoute('/chat')({
  component: Chat,
});

const addUserSchema = z.object({
  email: z.string().email(),
});

function Chat() {
  const { email, updateEmail } = useEmail((state) => state);
  const [localEmail, setLocalEmail] = useState('');
  const { members, addMember } = useChat((state) => state);
  const [error, setError] = useState({ isError: false, message: '' });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(localEmail);

    const res = addUserSchema.safeParse({ email: localEmail });

    if (!res.success) {
      return setError({ isError: true, message: 'Please enter valid email' });
    }

    setError({ isError: false, message: '' });

    const isMember = members.find((member) => member.email === localEmail);

    if (isMember) {
      return setError({ isError: true, message: 'Member already present in the room' });
    }

    setError({ isError: false, message: '' });

    // add member to room
    updateEmail(res.data.email);
    setLocalEmail('');
    addMember({ email: res.data.email, status: 'online' });
  }

  return (
    <main>
      <section>
        <div>
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <br />
            <input className='border' type='text' value={localEmail} onChange={(e) => setLocalEmail(e.target.value)} />
            <br />
            {error.isError && <p className='text-sm text-red-400'>{error.message}</p>}
            <button type='submit'>Add user</button>
          </form>
        </div>
      </section>
      <MembersInRoom />
    </main>
  );
}

function MembersInRoom() {
  const { email } = useEmail((state) => state);
  const { members, updateSelectedMembers, updateMembers } = useChat((state) => state);

  function handleCount(val: string) {
    let count = 0;
    const letters = val.split('@')[0].split('');

    letters.map((letter) => {
      if (['a', 'i', 'e', 'o', 'u'].includes(letter)) {
        count++;
      }
    });

    return count;
  }

  function handleClick() {
    const sortedMembers = members.sort((a, b) => {
      const countBefore = handleCount(a.email);
      const countAfter = handleCount(b.email);

      if (countAfter > countBefore) return 1;

      return -1;
    });

    updateMembers(sortedMembers);
  }

  function handleLongAlgo(val: string) {
    let count = 0;
    let word = '';
    const longestWords = [] as string[];

    const letters = val.split('@')[0].split('');

    letters.map((letter, index) => {
      if (letter === letters[index + 1]) {
        longestWords[count] = word;

        word = '';
        count++;

        return;
      }

      word = word + letter;
      return;
    });

    const longestWordsCount = longestWords.map((val) => val.length);

    return {
      longestWords,
      email: val,
    };
  }

  function handleLongest() {}

  return (
    <section className='bg-blue-200 p-4 my-5'>
      <div>
        {members.length === 0 ? (
          <p>- No Members -</p>
        ) : (
          members.map((member) => (
            <p
              key={member.email}
              className={`${email !== member.email && 'hover:cursor-pointer'}`}
              onClick={() => email !== member.email && updateSelectedMembers({ email: member.email })}
            >
              {member.email}
            </p>
          ))
        )}
      </div>
      <button type='button' onClick={handleClick}>
        Sort via count
      </button>
      <button type='button' onClick={handleLongest}>
        Sort via longest
      </button>
    </section>
  );
}
