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
  { id: 'p1', title: 'CBSE Class 12 Physics Board Exam (Set 1)', subject: 'Physics', year: 2023, board: 'CBSE', downloads: 12450, pdfUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2022_23/Physics-SQP.pdf' },
  { id: 'p2', title: 'JEE Main Physics Question Paper (Shift 1)', subject: 'Physics', year: 2023, board: 'JEE', downloads: 45200, pdfUrl: 'https://jeemain.nta.nic.in/downloads/JEE_Main_2023_Physics.pdf' },
  { id: 'p3', title: 'CBSE Class 12 Mathematics (Set 2)', subject: 'Mathematics', year: 2022, board: 'CBSE', downloads: 9800, pdfUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassXII_2022_23/Maths-SQP.pdf' },
  { id: 'p4', title: 'NEET Biology Previous Year (Code F1)', subject: 'Biology', year: 2023, board: 'NEET', downloads: 87000, pdfUrl: 'https://ntaneet.nic.in/downloads/NEET_Biology_2023.pdf' },
  { id: 'p5', title: 'CBSE Class 10 Science (Set 3)', subject: 'Science', year: 2021, board: 'CBSE', downloads: 5400, pdfUrl: 'https://cbseacademic.nic.in/web_material/SQP/ClassX_2022_23/Science-SQP.pdf' },
  { id: 'p6', title: 'JEE Advanced Mathematics (Paper 1)', subject: 'Mathematics', year: 2022, board: 'JEE', downloads: 22000, pdfUrl: 'https://jeeadv.ac.in/downloads/JEE_Adv_Maths_2022.pdf' },
];
