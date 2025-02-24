const AdminContainer = ({title, children}: {title: string, children: React.ReactNode}) => {  
  return (
    <div className="border rounded-lg p-4 md:w-[49%]">
      <h2 className='text-2xl mb-4'>{title}</h2>
      <form className='flex flex-col gap-4'>
        {children}
      </form>
    </div>
  );
};

export default AdminContainer;
