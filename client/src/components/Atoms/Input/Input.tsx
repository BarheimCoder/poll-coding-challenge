import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

type BaseInputProps = {
  label: string;
  type?: string;
  rows?: number;
  id: string;
};

type InputElementProps = InputHTMLAttributes<HTMLInputElement>;
type TextareaElementProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

type InputProps = BaseInputProps & (InputElementProps | TextareaElementProps);

const inputStyles = 'bg-white/80 rounded-md p-2';

export const Input = ({ label, type, ...props }: InputProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={props.id} className='text-left text-lg'>{label}</label>
      {type === 'textarea' ? (
        <textarea {...props as TextareaElementProps} className={inputStyles} />
      ) : (
        <input {...props as InputElementProps} type={type} className={inputStyles} />
      )}
    </div>
  );
};