"use client";

import {
  faDog,
  faPaw,
  faBone,
  faShieldDog,
  faCat,
} from "@fortawesome/free-solid-svg-icons";

export const ALL_PET_CATEGORIES = "TOTAL";
export const SMALL_DOGS = "Small Dogs";
export const MEDIUM_DOGS = "Medium Dogs";
export const LARGE_DOGS = "Large Dogs";
export const GIANT_DOGS = "Giant Dogs";
export const BIG_DOGS = "Big Dogs";
export const CATS = "Cats";
// small dogs
export const CHIHUAHUA = "Chihuahua";
export const POMERANIAN = "Pomeranian";
export const DACHSHUND = "Dachshund";
export const YORKSHIRE_TERRIER = "Yorkshire Terrier";
export const SHIH_TZU = "Shih Tzu";
export const MALTESE = "Maltese";
export const TOY_POODLE = "Toy Poodle";
export const PAPILLON = "Papillon";
export const JACK_RUSSELL_TERRIER = "Jack Russell Terrier";
export const BOSTON_TERRIER = "Boston Terrier";
// medium dogs
export const COCKER_SPANIEL = "Cocker Spaniel";
export const BULLDOG = "Bulldog";
export const BORDER_COLLIE = "Border Collie";
export const AUSTRALIAN_SHEPHERD = "Australian Shepherd";
export const BEAGLE = "Beagle";
export const BASSET_HOUND = "Basset Hound";
export const WHIPPET = "Whippet";
export const STANDARD_POODLE = "Standard Poodle";
export const STAFFORDSHIRE_BULL_TERRIER = "Staffordshire Bull Terrier";
export const SHETLAND_SHEEPDOG = "Shetland Sheepdog";
export const PIT_BULL = "Pit Bull";
// large dogs
export const LABRADOR_RETRIEVER = "Labrador Retriever";
export const GOLDEN_RETRIEVER = "Golden Retriever";
export const GERMAN_SHEPHERD = "German Shepherd";
export const DOBERMAN_PINSCHER = "Doberman Pinscher";
export const SIBERIAN_HUSKY = "Siberian Husky";
export const BOXER = "Boxer";
export const CHESAPEAKE_BAY_RETRIEVER = "Chesapeake Bay Retriever";
export const DALMATIAN = "Dalmatian";
export const BELGIAN_MALINOIS = "Belgian Malinois";
export const AKITA = "Akita";
// giant dogs
export const GREAT_DANE = "Great Dane";
export const MASTIFF = "Mastiff";
export const SAINT_BERNARD = "Saint Bernard";
export const NEWFOUNDLAND = "Newfoundland";
export const IRISH_WOLFHOUND = "Irish Wolfhound";
export const LEONBERGER = "Leonberger";
export const BERNARD_MOUNTAIN_DOG = "Bernese Mountain Dog";
export const TIBETAN_MASTIFF = "Tibetan Mastiff";
export const ALASKAN_MALAMUTE = "Alaskan Malamute";
export const KUVASZ = "Kuvasz";

export const PET_TYPES = [
  {
    label: SMALL_DOGS,
    icon: faDog,
    description:
      "Small dogs (up to 10 kgs) are compact, lively, and great for apartments or small homes. They often have big personalities in tiny bodies.",
  },
  {
    label: MEDIUM_DOGS,
    icon: faPaw,
    description:
      "Medium dogs (10-25 kgs) are a balanced mix of energy and adaptability, making them great companions for both families and active owners.",
  },
  {
    label: LARGE_DOGS,
    icon: faBone,
    description:
      "Large dogs (25-50 kgs) are strong and athletic, requiring ample exercise and space. They excel in companionship, work, and protection.",
  },
  {
    label: GIANT_DOGS,
    icon: faShieldDog,
    description:
      "Giant dogs (50+ kgs) are massive yet gentle, often serving as protectors or rescue dogs. They need space, care, and a loving home.",
  },
  {
    label: CATS,
    icon: faCat,
    description: "Cats",
  },
];

