import React from 'react';
import NavBar from './NavBar';

const Layout: React.FC<React.PropsWithChildren> = ({ children }) => (
  <>
    <NavBar />
    {children}
  </>
);

export default Layout;
