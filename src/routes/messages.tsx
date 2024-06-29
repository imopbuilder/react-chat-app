import { useChat } from '@/client/store/use-chat';
import { useEmail } from '@/client/store/use-email';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/messages')({
  component: Messages,
});

function Messages() {
  return (
    <div className='flex items-start justify-start'>
      <MemberStatus />
      <ChatBox />
    </div>
  );
}

function MemberStatus() {
  const { email } = useEmail((state) => state);
  const { members, updateMembers } = useChat((state) => state);

  const isMember = members.find((member) => member.email === email);

  if (!isMember) return <p className='w-full bg-red-200'>No members</p>;

  function handleStatus() {
    const membersWithoutUser = members.filter((member) => member.email !== email);
    updateMembers([...membersWithoutUser, { email, status: isMember?.status === 'offline' ? 'online' : 'offline' }]);
  }

  return (
    <section className='w-full bg-red-200'>
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

function ChatBox() {
  const [message, setMessage] = useState('');
  const { email } = useEmail((state) => state);
  const { chat, selectedMembers, updateMembers, members } = useChat((state) => state);

  function handleClick() {
    console.log(message, selectedMembers);

    const sender = chat.filter((member) => member.email === email);
    console.log(sender);
    // const to = members.find((member) => member.email === selectedMembers?.email);

    // updateMembers([...filteredMembers, {email, messages}])
  }

  return (
    <section className='w-full'>
      <div>
        <input type='text' className='border' value={message} onChange={(e) => setMessage(e.target.value)} /> <br />
        <button type='button' onClick={handleClick}>
          Send
        </button>
      </div>
    </section>
  );
}
