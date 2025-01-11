
import type { Transition, Variants } from 'motion/react';
import { motion, useAnimation } from 'motion/react';

export const IconFile = ()=>{

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 11h18v8H3z"></path><path d="M19.5 6h-7.29a.47.47 0 0 1-.35-.15l-1.12-1.12A2.49 2.49 0 0 0 8.97 4H4.51a2.5 2.5 0 0 0-2.5 2.5v11a2.5 2.5 0 0 0 2.5 2.5h15a2.5 2.5 0 0 0 2.5-2.5v-9a2.5 2.5 0 0 0-2.5-2.5Zm-15 0h4.29c.13 0 .26.05.35.15l1.12 1.12c.47.47 1.1.73 1.77.73h7.46c.28 0 .5.22.5.5v1.85a3.45 3.45 0 0 0-1.5-.35H5.5c-.54 0-1.04.13-1.5.35V6.5c0-.28.22-.5.5-.5ZM20 17.5a.5.5 0 0 1-.5.5h-15a.5.5 0 0 1-.5-.5v-4c0-.83.67-1.5 1.5-1.5h13c.83 0 1.5.67 1.5 1.5v4Z"></path><path d="M4.41 10h15.17c.87 0 1.7.25 2.41.72V8.5a2.5 2.5 0 0 0-2.5-2.5H12.2a.47.47 0 0 1-.35-.15l-1.12-1.12A2.49 2.49 0 0 0 8.96 4H4.5A2.5 2.5 0 0 0 2 6.5v4.22A4.34 4.34 0 0 1 4.41 10ZM19.59 12H4.41a2.43 2.43 0 0 0-2.42 2.42v3.09a2.5 2.5 0 0 0 2.5 2.5h15a2.5 2.5 0 0 0 2.5-2.5v-3.09A2.43 2.43 0 0 0 19.57 12Z"></path></svg>
    )
}

'use client';



const transition: Transition = {
  duration: 0.3,
  opacity: { delay: 0.15 },
};

const variants: Variants = {
  normal: {
    pathLength: 1,
    opacity: 0.5,
  },
  animate: {
    pathLength: [0, 1],
    opacity: [1, 0.5],
    transition: {
      ...transition,
      delay: 0.1,
    },
  },
};

// 54.218.239.29

export const IconWebhook = ({width, height}: {width: number; height: number}) => {
  const controls = useAnimation();

  return (
    <div
      className="cursor-pointer select-none p-2 rounded-md transition-colors duration-200 flex items-center justify-center"
      onMouseEnter={() => controls.start('animate')}
      onMouseLeave={() => controls.start('normal')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={width||28}
        height={height||28}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"
          variants={variants}
          animate={controls}
          stroke={'rgba(211, 47, 47, 0.8)'}
        />
        <motion.path
          d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"
          variants={variants}
          animate={controls}
          stroke={'rgba(25, 118, 210, 0.8)'}
        />
        <motion.path
          d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8"
          variants={variants}
          animate={controls}
          stroke={'rgba(251, 192, 45, 0.8)'}
        />
      </svg>
    </div>
  );
};

