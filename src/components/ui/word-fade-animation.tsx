import { motion, Variants } from 'framer-motion';

import { cn } from '@/lib/utils/cn';

interface WordFadeInProps {
  words: string;
  className?: string;
  delay?: number;
  variants?: Variants;
}

export default function WordFadeIn({
  words,
  delay = 0.15,
  variants = {
    hidden: { opacity: 0 },
    visible: (i: any) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * delay },
    }),
  },
  className,
}: WordFadeInProps) {
  const _words = words.split(' ');

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className={cn(className, 'inline-block')}
      style={{ width: '100%', whiteSpace: 'normal', wordWrap: 'break-word' }}
    >
      {_words.map((word, i) => (
        <motion.span key={word} variants={variants} custom={i}>
          {word}{' '}
        </motion.span>
      ))}
    </motion.div>
  );
}
