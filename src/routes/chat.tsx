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
  const { members, addMember } = useChat((state) => state);
  const [error, setError] = useState({ isError: false, message: '' });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = addUserSchema.safeParse({ email });

    if (!res.success) {
      return setError({ isError: true, message: 'Please enter valid email' });
    }

    setError({ isError: false, message: '' });

    const isMember = members.find((member) => member.email === email);

    if (isMember) {
      return setError({ isError: true, message: 'Member already present in the room' });
    }

    setError({ isError: false, message: '' });

    // add member to room
    addMember({ email, status: 'online' });
  }

  return (
    <main>
      <MemberStatus />
      <section>
        <div>
          <form onSubmit={handleSubmit}>
            <label>Email</label>
            <br />
            <input className='border' type='text' value={email} onChange={(e) => updateEmail(e.target.value)} />
            <br />
            {error.isError && <p className='text-sm text-red-400'>{error.message}</p>}
            <button type='submit'>Add user</button>
          </form>
        </div>
      </section>
      <MembersInRoom />
      <ChatBox />
    </main>
  );
}

function MemberStatus() {
  const { email } = useEmail((state) => state);
  const { members, updateMembers } = useChat((state) => state);

  const isMember = members.find((member) => member.email === email);

  if (!isMember) return null;

  function handleStatus() {
    const membersWithoutUser = members.filter((member) => member.email !== email);
    updateMembers([...membersWithoutUser, { email, status: isMember?.status === 'offline' ? 'online' : 'offline' }]);
  }

  return (
    <section>
      <div>
        <p>Status: {isMember.status}</p>
        <div>
          <button type='button' onClick={handleStatus}>
            Mark as {isMember.status === 'offline' ? 'online' : 'offline'}
          </button>
        </div>
      </div>
    </section>
  );
}

function MembersInRoom() {
  const { members, updateSelectedMembers } = useChat((state) => state);

  return (
    <section className='bg-blue-200 p-4 my-5'>
      <div>
        {members.length === 0 ? (
          <p>- No Members -</p>
        ) : (
          members.map((member) => (
            <p key={member.email} className='hover:cursor-pointer' onClick={() => updateSelectedMembers({ email: member.email })}>
              {member.email}
            </p>
          ))
        )}
      </div>
    </section>
  );
}

function ChatBox() {
  const [message, setMessage] = useState('');
  const { email } = useEmail((state) => state);
  const { selectedMembers, updateMembers, members } = useChat((state) => state);

  function handleClick() {
    console.log(message, selectedMembers);

    const filteredMembers = members.filter((member) => member.email !== email || member.email !== selectedMembers?.email);
    const to = members.find((member) => member.email === selectedMembers?.email);

    // updateMembers([...filteredMembers, {email, messages}])
  }

  return (
    <section>
      <div>
        <input type='text' className='border' value={message} onChange={(e) => setMessage(e.target.value)} /> <br />
        <button type='button' onClick={handleClick}>
          Send
        </button>
      </div>
    </section>
  );
}
