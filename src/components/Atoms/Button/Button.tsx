import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function Button({ children, type, ...props }: ButtonProps) {
  const buttonStyles: string[] = [
    'border-4 border-white rounded-lg backdrop:blur-lg',
    'px-6 py-4',
    'transition duration-200',
    'hover:cursor-pointer hover:border-white',
    'focus:cursor-pointer focus:border-white',
    type === 'submit'
      ? 'bg-white hover:bg-white/40 uppercase'
      : 'bg-white/30 hover:bg-white focus:bg-white/40',
  ];

  return (
    <button className={buttonStyles.join(' ')} type={type} {...props}>
      {children}
    </button>
  );
}

export default Button;
