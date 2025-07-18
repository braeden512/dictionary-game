import { Copyright } from 'lucide-react';

function Footer() {
  return (
    <footer className="mt-0 border-t border-[#c4c7ca] shadow-md bg-white text-center py-1 dark:bg-[#353738] dark:border-[#56585a]">
      <p className="flex justify-center items-center gap-1 text-sm text-[#353738] dark:text-white">
        All rights reserved <Copyright className="w-5 h-5" /> 2025 Dictionary Game.
      </p>
    </footer>
  );
}

export default Footer;
