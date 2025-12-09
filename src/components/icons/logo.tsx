import { cn } from '@/lib/utils';
import type { SVGProps } from 'react';

export default function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      aria-hidden="true"
      {...props}
      className={cn('fill-current', props.className)}
    >
      <g fontFamily="Playfair Display" fontSize="100" fontWeight="bold">
        <text x="-5" y="85">
          H
        </text>
      </g>
    </svg>
  );
}
