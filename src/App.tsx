import { useState } from 'react';
import Button from './components/Atoms/Button/Button';

function App() {
  const [showResult, setShowResult] = useState<boolean>(false);

  const handleVoteClick = () => {
    setShowResult(true);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container text-center py-8 px-4 rounded-lg bg-white/20 md:w-1/3">
        <h1 className="text-4xl mb-12">
          Who is going to win the F1 race? 🏎️🏁
        </h1>
        <div className="flex flex-col gap-4 my-4">
          <Button type="button" result="48%" showResult={showResult}>
            Verstappen
          </Button>
          <Button type="button" result="20%" showResult={showResult}>
            Norris
          </Button>
          <Button type="button" result="68%" showResult={showResult}>
            Alonso
          </Button>
          <Button type="button" result="95%" showResult={showResult}>
            Hamilton
          </Button>
          <Button type="submit" onClick={handleVoteClick}>
            Vote
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
