import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/cn';

const widths = [
  'w-1/12',
  'w-2/12',
  'w-1/6',
  'w-3/12',
  'w-1/4',
  'w-4/12',
  'w-1/3',
  'w-5/12',
  'w-2/6',
  'w-6/12',
  'w-1/2',
  'w-7/12',
  'w-2/5',
  'w-8/12',
  'w-3/5',
  'w-9/12',
  'w-2/3',
  'w-10/12',
  'w-3/4',
  'w-11/12',
  'w-4/5',
  'w-5/6',
  'w-3/6',
  'w-4/6',
  'w-1/5',
  'w-2/5',
  'w-4/5',
  'w-full',
];

export const ContentLoader = ({
  count = 6,
  height = 4,
  circles = 0,
  circleSize = 12,
  className,
}: {
  count?: number;
  height?: number;
  circles?: number;
  circleSize?: number;
  className?: string;
}) => {
  const fields = Array.from({ length: count }, (_, i) => i);
  const circleFields = Array.from({ length: circles }, (_, i) => i);

  return (
    <div className={cn('flex flex-col gap-5 w-full', className)}>
      <div className="flex items-center gap-5 mb-5">
        {circleFields.map((i) => (
          <Skeleton
            key={`circle-${i}`}
            className={`w-${circleSize} h-${circleSize} rounded-full`}
          />
        ))}
      </div>
      {fields.map((i) => {
        const randomWidth = widths[Math.floor(Math.random() * widths.length)];
        return <Skeleton key={i} className={`${randomWidth} h-${height}`} />;
      })}
    </div>
  );
};
