// Define book type
export type Book = {
  month: string;
  title: string;
  image: string;
  description: string;
};

// Define book data with months and image names
export const books: Book[] = [
  {
    month: "Feb",
    title: "nightingale",
    image: "nightingale.jpg",
    description:
      "TWO SISTERS IN OCCUPIED FRANCE DURING WORLD WAR II FACE IMPOSSIBLE CHOICES AS THEY RESIST THE GERMAN INVASION, ONE THROUGH DIRECT ACTION AND THE OTHER THROUGH SUBTLE DEFIANCE",
  },
  {
    month: "Mar",
    title: "wildSwans",
    image: "wildSwans.jpg",
    description:
      "THREE GENERATIONS OF CHINESE WOMEN NAVIGATE THE TURBULENT WATERS OF TWENTIETH CENTURY CHINA, FROM THE EMPEROR'S COURT TO THE CULTURAL REVOLUTION AND BEYOND",
  },
  {
    month: "Apr",
    title: "Cantoras",
    image: "Cantoras.jpeg",
    description:
      "FIVE WOMEN FIND REFUGE AND LOVE IN A REMOTE BEACH HOUSE DURING URUGUAY'S DICTATORSHIP ERA, CREATING A SANCTUARY OF FREEDOM AND AUTHENTICITY AMIDST OPPRESSION",
  },
  {
    month: "May",
    title: "theOverstory",
    image: "theOverstory.jpeg",
    description:
      "NINE AMERICANS FROM DIVERSE BACKGROUNDS DISCOVER THE PROFOUND CONNECTIONS BETWEEN HUMANS AND TREES, JOINING FORCES TO PROTECT THE ANCIENT FORESTS FROM DESTRUCTION",
  },
];
