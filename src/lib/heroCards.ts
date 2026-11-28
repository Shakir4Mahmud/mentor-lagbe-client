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

// ============================================================================
// HERO CARDS — EDIT GUIDE (design/animation kisu bodle giri na)
// ----------------------------------------------------------------------------
// 1) Card-er text/image/change: just nicher `heroCards` array-i edit koro.
//    - subject  -> card-e dekha title + click korle jabe /tuitions?subject=<subject>
//    - subtitle -> title-er niche choto text
//    - image    -> photo URL. Nijer image chai: image-ta `public/hero/`-e dio
//                  ar emn likho: image: "/hero/amar-image.jpg"
//    - color    -> card-er background color (hex)
//    - id       -> unique thakte hobe (dot/animation-er jonno)
// 2) Card add/remove korte chai: array-te ekta object add/remove koro.
//    Animation auto adjust hoy; alada kore kisu change korte hobe na.
// 3) Image recommended: 600x800 px, JPG/WebP, 5 MB-er kom.
//    Detail guide: docs/HERO_CARDS.md
//
// Ekhane kono tutor/fee data rakha hoy na — card-e click korle oi category-r
// tuition list-e pathano hoy. Testimonials alada file-e, eta touch koro na.
// ============================================================================
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
