import React, { ButtonHTMLAttributes, useState } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  result?: string;
  showResult?: boolean;
}

function Button({ children, type, result, showResult, ...props }: ButtonProps) {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  const buttonStyles: string[] = [
    'relative',
    'border-4 border-transparent rounded-lg backdrop:blur-lg',
    'px-12 py-4',
    'font-semibold',
    'transition duration-200',
    'hover:cursor-pointer hover:border-white',
    'focus:cursor-pointer focus:border-white',
    isSelected
      ? 'border-yellow-500 active:border-yellow-500 focus:border-yellow-500 animate-pulse'
      : 'border-white ',
    showResult
      ? 'bg-no-repeat bg-left bg-gradient-to-r from-indigo-500 to-pink-500'
      : '',
    type === 'submit'
      ? 'bg-white hover:bg-white/40 uppercase'
      : 'bg-white/30 hover:bg-white focus:bg-white/40',
  ];

  const handleClick = () => {
    setIsSelected(true);
    console.log('beep');
  };

  return (
    <button
      className={buttonStyles.join(' ')}
      style={{ backgroundSize: result }}
      type={type}
      onClick={() => handleClick()}
      {...props}
    >
      {children}

      {showResult && (
        <div className="absolute transition duration-200 right-0 top-0 h-full font-bold p-2 flex items-center bg-gradient-to-l from-white/80 via-white/70 via-50% to-transparent to-100%">
          {result}
        </div>
      )}
    </button>
  );
}

export default Button;
