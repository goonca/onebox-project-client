import { Outlet, Link, Navigate } from 'react-router-dom';

const Layout = () => {
  const path = new URLSearchParams(window.location.search).get('path');
  path && Navigate({ to: '/dashboard/' + path });

  return (
    <>
      <nav>
        ss
        <ul>
          <li>
            <Link to="/dashboard">Home</Link>
          </li>
          <li>
            <Link to="/dashboard/profile">profile</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
};

export default Layout;
