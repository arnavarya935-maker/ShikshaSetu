import type { Course } from '../types';

export const courses: Course[] = [
  {
    id: 'course-webdev-101',
    slug: 'modern-web-development-101',
    title: 'Introduction to Modern Web Development',
    description: 'Learn the fundamentals of HTML, CSS, JavaScript, and build your very first fully responsive website from scratch.',
    longDescription: 'This comprehensive course is designed for absolute beginners who want to build a solid foundation in web technologies. We start with the basics of semantic HTML, progress to modern CSS layouts including Flexbox and Grid, explore programming concepts with JavaScript, and deploy a responsive personal project to the web.',
    thumbnail: 'url(https://img.youtube.com/vi/kUMe1FH4CHE/0.jpg) center/cover no-repeat',
    category: 'Programming',
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
    thumbnail: 'url(https://img.youtube.com/vi/tPYj3fFJGjk/0.jpg) center/cover no-repeat',
    category: 'Data Science',
    tags: ['Machine Learning', 'Python', 'PyTorch', 'Neural Networks'],
    instructor: {
      name: 'Prof. Anjali Sharma',
      avatar: 'AS',
      bio: 'Research scientist and PhD holder in Applied Artificial Intelligence.',
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
      'Train Convolutional Neural Networks (CNNs) for image recognition.'
    ],
    requirements: [
      'Basic knowledge of Python syntax and programming logic.'
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
    thumbnail: 'url(https://img.youtube.com/vi/RqdQA36ZNSM/0.jpg) center/cover no-repeat',
    category: 'Programming',
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
      'Architect systems utilizing React Server Components (RSC) and layouts.'
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
  },
  {
    id: 'course-cs-104',
    slug: 'computer-science-fundamentals',
    title: 'Computer Science Fundamentals',
    description: 'Master the core concepts with interactive lessons, algorithms, and real-world data structures.',
    longDescription: 'This course teaches you how to think like a programmer. We will cover fundamental data structures (arrays, linked lists, trees, graphs) and algorithms (sorting, searching, dynamic programming) essential for computer science and technical interviews.',
    thumbnail: 'url(https://img.youtube.com/vi/zOjov-2OZ0E/0.jpg) center/cover no-repeat',
    category: 'Programming',
    tags: ['Algorithms', 'Data Structures', 'CS50', 'Logic'],
    instructor: {
      name: 'Dr. Emily Chen',
      avatar: 'EC',
      bio: 'Professor of Computer Science with a passion for teaching algorithms and theoretical computation.',
      title: 'Professor of Computer Science'
    },
    price: 499,
    rating: 4.9,
    reviewCount: 512,
    enrolledCount: 3200,
    duration: 480,
    level: 'intermediate',
    status: 'published',
    createdAt: new Date().toISOString(),
    whatYoullLearn: [
      'Understand big-O notation and analyze algorithm efficiency.',
      'Implement core data structures in Python and C++.'
    ],
    requirements: [
      'Basic programming knowledge.'
    ],
    curriculum: [
      {
        id: 'cs-mod-1',
        title: 'Module 1: Algorithms & Data Structures',
        lessons: [
          {
            id: 'cs-les-1-1',
            title: 'Introduction to Algorithms',
            type: 'video',
            duration: 45,
            videoUrl: 'https://www.youtube.com/embed/zOjov-2OZ0E',
            content: 'Learn what an algorithm is, how to measure its efficiency using Big-O notation, and start writing simple search algorithms.',
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-math-105',
    slug: 'advanced-mathematics',
    title: 'Advanced Mathematics',
    description: 'Deep dive into calculus, linear algebra, and discrete mathematics for science and engineering.',
    longDescription: 'This comprehensive math course bridges the gap between high school calculus and university-level engineering mathematics. Topics include multivariable calculus, matrix transformations, eigenvalues, and differential equations.',
    thumbnail: 'url(https://img.youtube.com/vi/S3U-Jt6lM5Q/0.jpg) center/cover no-repeat',
    category: 'Mathematics',
    tags: ['Calculus', 'Algebra', 'Engineering', 'Math'],
    instructor: {
      name: 'Prof. David Hilbert',
      avatar: 'DH',
      bio: 'Head of Mathematics department with a focus on making complex engineering math accessible.',
      title: 'Head of Mathematics'
    },
    price: 399,
    rating: 4.7,
    reviewCount: 156,
    enrolledCount: 1120,
    duration: 360,
    level: 'advanced',
    status: 'published',
    createdAt: new Date().toISOString(),
    whatYoullLearn: [
      'Solve multivariable calculus problems and differential equations.',
      'Apply linear algebra concepts to machine learning algorithms.'
    ],
    requirements: [
      'High school calculus and basic algebra.'
    ],
    curriculum: [
      {
        id: 'math-mod-1',
        title: 'Module 1: Multivariable Calculus',
        lessons: [
          {
            id: 'math-les-1-1',
            title: 'Limits and Derivatives in 3D',
            type: 'video',
            duration: 35,
            videoUrl: 'https://www.youtube.com/embed/S3U-Jt6lM5Q',
            content: 'An introduction to functions of multiple variables, partial derivatives, and gradient vectors.',
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-bus-106',
    slug: 'business-entrepreneurship',
    title: 'Business & Entrepreneurship',
    description: 'Learn the fundamentals of starting a company, managing finances, and scaling a startup.',
    longDescription: 'From ideation to IPO, this course covers the essential frameworks of modern business. Learn how to construct a lean business model, pitch to investors, manage cash flow, and lead a high-performing team in competitive markets.',
    thumbnail: 'url(https://img.youtube.com/vi/8jWQpb2-m0I/0.jpg) center/cover no-repeat',
    category: 'Business',
    tags: ['Startup', 'Finance', 'Leadership', 'Management'],
    instructor: {
      name: 'Sarah Jenkins',
      avatar: 'SJ',
      bio: 'Serial entrepreneur and venture capitalist who has backed over 20 successful startups.',
      title: 'Venture Capitalist & Founder'
    },
    price: 599,
    rating: 4.8,
    reviewCount: 410,
    enrolledCount: 2200,
    duration: 300,
    level: 'beginner',
    status: 'published',
    createdAt: new Date().toISOString(),
    whatYoullLearn: [
      'Develop a lean canvas model for new business ideas.',
      'Understand venture capital, term sheets, and funding rounds.'
    ],
    requirements: [
      'No prior business knowledge required.'
    ],
    curriculum: [
      {
        id: 'bus-mod-1',
        title: 'Module 1: The Startup Foundation',
        lessons: [
          {
            id: 'bus-les-1-1',
            title: 'Ideation and Market Validation',
            type: 'video',
            duration: 40,
            videoUrl: 'https://www.youtube.com/embed/8jWQpb2-m0I',
            content: 'How to validate your startup idea using customer feedback loops and the Lean Startup methodology.',
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-des-107',
    slug: 'ui-ux-design-basics',
    title: 'UI/UX Design Basics',
    description: 'Master Figma and learn the principles of beautiful, user-centric interface design.',
    longDescription: 'This course teaches you how to design products that users love. You will learn the fundamentals of typography, color theory, layout grids, and wireframing, all while mastering Figma as your primary design tool.',
    thumbnail: 'url(https://img.youtube.com/vi/c9Wg6Cb_YlU/0.jpg) center/cover no-repeat',
    category: 'Design',
    tags: ['Figma', 'UI Design', 'UX Research', 'Creative'],
    instructor: {
      name: 'Jessica Lee',
      avatar: 'JL',
      bio: 'Lead Product Designer with experience at top tech firms, specializing in accessible and intuitive interfaces.',
      title: 'Lead Product Designer'
    },
    price: 299,
    rating: 4.95,
    reviewCount: 300,
    enrolledCount: 1850,
    duration: 210,
    level: 'beginner',
    status: 'published',
    createdAt: new Date().toISOString(),
    whatYoullLearn: [
      'Design fully interactive prototypes in Figma.',
      'Conduct user research and usability testing.'
    ],
    requirements: [
      'No design experience required. A free Figma account is needed.'
    ],
    curriculum: [
      {
        id: 'des-mod-1',
        title: 'Module 1: Design Fundamentals',
        lessons: [
          {
            id: 'des-les-1-1',
            title: 'Introduction to Figma & UI Basics',
            type: 'video',
            duration: 30,
            videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU',
            content: 'Get comfortable with the Figma interface and learn the basics of framing, constraints, and auto-layout.',
            resources: []
          }
        ]
      }
    ]
  },
  {
    id: 'course-lang-108',
    slug: 'spanish-for-beginners',
    title: 'Spanish for Beginners',
    description: 'Learn conversational Spanish quickly with interactive dialogue and pronunciation exercises.',
    longDescription: 'Whether you are traveling to Spain or Latin America, this course will teach you the essential vocabulary, grammar, and conversational phrases to confidently speak with locals and navigate daily life.',
    thumbnail: 'url(https://img.youtube.com/vi/8z9Z_4P0Q2Q/0.jpg) center/cover no-repeat',
    category: 'Language',
    tags: ['Spanish', 'Language', 'Travel', 'Communication'],
    instructor: {
      name: 'Carlos Ruiz',
      avatar: 'CR',
      bio: 'Native Spanish speaker and certified language instructor with a focus on immersive learning.',
      title: 'Language Instructor'
    },
    price: 199,
    rating: 4.6,
    reviewCount: 89,
    enrolledCount: 450,
    duration: 150,
    level: 'beginner',
    status: 'published',
    createdAt: new Date().toISOString(),
    whatYoullLearn: [
      'Hold a basic conversation in Spanish.',
      'Conjugate essential verbs in the present and past tense.'
    ],
    requirements: [
      'A willingness to practice speaking out loud.'
    ],
    curriculum: [
      {
        id: 'lang-mod-1',
        title: 'Module 1: Greetings & Basics',
        lessons: [
          {
            id: 'lang-les-1-1',
            title: 'Basic Greetings and Introductions',
            type: 'video',
            duration: 20,
            videoUrl: 'https://www.youtube.com/embed/8z9Z_4P0Q2Q',
            content: 'Learn how to say hello, ask how someone is doing, and introduce yourself in Spanish.',
            resources: []
          }
        ]
      }
    ]
  }
];
