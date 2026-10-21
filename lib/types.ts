export type CategoryId = "starters" | "mains" | "desserts" | "cocktails";

export type DietaryTag = "vegetarian" | "vegan" | "gluten-free" | "halal";

export type Allergen =
  | "dairy"
  | "gluten"
  | "nuts"
  | "shellfish"
  | "eggs"
  | "soy"
  | "fish"
  | "sesame";

export type DishBadge = "Signature" | "Spicy" | "Chef's Pick";

export interface NutritionInfo {
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  description: string;
  imageUrl: string;
  dietary: DietaryTag[];
  allergens: Allergen[];
  ingredients: string[];
  nutrition: NutritionInfo;
  badge?: DishBadge;
  available: boolean;
  featured: boolean;
  createdAt: number;
}

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  blurb: string;
}

export interface DayHours {
  /** Minutes from midnight for opening (e.g. 17 * 60 = 17:00). */
  open: number;
  /** Minutes from midnight for closing; may exceed 1440 to cross midnight. */
  close: number;
  closed?: boolean;
  label: string;
}

/** Indexed by JS day: 0 = Sunday … 6 = Saturday. */
export type WeeklyHours = Record<number, DayHours>;

export interface NewMenuItem {
  name: string;
  category: CategoryId;
  price: number;
  description: string;
  imageUrl: string;
  dietary: DietaryTag[];
  allergens: Allergen[];
  ingredients: string[];
  nutrition: NutritionInfo;
  badge?: DishBadge;
  available: boolean;
  featured: boolean;
}
