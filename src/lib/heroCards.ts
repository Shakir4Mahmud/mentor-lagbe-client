export type HeroCard = {
  id: string;
  subject: string;
  subtitle: string;
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

// Hero cards category tile. Ekhane kono tutor/fee data rakha hoy na —
// card-e click korle oi category-r tuition list-e pathano hoy.
export const heroCards: HeroCard[] = [
  {
    id: "arts",
    subject: "Arts",
    subtitle: "Explore tuitions",
    image: img("photo-1580894732444-8ecded7900cd"),
    color: "#f3e1b8",
  },
  {
    id: "commerce",
    subject: "Commerce",
    subtitle: "Explore tuitions",
    image: img("photo-1573496359142-b8d87734a5a2"),
    color: "#d5e8c9",
  },
  {
    id: "science",
    subject: "Science",
    subtitle: "Explore tuitions",
    image: img("photo-1544717305-2782549b5136"),
    color: "#bfe3dc",
  },
  {
    id: "bangla",
    subject: "Bangla",
    subtitle: "Explore tuitions",
    image: img("photo-1509062522246-3755977927d7"),
    color: "#f1d3c4",
  },
  {
    id: "english",
    subject: "English",
    subtitle: "Explore tuitions",
    image: img("photo-1427504494785-3a9ca7044f45"),
    color: "#cfd9f3",
  },
];
