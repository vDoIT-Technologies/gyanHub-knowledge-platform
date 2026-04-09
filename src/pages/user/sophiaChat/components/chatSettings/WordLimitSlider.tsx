import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils/cn';

type SliderProps = React.ComponentProps<typeof Slider>;

export default function WordLimitSlider({
  wordLimit,
  setWordLimit,
  className,
  ...props
}: SliderProps & {
  wordLimit: number;
  setWordLimit: (value: number) => void;
}) {
  const max = 100;

  return (
    <div className="relative w-full">
      {/* Slider component */}
      <Slider
        value={[wordLimit]}
        onValueChange={(newValue) => setWordLimit(newValue[0])} 
        max={max}
        step={1}
        min={10}
        className={cn('w-full', className)} 
        {...props}
      />

      {/* Word limit display */}
      <div
        className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-primary text-white px-2 py-1 rounded"
        style={{ left: `${(wordLimit / max) * 100}%` }}
      >
        {wordLimit >= max ? `${max}+` : wordLimit}
      </div>

      {/* Labels for slider */}
      <div className="absolute top-full flex justify-between w-full mt-2 text-xs text-white">
        <span>10</span>
        <span className='mr-8 md:mr-10'>50</span>
        <span>{`${max}+`}</span>
      </div>
    </div>
  );
}
