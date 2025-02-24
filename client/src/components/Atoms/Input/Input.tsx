import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input = ({ label, ...props }: InputProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={props.id} className='text-left text-lg'>{label}</label>
      <input {...props} className='border-2 border-gray-300 rounded-md p-2' />
    </div>
  );
};