export type ApplianceConfig = {
  id: string | number;
  name: string;
  quantity: number; // units
  rating: number; // Watts (per unit)
  usage: number; // hours per day
};

// Default values: standard ratings and average daily usage of common appliances.
export const appliances: ApplianceConfig[] = [
  { id: 1, name: "light", quantity: 5, rating: 25, usage: 16 },
  { id: 2, name: "fan", quantity: 2, rating: 40, usage: 20 },
  { id: 3, name: "wifi router", quantity: 1, rating: 10, usage: 24 },
  { id: 4, name: "laptop", quantity: 1, rating: 65, usage: 6 },
  { id: 5, name: "mobile charger", quantity: 2, rating: 10, usage: 3 },
  { id: 6, name: "led tv", quantity: 1, rating: 80, usage: 5 },
  { id: 7, name: "refrigerator", quantity: 1, rating: 150, usage: 8 },
  { id: 8, name: "air cooler", quantity: 1, rating: 150, usage: 8 },
];
