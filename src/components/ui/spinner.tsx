import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils/cn';

interface SpinnerProps extends React.HTMLProps<SVGSVGElement> {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  isSpinning?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 20,
  className,
  style,
  color,
  isSpinning = true,
  ...rest
}) => {
  const spinnerStyle: React.CSSProperties = {
    height: size,
    width: size,
    ...style,
  };
  const spinnerColor = color || 'primary';
  const spinnerClass = cn(
    isSpinning && 'animate-spin',
    spinnerColor && `text-${spinnerColor}`,
    className
  );

  return (
    <Loader2
      size={size}
      style={spinnerStyle}
      className={spinnerClass}
      {...rest}
    />
  );
};
