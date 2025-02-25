export interface PollOption {
  id: number;
  option_text: string;
  votes: number;
}

export interface Poll {
  id: number;
  question: string;
  options: PollOption[];
} 