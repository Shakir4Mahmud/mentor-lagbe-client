export type HeroCard = {
  id: string;
  subject: string;
  subtitle: string;
  tutorName: string;
  rating: number;
  fee: number;
  image: string;
  color: string;
};

function img(photoId: string) {
  return (
    "https://images.unsplash.com/" +
    photoId +
    "?auto=format&fit=crop&w=600&q=80"
  );
}

export const heroCards: HeroCard[] = [
  {
    id: "physics",
    subject: "Physics",
    subtitle: "HSC, Online",
    tutorName: "Nusrat Jahan",
    rating: 4.9,
    fee: 4000,
    image: img("photo-1544717305-2782549b5136"),
    color: "#bfe3dc",
  },
  {
    id: "programming",
    subject: "Programming",
    subtitle: "University, Online",
    tutorName: "Tanvir Ahmed",
    rating: 4.8,
    fee: 5000,
    image: img("photo-1580894732444-8ecded7900cd"),
    color: "#f3e1b8",
  },
  {
    id: "ielts",
    subject: "IELTS",
    subtitle: "Professional, Online",
    tutorName: "Farhana Akter",
    rating: 5.0,
    fee: 6000,
    image: img("photo-1573496359142-b8d87734a5a2"),
    color: "#d5e8c9",
  },
  {
    id: "mathematics",
    subject: "Mathematics",
    subtitle: "SSC, Offline",
    tutorName: "Rahim Uddin",
    rating: 4.7,
    fee: 3500,
    image: img("photo-1509062522246-3755977927d7"),
    color: "#f1d3c4",
  },
  {
    id: "biology",
    subject: "Biology",
    subtitle: "HSC, Offline",
    tutorName: "Sabbir Hossain",
    rating: 4.8,
    fee: 3500,
    image: img("photo-1427504494785-3a9ca7044f45"),
    color: "#cfd9f3",
  },
];