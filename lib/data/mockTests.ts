export type Question = {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
};

export type MockTest = {
  id: string;
  title: string;
  subject: string;
  exam: string;
  durationMinutes: number;
  totalQuestions: number;
  questions: Question[];
};

export const mockTests: MockTest[] = [
  {
    id: 't1',
    title: 'JEE Main Physics Full Mock',
    subject: 'Physics',
    exam: 'JEE Main',
    durationMinutes: 60,
    totalQuestions: 5,
    questions: [
      {
        id: 'q1',
        text: 'A particle moves with uniform acceleration. Which of the following quantities remains constant?',
        options: ['Velocity', 'Speed', 'Acceleration', 'Displacement'],
        correctAnswerIndex: 2
      },
      {
        id: 'q2',
        text: 'The work done by a conservative force along a closed path is:',
        options: ['Always positive', 'Always negative', 'Zero', 'Depends on the path'],
        correctAnswerIndex: 2
      },
      {
        id: 'q3',
        text: 'In an AC circuit, the power factor is maximum when the circuit is:',
        options: ['Purely resistive', 'Purely inductive', 'Purely capacitive', 'LCR series'],
        correctAnswerIndex: 0
      },
      {
        id: 'q4',
        text: 'Which phenomenon confirms the transverse nature of light waves?',
        options: ['Interference', 'Diffraction', 'Polarization', 'Refraction'],
        correctAnswerIndex: 2
      },
      {
        id: 'q5',
        text: 'The half-life of a radioactive substance is 10 days. The time taken for 3/4th of the substance to decay is:',
        options: ['10 days', '20 days', '30 days', '40 days'],
        correctAnswerIndex: 1
      }
    ]
  },
  {
    id: 't2',
    title: 'NEET Biology Rapid Fire',
    subject: 'Biology',
    exam: 'NEET',
    durationMinutes: 30,
    totalQuestions: 3,
    questions: [
      {
        id: 'q1',
        text: 'Which cell organelle is known as the powerhouse of the cell?',
        options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Golgi apparatus'],
        correctAnswerIndex: 1
      },
      {
        id: 'q2',
        text: 'The process of conversion of atmospheric nitrogen to ammonia is called:',
        options: ['Ammonification', 'Nitrification', 'Nitrogen fixation', 'Denitrification'],
        correctAnswerIndex: 2
      },
      {
        id: 'q3',
        text: 'Which hormone is responsible for the regulation of blood sugar levels?',
        options: ['Thyroxine', 'Insulin', 'Adrenaline', 'Glucagon'],
        correctAnswerIndex: 1
      }
    ]
  }
];
