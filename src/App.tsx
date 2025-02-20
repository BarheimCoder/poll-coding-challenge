import Button from './components/Atoms/Button/Button';

function App() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container text-center py-8 px-4 rounded-lg bg-white/20 md:w-1/3">
        <h1>Take part in the vote!</h1>
        <div className="flex flex-col gap-4 my-4">
          <Button type="button">Click here</Button>
          <Button type="button">Click here</Button>
          <Button type="button">Click here</Button>
          <Button type="button">Click here</Button>
          <Button type="submit">Vote</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
