import React from 'react'

export interface TechStacks {
  name: string
  img: string
}

export function Stacks ({ stacks }: { stacks: TechStacks[] }): JSX.Element {
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {stacks.map((stack, index) => (
        <div
          key={index}
          className="group relative flex flex-col items-center"
        >
          <img
            src={stack.img}
            className="w-10 h-10 opacity-50 group-hover:opacity-80 transition-opacity duration-300"
            alt={stack.name}
          />
          <span className="mt-1.5 text-xs text-warm-500 dark:text-warm-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {stack.name}
          </span>
        </div>
      ))}
    </div>
  )
}
