import React, { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

interface BaseProps {
  children: ReactNode;
}

function Base({ children }: BaseProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-[#18191a]">
      <Header />
        <main className="flex-grow">
            {children}
        </main>
      <Footer />
    </div>
  );
}

export default Base;
