// import sophia from "@/assets/images/sophia-auth.svg";
import { useEffect, useRef } from "react";
import Typed from "typed.js";

function AuthSectionImage() {
  const typedRef = useRef(null);
  useEffect(() => {
    const options = {
      strings: [
        'Hello! I’m Sunita Gupta <br><span style="font-size: 1.4rem; font-weight: 400; color:#78716c ">Your AI Teacher</span>',
      ],
      typeSpeed: 60,
      startDelay: 600,
      showCursor: false,
    };

    const typed = new Typed(typedRef.current, options);
    return () => typed.destroy();
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col justify-center items-center max-w-xl gap-6 sm:gap-8 w-full text-center">
        <img src={'/img/teachers.png'} alt="sophia" className="w-1/3 min-w-[120px] lg:w-2/3 max-w-[220px] lg:max-w-none shadow-2xl rounded-2xl" />
        <h1
          className="tracking-wide text-2xl sm:text-3xl md:text-4xl h-[120px] sm:h-[140px] px-2"
          ref={typedRef}
        ></h1>
      </div>
    </div>
  );
}

export default AuthSectionImage;
