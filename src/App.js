import React from 'react';
import PollForm from './components/PollForm';

const pollSteps = [
  {
    title: 'How was your week overall?',
    options: [
      { icon: '/assets/like.png', label: 'Great' },
      { icon: '/assets/smile.png', label: 'Good' },
      { icon: '/assets/dislike.png', label: 'Not so great' },
    ],
  },
  {
    title: 'How satisfied are you with your productivity?',
    options: [
      { icon: '/assets/like.png', label: 'Very satisfied' },
      { icon: '/assets/smile.png', label: 'Somewhat satisfied' },
      { icon: '/assets/dislike.png', label: 'Not satisfied' },
    ],
  },
  {
    title: 'What describes your mood the best?',
    options: [
      { icon: '/assets/like.png', label: 'Happy' },
      { icon: '/assets/smile.png', label: 'Neutral' },
      { icon: '/assets/dislike.png', label: 'Sad' },
    ],
  },
];
;

const App = () => {
  return (
    <div className="App">
      <PollForm steps={pollSteps} />
    </div>
  );
};

export default App;
