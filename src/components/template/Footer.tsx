import { FaLinkedin, FaTelegram, FaTwitterSquare } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-stone-900/70 border-none h-12 text-white flex md:flex-row flex-col-reverse justify-center items-center text-sm md:justify-between px-4 sm:px-6 md:px-8 py-2 border-t">
      <p>{new Date().getFullYear()} GyaanHub Incorporated</p>
      <div className="flex gap-4 items-center justify-center">
        {/* <a target="_blank" href="https://twitter.com" rel="noreferrer">
          <FaTwitterSquare size={18} className="text-muted-foreground" />
        </a>
        <a target="_blank" rel="noreferrer" href="https://www.linkedin.com">
          <FaLinkedin size={18} className="text-muted-foreground" />
        </a>
        <a target="_blank" href="https://t.me" rel="noreferrer">
          <FaTelegram size={18} className="text-muted-foreground" />
        </a> */}
        <a href="#">Privacy policy</a>
        <a href="#">Terms & Condition</a>
      </div>
    </footer>
  );
};
