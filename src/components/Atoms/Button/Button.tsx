import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  result?: string;
}

function Button({ children, type, result, ...props }: ButtonProps) {
  const buttonStyles: string[] = [
    'relative',
    'border-4 border-white rounded-lg backdrop:blur-lg',
    'px-12 py-4',
    'font-semibold',
    'transition duration-200',
    'hover:cursor-pointer hover:border-white',
    'focus:cursor-pointer focus:border-white',
    result
      ? 'bg-no-repeat bg-left bg-gradient-to-r from-indigo-500 to-pink-500'
      : '',
    type === 'submit'
      ? 'bg-white hover:bg-white/40 uppercase'
      : 'bg-white/30 hover:bg-white focus:bg-white/40',
  ];

  return (
    <button
      className={buttonStyles.join(' ')}
      style={{ backgroundSize: result }}
      type={type}
      {...props}
    >
      {children}

      {result && (
        <div className="absolute right-0 top-0 h-full font-bold p-2 flex items-center bg-gradient-to-l from-white/80 via-white/70 via-50% to-transparent to-100%">
          {result}
        </div>
      )}
    </button>
  );
}

export default Button;
