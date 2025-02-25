import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  result?: string;
  showResult?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

function Button({
  children,
  type,
  result,
  showResult,
  isSelected,
  onSelect,
  ...props
}: ButtonProps) {
  const buttonStyles: string[] = [
    'relative',
    'border-4 rounded-lg backdrop:blur-lg',
    'px-12 py-4',
    'font-semibold',
    'transition duration-200',
    'hover:cursor-pointer',
    'focus:cursor-pointer',
    showResult
      ? 'bg-no-repeat bg-left bg-gradient-to-r from-indigo-500 to-pink-500'
      : '',
    type === 'submit'
      ? 'bg-white hover:bg-white/40 uppercase opacity-100 flex justify-center items-center gap-4'
      : 'bg-white/30 hover:bg-white focus:bg-white/40',
    isSelected
      ? 'border-purple-500 active:border-purple-500 hover:border-purple-500 focus:border-purple-500'
      : 'border-white  hover:border-white focus:border-white',
    isSelected && showResult
      ? 'scale-105 animate-bounce'
      : 'hover:opacity:100 hover:scale-105',
  ];

  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <button
      className={buttonStyles.join(' ')}
      style={{ backgroundSize: result }}
      type={type}
      disabled={showResult}
      onClick={handleClick}
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