export const DOG_BREEDS = {
  [SMALL_DOGS]: {
    icon: "🐶",
    description:
      "Small dogs (up to 10 kgs) are compact, lively, and great for apartments or small homes. They often have big personalities in tiny bodies.",
    breeds: [
      CHIHUAHUA,
      POMERANIAN,
      DACHSHUND,
      YORKSHIRE_TERRIER,
      SHIH_TZU,
      MALTESE,
      TOY_POODLE,
      PAPILLON,
      JACK_RUSSELL_TERRIER,
      BOSTON_TERRIER,
    ],
  },
  [MEDIUM_DOGS]: {
    icon: "🐕",
    description:
      "Medium dogs (10-25 kgs) are a balanced mix of energy and adaptability, making them great companions for both families and active owners.",
    breeds: [
      COCKER_SPANIEL,
      BULLDOG,
      BORDER_COLLIE,
      AUSTRALIAN_SHEPHERD,
      BEAGLE,
      BASSET_HOUND,
      WHIPPET,
      PIT_BULL,
      STANDARD_POODLE,
      STAFFORDSHIRE_BULL_TERRIER,
      SHETLAND_SHEEPDOG,
    ],
  },
  [LARGE_DOGS]: {
    icon: "🐕‍🦺",
    description:
      "Large dogs (25-50 kgs) are strong and athletic, requiring ample exercise and space. They excel in companionship, work, and protection.",
    breeds: [
      LABRADOR_RETRIEVER,
      GOLDEN_RETRIEVER,
      GERMAN_SHEPHERD,
      DOBERMAN_PINSCHER,
      SIBERIAN_HUSKY,
      BOXER,
      CHESAPEAKE_BAY_RETRIEVER,
      DALMATIAN,
      BELGIAN_MALINOIS,
      AKITA,
    ],
  },
  [GIANT_DOGS]: {
    icon: "🐾",
    description:
      "Giant dogs (100+ lbs) are massive yet gentle, often serving as protectors or rescue dogs. They need space, care, and a loving home.",
    breeds: [
      GREAT_DANE,
      MASTIFF,
      SAINT_BERNARD,
      NEWFOUNDLAND,
      IRISH_WOLFHOUND,
      LEONBERGER,
      BERNARD_MOUNTAIN_DOG,
      TIBETAN_MASTIFF,
      ALASKAN_MALAMUTE,
      KUVASZ,
    ],
  },
  [CATS]: {
    icon: "🐈",
    description: "Cats",
  },
};

export const DOG_DESCRIPTIONS = {
  [CHIHUAHUA]: "A tiny yet confident dog with a big personality.",
  [POMERANIAN]: "A fluffy and energetic companion with a bold spirit.",
  [DACHSHUND]: "A long-bodied, brave, and playful little dog.",
  [YORKSHIRE_TERRIER]: "A small but feisty dog known for its silky coat.",
  [SHIH_TZU]: "A friendly, affectionate lap dog with a regal history.",
  [MALTESE]: "A gentle and elegant toy dog with a luxurious coat.",
  [TOY_POODLE]: "An intelligent and energetic small dog with curly fur.",
  [PAPILLON]: "A lively and friendly toy breed with butterfly-like ears.",
  [JACK_RUSSELL_TERRIER]: "An energetic and fearless hunting dog.",
  [BOSTON_TERRIER]: "A compact and intelligent breed with a tuxedo-like coat.",
  [COCKER_SPANIEL]: "A friendly, playful, and affectionate companion.",
  [BULLDOG]: "A stocky and affectionate dog with a distinctive face.",
  [BORDER_COLLIE]: "A highly intelligent and energetic herding dog.",
  [AUSTRALIAN_SHEPHERD]: "An agile and smart working dog with a striking coat.",
  [BEAGLE]: "A curious and friendly scent hound, great for families.",
  [BASSET_HOUND]: "A laid-back scent hound with droopy ears and a great nose.",
  [WHIPPET]: "A sleek and fast dog, gentle and affectionate at home.",
  [STANDARD_POODLE]: "An intelligent and elegant breed, great in water.",
  [STAFFORDSHIRE_BULL_TERRIER]:
    "A strong yet loving and people-friendly breed.",
  [SHETLAND_SHEEPDOG]: "A smart and agile herding dog with a lush coat.",
  [LABRADOR_RETRIEVER]: "A friendly, outgoing, and intelligent retriever.",
  [GOLDEN_RETRIEVER]: "A gentle and affectionate breed, eager to please.",
  [GERMAN_SHEPHERD]: "A highly trainable and protective working dog.",
  [DOBERMAN_PINSCHER]: "A sleek, loyal, and highly protective breed.",
  [SIBERIAN_HUSKY]: "A strong and independent sled dog with a thick coat.",
  [BOXER]: "A muscular and fun-loving breed with boundless energy.",
  [CHESAPEAKE_BAY_RETRIEVER]:
    "A rugged, intelligent retriever with water skills.",
  [DALMATIAN]:
    "A spotted and active breed known for its history with firefighters.",
  [BELGIAN_MALINOIS]: "A highly trainable and energetic working dog.",
  [AKITA]: "A noble and powerful breed with strong loyalty.",
  [GREAT_DANE]: "A giant yet gentle dog with an affectionate nature.",
  [MASTIFF]: "A massive and protective guardian with a calm demeanor.",
  [SAINT_BERNARD]: "A gentle giant known for its rescue work in the Alps.",
  [NEWFOUNDLAND]: "A large and gentle water rescue dog.",
  [IRISH_WOLFHOUND]: "A tall and noble sighthound bred for hunting.",
  [LEONBERGER]: "A giant, friendly breed with a lion-like mane.",
  [BERNARD_MOUNTAIN_DOG]:
    "A loyal and gentle working dog with striking markings.",
  [TIBETAN_MASTIFF]: "A powerful and independent guardian breed.",
  [ALASKAN_MALAMUTE]: "A strong and resilient sled dog with a thick coat.",
  [KUVASZ]: "A large and loyal livestock guardian breed.",
};
