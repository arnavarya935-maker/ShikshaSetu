export type QuestionPaper = {
  id: string;
  title: string;
  subject: string;
  year: number;
  board: string;
  downloads: number;
  pdfUrl: string;
};

export const mockPapers: QuestionPaper[] = [
  { id: 'p1', title: 'CBSE Class 12 Physics Board Exam', subject: 'Physics', year: 2023, board: 'CBSE', downloads: 12450, pdfUrl: '#' },
  { id: 'p2', title: 'JEE Main Physics Question Paper', subject: 'Physics', year: 2023, board: 'JEE', downloads: 45200, pdfUrl: '#' },
  { id: 'p3', title: 'CBSE Class 12 Mathematics', subject: 'Mathematics', year: 2022, board: 'CBSE', downloads: 9800, pdfUrl: '#' },
  { id: 'p4', title: 'NEET Biology Previous Year', subject: 'Biology', year: 2023, board: 'NEET', downloads: 87000, pdfUrl: '#' },
  { id: 'p5', title: 'ICSE Class 10 Chemistry', subject: 'Chemistry', year: 2021, board: 'ICSE', downloads: 5400, pdfUrl: '#' },
  { id: 'p6', title: 'JEE Advanced Mathematics', subject: 'Mathematics', year: 2022, board: 'JEE', downloads: 22000, pdfUrl: '#' },
];
