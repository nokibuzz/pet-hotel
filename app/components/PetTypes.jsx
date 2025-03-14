"use client";

import {
  faPaw,
  faShieldDog,
  faDog,
  faCat,
} from "@fortawesome/free-solid-svg-icons";

export const petTypes = [
  {
    label: "Small Dogs",
    icon: faPaw,
    description: "Dogs that weight less than 10kg",
  },
  {
    label: "Medium Dogs",
    icon: faShieldDog,
    description: "Dogs from 10-25kg of weight",
  },
  {
    label: "Big Dogs",
    icon: faDog,
    description: "Dogs more than 25kg of weight",
  },
  {
    label: "Cats",
    icon: faCat,
    description: "Cats",
  },
];
