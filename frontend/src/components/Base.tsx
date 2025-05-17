import React, { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

interface BaseProps {
  children: ReactNode;
}

function Base({ children }: BaseProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
        <main className="flex-grow">
            {children}
        </main>
      <Footer />
    </div>
  );
}

export default Base;
