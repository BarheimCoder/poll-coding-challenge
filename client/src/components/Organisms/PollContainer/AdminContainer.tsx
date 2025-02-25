const AdminContainer = ({title, children, onSubmit}: {title: string, children: React.ReactNode, onSubmit: (e: React.FormEvent) => void }) => {  
  return (
    <div className="border rounded-lg p-4 md:w-[49%]">
      <h2 className='text-2xl mb-4'>{title}</h2>
      <form onSubmit={onSubmit} className='flex flex-col gap-4'>
        {children}
      </form>
    </div>
  );
};

export default AdminContainer;
