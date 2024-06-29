import { useEmail } from '@/client/store/use-email';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { Fragment } from 'react/jsx-runtime';

export const Route = createRootRoute({
  component: () => {
    const email = useEmail((state) => state.email);

    return (
      <Fragment>
        <div className='p-2 flex gap-2'>
          <Link to='/' className='[&.active]:font-bold'>
            Home
          </Link>{' '}
          <Link to='/about' className='[&.active]:font-bold'>
            About
          </Link>
          {email.length > 0 && <Link to='/messages'>Me: {email}</Link>}
        </div>
        <hr />
        <Outlet />
      </Fragment>
    );
  },
});
