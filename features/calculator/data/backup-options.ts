export type BackupOption = {
  id: string;
  name: string;
  type: string;
  description: string;
  voltage: number; // V
  capacityAh: number; // Ah
  depthOfDischarge: number; // usable fraction of battery capacity (0-1)
  efficiency: number; // conversion efficiency (0-1)
  maxLoadW: number; // maximum continuous load in Watts
  price: number; // indicative price in INR
};

// Indicative catalogue. Prices are rough estimates and must be verified
// against current shop / online prices before real use.
export const backupOptions: BackupOption[] = [
  {
    id: "mini-ups",
    name: "Mini DC UPS for router",
    type: "Mini UPS",
    description: "Keeps a Wi-Fi router and small DC devices running.",
    voltage: 12,
    capacityAh: 5,
    depthOfDischarge: 0.8,
    efficiency: 0.85,
    maxLoadW: 30,
    price: 1800,
  },
  {
    id: "power-bank-pd",
    name: "65W USB-C power bank",
    type: "Power bank",
    description: "Charges phones and a laptop; can run a router with an adapter.",
    voltage: 3.7,
    capacityAh: 20,
    depthOfDischarge: 0.9,
    efficiency: 0.85,
    maxLoadW: 65,
    price: 3500,
  },
  {
    id: "inv-500-65",
    name: "500 VA inverter + 65 Ah battery",
    type: "Inverter and battery",
    description: "Compact setup for a few lights, a fan and a router.",
    voltage: 12,
    capacityAh: 65,
    depthOfDischarge: 0.7,
    efficiency: 0.85,
    maxLoadW: 350,
    price: 9500,
  },
  {
    id: "inv-700-100",
    name: "700 VA inverter + 100 Ah battery",
    type: "Inverter and battery",
    description: "Popular home setup for lights, fans, router and a laptop.",
    voltage: 12,
    capacityAh: 100,
    depthOfDischarge: 0.7,
    efficiency: 0.85,
    maxLoadW: 490,
    price: 14500,
  },
  {
    id: "inv-900-150",
    name: "900 VA inverter + 150 Ah battery",
    type: "Inverter and battery",
    description: "Longer backup for a typical flat, including a TV.",
    voltage: 12,
    capacityAh: 150,
    depthOfDischarge: 0.7,
    efficiency: 0.85,
    maxLoadW: 630,
    price: 19500,
  },
  {
    id: "inv-1100-200",
    name: "1100 VA inverter + 200 Ah battery",
    type: "Inverter and battery",
    description: "Higher load and longer backup, can handle an air cooler.",
    voltage: 12,
    capacityAh: 200,
    depthOfDischarge: 0.7,
    efficiency: 0.85,
    maxLoadW: 770,
    price: 24500,
  },
  {
    id: "lifepo4-600",
    name: "600 Wh LiFePO4 power station",
    type: "Portable power station",
    description: "Silent, maintenance-free and easy to carry; no installation.",
    voltage: 12.8,
    capacityAh: 50,
    depthOfDischarge: 0.9,
    efficiency: 0.85,
    maxLoadW: 600,
    price: 35000,
  },
  {
    id: "inv-1500-300",
    name: "1.5 kVA inverter + 2 x 150 Ah batteries",
    type: "Inverter and battery",
    description: "Large setup for heavier loads like a refrigerator and coolers.",
    voltage: 24,
    capacityAh: 150,
    depthOfDischarge: 0.7,
    efficiency: 0.85,
    maxLoadW: 1050,
    price: 38000,
  },
];
