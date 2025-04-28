import React from 'react';
import Header from './header';

import { ReactNode } from 'react';

function Layout({ children }: { children: ReactNode }) {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main> 
    </div>
  );

}

export default Layout;
