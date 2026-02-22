export type VehicleType = "2W" | "3W" | "4W"

interface VehicleSchema {
  makes: {
    [make: string]: {
      models: {
        [model: string]: string[]
      }
    }
  }
}

// Vehicle data for cascading dropdowns
export const vehicleData: Record<VehicleType, VehicleSchema> = {
  "2W": {
    makes: {
      Hero: {
        models: {
          "Splendor Plus": ["Standard", "i3S", "Black & Accent"],
          "HF Deluxe": ["Standard", "i3S", "Self Start"],
          "Passion Pro": ["Standard", "i3S", "Drum"],
          Glamour: ["Standard", "Blaze", "Xtec"],
          "Xtreme 160R": ["Standard", "Stealth", "Connected"],
        },
      },
      Honda: {
        models: {
          "Activa 6G": ["Standard", "DLX", "H-Smart"],
          Shine: ["Standard", "Drum", "Disc"],
          Unicorn: ["Standard", "BS6"],
          CB350: ["RS", "H'ness", "Anniversary"],
          Dio: ["Standard", "DLX", "Sports"],
        },
      },
      TVS: {
        models: {
          "Apache RTR 160": ["2V", "4V", "4V Special Edition"],
          Jupiter: ["Standard", "Classic", "ZX"],
          "Ntorq 125": ["Standard", "Race XP", "Super Squad"],
          "Raider 125": ["Standard", "Disc", "SmartXonnect"],
          "Star City Plus": ["Standard", "Dual Tone"],
        },
      },
      Bajaj: {
        models: {
          "Pulsar 150": ["Standard", "Twin Disc", "Neon"],
          "Pulsar NS200": ["Standard", "ABS"],
          "Platina 100": ["Standard", "ES", "Comfortec"],
          "CT 110": ["Standard", "ES", "KS"],
          "Dominar 400": ["Standard", "Touring"],
        },
      },
      "Royal Enfield": {
        models: {
          "Classic 350": ["Standard", "Signals", "Chrome"],
          "Bullet 350": ["Standard", "ES", "Military"],
          "Meteor 350": ["Fireball", "Stellar", "Supernova"],
          "Hunter 350": ["Retro", "Metro"],
          Himalayan: ["Standard", "Sleet"],
        },
      },
    },
  },
  "3W": {
    makes: {
      Bajaj: {
        models: {
          "RE Compact": ["Diesel", "Petrol", "CNG"],
          "RE 4S": ["Diesel", "Petrol", "CNG"],
          "Maxima C": ["Standard", "Plus"],
          "Maxima Z": ["8-Seater", "10-Seater"],
        },
      },
      Piaggio: {
        models: {
          "Ape City": ["Standard", "Plus", "Smart"],
          "Ape Auto": ["Diesel", "Petrol", "CNG"],
          "Ape Xtra": ["Standard", "DLX"],
        },
      },
      Mahindra: {
        models: {
          "Alfa Plus": ["Standard", "DX"],
          Treo: ["Standard", "SFT", "Yaari"],
          "e-Alfa Mini": ["Standard"],
        },
      },
      TVS: {
        models: {
          "King Deluxe": ["Standard", "DX"],
          "King Duramax": ["Standard", "Plus"],
        },
      },
    },
  },
  "4W": {
    makes: {
      "Maruti Suzuki": {
        models: {
          Swift: ["LXI", "VXI", "ZXI", "ZXI+"],
          Baleno: ["Sigma", "Delta", "Zeta", "Alpha"],
          "Alto K10": ["STD", "LXI", "VXI", "VXI+"],
          Dzire: ["LXI", "VXI", "ZXI", "ZXI+"],
          Brezza: ["LXI", "VXI", "ZXI", "ZXI+"],
          Ertiga: ["LXI", "VXI", "ZXI", "ZXI+"],
          XL6: ["Zeta", "Alpha", "Alpha+"],
          "Grand Vitara": ["Sigma", "Delta", "Zeta", "Alpha", "Alpha+"],
        },
      },
      Hyundai: {
        models: {
          i20: ["Magna", "Sportz", "Asta", "Asta (O)"],
          Creta: ["E", "EX", "S", "SX", "SX (O)"],
          Venue: ["E", "S", "S+", "SX", "SX (O)"],
          Verna: ["E", "S", "SX", "SX (O)", "Turbo"],
          Tucson: ["Platinum", "Signature"],
          Alcazar: ["Prestige", "Platinum", "Signature"],
          Exter: ["EX", "S", "SX", "SX (O)"],
        },
      },
      Tata: {
        models: {
          Nexon: ["Smart", "Pure", "Creative", "Creative+", "Fearless", "Fearless+"],
          Punch: ["Pure", "Adventure", "Accomplished", "Creative"],
          Harrier: ["Smart", "Pure", "Adventure", "Creative+", "Fearless+"],
          Safari: ["Smart", "Pure", "Adventure", "Accomplished", "Creative+"],
          Tiago: ["XE", "XM", "XZ", "XZ+"],
          Altroz: ["XE", "XM", "XZ", "XZ+", "Dark"],
          Tigor: ["XE", "XM", "XZ", "XZ+"],
        },
      },
      Mahindra: {
        models: {
          Thar: ["AX", "AX (O)", "LX", "LX Hard-top"],
          "Scorpio-N": ["Z4", "Z6", "Z8", "Z8L"],
          XUV700: ["MX", "AX3", "AX5", "AX7", "AX7L"],
          XUV300: ["W4", "W6", "W8", "W8 (O)"],
          Bolero: ["B4", "B6", "B6 (O)"],
          XUV400: ["EC", "EL", "EL Pro"],
        },
      },
      Toyota: {
        models: {
          Fortuner: ["4x2 MT", "4x2 AT", "4x4 MT", "4x4 AT", "Legender"],
          "Innova Crysta": ["G", "GX", "VX", "ZX"],
          "Innova Hycross": ["G", "GX", "VX", "ZX", "ZX (O)"],
          "Urban Cruiser Hyryder": ["E", "S", "G", "V"],
          Glanza: ["E", "S", "G", "V"],
        },
      },
      Kia: {
        models: {
          Seltos: ["HTE", "HTK", "HTK+", "HTX", "HTX+", "GTX", "GTX+", "X-Line"],
          Sonet: ["HTE", "HTK", "HTK+", "HTX", "HTX+", "GTX+"],
          Carens: ["Premium", "Prestige", "Prestige Plus", "Luxury", "Luxury Plus"],
          EV6: ["GT-Line", "GT-Line AWD", "GT"],
        },
      },
    },
  },
}



export function getMakes(vehicleType: VehicleType): string[] {
  return Object.keys(vehicleData[vehicleType]?.makes || {})
}

export function getModels(vehicleType: VehicleType, make: string): string[] {
  return Object.keys(vehicleData[vehicleType]?.makes[make]?.models || {})
}

export function getVariants(vehicleType: VehicleType, make: string, model: string): string[] {
  return vehicleData[vehicleType]?.makes[make]?.models[model] || []
}
