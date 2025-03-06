import React from 'react';
import Header from './header';

import { ReactNode } from 'react';

function Layout({ children }: { children: ReactNode }) {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">{children}</main> 
      <footer className="bg-gray-100 text-center p-4">
        &copy; 2025 CowCalculator. All rights reserved.
      </footer>
    </div>
  );

}

export default Layout;
