import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const courses = [
  {
    id: 'course-webdev-101',
    slug: 'modern-web-development-101',
    title: 'Introduction to Modern Web Development',
    description: 'Learn the fundamentals of HTML, CSS, JavaScript, and build your very first fully responsive website from scratch.',
    longDescription: 'This comprehensive course is designed for absolute beginners who want to build a solid foundation in web technologies. We start with the basics of semantic HTML, progress to modern CSS layouts including Flexbox and Grid, explore programming concepts with JavaScript, and deploy a responsive personal project to the web.',
    thumbnail: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    category: 'Development',
    tags: ['HTML', 'CSS', 'JavaScript', 'Web Design'],
    instructor: {
      name: 'Dr. Rajesh Sen',
      avatar: 'RS',
      bio: 'Senior Software Architect and educator with over 15 years of industry experience teaching thousands of students globally.',
      title: 'Senior Developer & Educator'
    },
    price: 0,
    rating: 4.8,
    reviewCount: 340,
    enrolledCount: 1540,
    duration: 180,
    level: 'beginner',
    status: 'published',
    createdAt: new Date().toISOString(),
    whatYoullLearn: [
      'Understand the architecture of the web and client-server relations.',
      'Write clean, accessible semantic HTML5 layouts.',
      'Design modern layouts using CSS Flexbox and Grid.',
      'Apply interactive logic using fundamental JavaScript logic.'
    ],
    requirements: [
      'No programming experience is required.',
      'A computer with a web browser and an internet connection.'
    ],
    curriculum: [
      {
        id: 'webdev-mod-1',
        title: 'Module 1: Document Structure and Layout',
        lessons: [
          {
            id: 'webdev-les-1-1',
            title: 'Welcome to the Web & Modern HTML5',
            type: 'video',
            duration: 15,
            videoUrl: 'https://www.youtube.com/embed/kUMe1FH4CHE',
            content: 'In this lesson, we explore how the internet works, the role of client-server model, and write our first semantic HTML page.',
            resources: [
              { id: 'webdev-res-1-1-1', title: 'Lesson Slides (PDF)', url: '#', type: 'pdf' },
              { id: 'webdev-res-1-1-2', title: 'MDN Semantic Guide', url: 'https://developer.mozilla.org', type: 'link' }
            ]
          },
          {
            id: 'webdev-les-1-2',
            title: 'Styling with CSS Grid and Flexbox',
            type: 'text',
            duration: 25,
            content: 'CSS Flexbox and Grid are layout engines that make aligning web components simple. Flexbox is optimized for one-dimensional layouts, while Grid is suited for two-dimensional grids. Read about CSS selectors, spacing box model, and write layout sheets.',
            resources: []
          }
        ]
      },
      {
        id: 'webdev-mod-2',
        title: 'Module 2: Logic and Interaction',
        lessons: [
          {
            id: 'webdev-les-2-1',
            title: 'Adding Interactive Logic with JavaScript',
            type: 'video',
            duration: 20,
            videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk',
            content: 'Learn javascript variables, types, simple loops, event handlers, and modify Document Object Model elements on button click.',
            resources: []
          },
          {
            id: 'webdev-les-2-2',
            title: 'Web Dev Basics Quiz',
            type: 'quiz',
            duration: 15,
            quiz: {
              id: 'webdev-quiz-1',
              title: 'Module 2 Review Quiz',
              description: 'Assess your knowledge of core HTML structure, CSS layouts, and basic JavaScript interactions.',
              passingScore: 70,
              timeLimitMinutes: 10,
              questions: [
                {
                  id: 'webdev-q-1',
                  question: 'Which CSS layout model is best for a two-dimensional grid of rows and columns?',
                  options: [
                    { id: 'webdev-opt-1-1', text: 'Flexbox' },
                    { id: 'webdev-opt-1-2', text: 'CSS Grid' },
                    { id: 'webdev-opt-1-3', text: 'Table Layout' },
                    { id: 'webdev-opt-1-4', text: 'Position Absolute' }
                  ],
                  correctOptionId: 'webdev-opt-1-2',
                  explanation: 'CSS Grid is designed specifically for two-dimensional grid layouts, offering total control over both rows and columns.'
                },
                {
                  id: 'webdev-q-2',
                  question: 'What is the correct HTML element for inserting a line break?',
                  options: [
                    { id: 'webdev-opt-2-1', text: '<break>' },
                    { id: 'webdev-opt-2-2', text: '<lb>' },
                    { id: 'webdev-opt-2-2-br', text: '<br>' },
                    { id: 'webdev-opt-2-3', text: '<newline>' }
                  ],
                  correctOptionId: 'webdev-opt-2-2-br',
                  explanation: 'The <br> tag is used to produce a line break in a text block.'
                }
              ]
            },
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-ai-102',
    slug: 'mastering-ai-machine-learning',
    title: 'Mastering AI & Machine Learning',
    description: 'Dive deep into supervised learning, neural networks, computer vision, and NLP with real-world project portfolios.',
    longDescription: 'Go from the core math behind classification algorithms to deploying deep learning networks using PyTorch. This intermediate course bridges standard python data analysis with deep learning models, training pipelines, fine-tuning, and model evaluations.',
    thumbnail: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
    category: 'Data Science',
    tags: ['Machine Learning', 'Python', 'PyTorch', 'Neural Networks'],
    instructor: {
      name: 'Prof. Anjali Sharma',
      avatar: 'AS',
      bio: 'Research scientist and PhD holder in Applied Artificial Intelligence. Former machine learning engineer at leading technology research labs.',
      title: 'AI Research Scientist'
    },
    price: 0,
    rating: 4.9,
    reviewCount: 220,
    enrolledCount: 890,
    duration: 320,
    level: 'intermediate',
    status: 'published',
    createdAt: new Date().toISOString(),
    whatYoullLearn: [
      'Implement linear and logistic regression networks from scratch.',
      'Train Convolutional Neural Networks (CNNs) for image recognition.',
      'Build Recurrent Neural Networks and evaluate Transformer models.',
      'Fine-tune pre-trained models and deploy pipelines to web APIs.'
    ],
    requirements: [
      'Basic knowledge of Python syntax and programming logic.',
      'Familiarity with high school mathematics (algebra & simple calculus).'
    ],
    curriculum: [
      {
        id: 'ai-mod-1',
        title: 'Module 1: Machine Learning Core',
        lessons: [
          {
            id: 'ai-les-1-1',
            title: 'Introduction to Supervised Learning Models',
            type: 'video',
            duration: 25,
            videoUrl: 'https://www.youtube.com/embed/tPYj3fFJGjk',
            content: 'Understand prediction models, cost optimization, gradient descent algorithm, and evaluate dataset classifications.',
            resources: []
          },
          {
            id: 'ai-les-1-2',
            title: 'Linear Regression Modeling Assignment',
            type: 'assignment',
            duration: 45,
            assignment: {
              id: 'ai-ass-1-1',
              title: 'Housing Price Predictor Project',
              description: 'Implement a multivariate gradient descent modeling script in Python using numpy to predict housing values from a structured housing dataset.',
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              maxScore: 100,
              submissions: []
            },
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-react-103',
    slug: 'advanced-nextjs-react-architecture',
    title: 'Advanced Next.js & React Architecture',
    description: 'Master server actions, routing optimization, edge runtimes, caching layers, and high-performance server structures.',
    longDescription: 'Elevate your Next.js knowledge. Dive deep into React Server Components (RSC), partial pre-rendering (PPR), Next.js caching layers, Edge and Serverless runtimes, custom middleware architectures, type-safe API patterns, and database connections.',
    thumbnail: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
    category: 'Development',
    tags: ['React', 'Next.js', 'TypeScript', 'Performance'],
    instructor: {
      name: 'Prateek Bisht',
      avatar: 'PB',
      bio: 'Full Stack Engineer specializing in performance optimization and type-safe systems architecture.',
      title: 'Principal Software Engineer'
    },
    price: 0,
    rating: 4.95,
    reviewCount: 180,
    enrolledCount: 650,
    duration: 240,
    level: 'advanced',
    status: 'published',
    createdAt: new Date().toISOString(),
    whatYoullLearn: [
      'Architect systems utilizing React Server Components (RSC) and layouts.',
      'Control hydration boundaries and code-splitting patterns.',
      'Implement granular caching mechanisms using fetch API.',
      'Build secure, type-safe client-server interfaces using Server Actions.'
    ],
    requirements: [
      'Strong proficiency in React, TypeScript, and standard modern web architectures.'
    ],
    curriculum: [
      {
        id: 'react-mod-1',
        title: 'Module 1: Server Side Architectures',
        lessons: [
          {
            id: 'react-les-1-1',
            title: 'React Server Components deep-dive',
            type: 'video',
            duration: 30,
            videoUrl: 'https://www.youtube.com/embed/RqdQA36ZNSM',
            content: 'Understand server-rendering versus client-rendering, static compilation paradigms, and how the RSC payload is parsed by the client.',
            resources: []
          }
        ]
      }
    ]
  }
];

async function seed() {
  console.log('Starting database seeding...');
  for (const course of courses) {
    try {
      console.log(`Seeding course: ${course.title}...`);
      await setDoc(doc(db, 'courses', course.id), course);
      console.log(`Successfully seeded course: ${course.id}`);
    } catch (error) {
      console.error(`Error seeding course ${course.id}:`, error);
    }
  }
  console.log('Seeding completed!');
  process.exit(0);
}

seed();
