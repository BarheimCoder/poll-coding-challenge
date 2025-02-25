import { render, screen, fireEvent } from '@testing-library/react';
import { PollContainer } from './PollContainer';

const mockPoll = {
  id: 1,
  question: 'Test question?',
  options: [
    { id: 1, option_text: 'Option 1', votes: 0 },
    { id: 2, option_text: 'Option 2', votes: 0 },
  ],
};

describe('PollContainer', () => {
  const defaultProps = {
    poll: mockPoll,
    selectedOption: null,
    showResult: false,
    onOptionSelect: jest.fn(),
    onVote: jest.fn(),
    isVoting: false,
  };

  it('renders poll question', () => {
    render(<PollContainer {...defaultProps} />);
    expect(screen.getByText('Test question?')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<PollContainer {...defaultProps} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('calls onOptionSelect when option is clicked', () => {
    render(<PollContainer {...defaultProps} />);
    fireEvent.click(screen.getByText('Option 1'));
    expect(defaultProps.onOptionSelect).toHaveBeenCalledWith(1);
  });

  it('disables vote button when no option is selected', () => {
    render(<PollContainer {...defaultProps} />);
    expect(screen.getByText('Vote')).toBeDisabled();
  });
}); 