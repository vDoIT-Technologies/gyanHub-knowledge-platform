const BgGradient = () => {
  return (
    <>
      <span className="fixed w-64 sm:w-96 h-44 -z-50 left-0 top-24 xl:top-0 rounded-full blur-3xl rotate-[38deg] bg-secondary-foreground/5"></span>
      <span className="fixed w-64 sm:w-96 h-32 -z-50 -left-20 sm:-left-10 top-48 xl:top-36 rounded-full blur-[90px] rotate-[10deg] bg-gradient-to-tr from-secondary-foreground/10 to-primary/80"></span>
      <span className="fixed sm:w-44 h-32 -z-50 left-0 top-52 rounded-full blur-3xl rotate-[38deg] bg-secondary-foreground/20"></span>
      <span className="fixed w-64 h-16 -z-50  -right-28 top-0 -bottom-96 sm:bottom-0 my-auto xl:bottom-20 rounded-full blur-[90px] -rotate-[12deg] bg-primary/80"></span>
      <span className="fixed w-64 h-16 -z-50  -right-28 top-0 -bottom-96 sm:bottom-0 my-auto xl:-bottom-44 rounded-full blur-3xl -rotate-[12deg] bg-secondary-foreground/5"></span>
    </>
  );
};

export default BgGradient;
