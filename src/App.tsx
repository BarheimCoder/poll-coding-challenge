import Button from './components/Atoms/Button/Button';

function App() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container text-center py-8 px-4 rounded-lg bg-white/20 md:w-1/3">
        <h1 className="text-4xl mb-12">
          Who is going to win the F1 race? 🏎️🏁
        </h1>
        <div className="flex flex-col gap-4 my-4">
          <Button type="button" result="48%">
            Verstappen
          </Button>
          <Button type="button" result="20%">
            Norris
          </Button>
          <Button type="button" result="68%">
            Alonso
          </Button>
          <Button type="button" result="95%">
            Hamilton
          </Button>
          <Button type="submit">Vote</Button>
        </div>
      </div>
    </div>
  );
}

export default App;
