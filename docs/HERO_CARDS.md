# Hero cards kothay ar kivabe badlano jay

Hero section-er card-gulo **ek-i jaygay** thake:

```text
src/lib/heroCards.ts
```

Ei file-i shudhu edit korlei hobe. `src/components/home/HeroCarousel.tsx` ba
`src/components/home/Hero.tsx` khulte hobe na — design, size, animation,
responsive layout sob already thik ache.

## Card-er text/image badlano

`src/lib/heroCards.ts`-e nicher moton ekta block thake:

```ts
{
  id: "science",
  subject: "Science",
  subtitle: "Explore tuitions",
  image: img("photo-1544717305-2782549b5136"),
  color: "#bfe3dc",
},
```

| Field | Ki bodlay |
| --- | --- |
| `id` | Card-er unique name. Naya card dile naya id dite hobe. |
| `subject` | Card-e dekha title. Card-e click korle `/tuitions?subject=<subject>`-e jay. |
| `subtitle` | Title-er niche choto text. |
| `image` | Card-er photo. |
| `color` | Card-er uporer background color (hex code). |

## Nijer image bosano

1. Image file-ta ei folder-e dio:

```text
public/hero/
```

2. `src/lib/heroCards.ts`-e `image` field-ta emn likho:

```ts
image: "/hero/science.jpg",
```

Recommended: 600x800 px, JPG/WebP, 5 MB-er kom. Image na load hole card-er
uporer color ar subject initials dekha jay — kono problem nai.

## Card add/remove

- Add: array-te naya `{ ... }` block dio.
- Remove: oi block-ta muke dio.
- Order badlano: block-gulo upor-niche sorio.

Auto-rotation, dots, hover animation, mobile spacing — sob automatically
adjust hoy. Alada kore kodu change korte hobe na.

## Testimonial

Fake testimonials alada file-e ache:

```text
src/components/home/Testimonials.tsx
```

Hero card edit korte ei file-ti **touch korben na**.
