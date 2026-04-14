import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 flex flex-col items-center justify-center space-y-4 bg-[#EEEEEE] dark:bg-[#121212] reveal-on-scroll">
      <div className="flex space-x-8 mb-8">
        <Link href="#" className="text-[0.6875rem] tracking-widest uppercase font-bold text-[#747878] dark:text-[#909393] hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors">Instagram</Link>
        <Link href="#" className="text-[0.6875rem] tracking-widest uppercase font-bold text-[#747878] dark:text-[#909393] hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors">Twitter</Link>
        <Link href="#" className="text-[0.6875rem] tracking-widest uppercase font-bold text-[#747878] dark:text-[#909393] hover:text-[#000000] dark:hover:text-[#FFFFFF] transition-colors">Newsletter</Link>
      </div>
      <p className="text-[0.6875rem] tracking-widest uppercase text-[#747878] dark:text-[#909393]">
        © UPPERMOON. ALL RIGHTS RESERVED.
      </p>
    </footer>
  );
}
