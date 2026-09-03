/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Province,
  TourismCategory,
  TourismOperator,
  RegistrationApplication,
  MembershipRecord,
  LicenseRecord,
  OperatorCompliance,
  AuditLog,
  NotificationItem,
  DemoUser
} from '../types';

export const DEMO_USERS: DemoUser[] = [
  {
    id: 'user-admin-1',
    name: 'Markus Kaumu',
    role: 'admin',
    title: 'Director of Policy & Licensing',
    department: 'PNG Tourism Promotion Authority (PNG TPA)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-staff-1',
    name: 'Grace Pakur',
    role: 'staff',
    title: 'Senior Registry & Compliance Officer',
    department: 'PNG TPA Operations Division',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-op-1',
    name: 'John Wari',
    role: 'operator',
    title: 'Managing Director',
    department: 'PNG Paradise Tours Ltd',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    operatorId: 'op-png-paradise'
  },
  {
    id: 'user-public-1',
    name: 'Elena Rostova',
    role: 'public',
    title: 'International Traveler & Adventurer',
    department: 'Public Tourist Directory',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export const PROVINCES: Province[] = [
  {
    id: 'ncd',
    name: 'National Capital District',
    region: 'Southern',
    capital: 'Port Moresby',
    description: 'The vibrant gateway to Papua New Guinea, featuring cultural museums, nature parks, harbors, and modern accommodations.',
    heroImage: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&auto=format&fit=crop&q=80',
    coordinates: { lat: -9.4438, lng: 147.1803 }
  },
  {
    id: 'central',
    name: 'Central',
    region: 'Southern',
    capital: 'Port Moresby',
    description: 'Home to the iconic Kokoda Track trailhead, rugged mountain ranges, coastal beaches, and traditional stilt villages.',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
    coordinates: { lat: -9.8000, lng: 147.6000 }
  },
  {
    id: 'morobe',
    name: 'Morobe',
    region: 'Momase',
    capital: 'Lae',
    description: 'Industrial and transport hub with rainforest valleys, historic WWII war cemeteries, botanical gardens, and the Huon Peninsula.',
    heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    coordinates: { lat: -6.7281, lng: 146.9944 }
  },
  {
    id: 'eastern-highlands',
    name: 'Eastern Highlands',
    region: 'Highlands',
    capital: 'Goroka',
    description: 'Famous for the Goroka Cultural Show, Asaro Mudmen dancers, cool mountain climate, and specialty Arabica organic coffee.',
    heroImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80',
    coordinates: { lat: -6.0833, lng: 145.3833 }
  },
  {
    id: 'western-highlands',
    name: 'Western Highlands',
    region: 'Highlands',
    capital: 'Mount Hagen',
    description: 'Highland cultural heartland hosting the Mount Hagen Cultural Show, lush tea estates, and exceptional bird of paradise watching.',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    coordinates: { lat: -5.8575, lng: 144.2267 }
  },
  {
    id: 'east-new-britain',
    name: 'East New Britain',
    region: 'Islands',
    capital: 'Kokopo',
    description: 'Volcanic landscapes overlooking Tavurvur, world-class diving, Baining fire dancers, and rich Tolai Dukduk traditions.',
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    coordinates: { lat: -4.3421, lng: 152.2683 }
  },
  {
    id: 'west-new-britain',
    name: 'West New Britain',
    region: 'Islands',
    capital: 'Kimbe',
    description: 'Kimbe Bay is globally acclaimed for pristine coral reef biodiversity, volcanic hot springs, and eco-dive resorts.',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    coordinates: { lat: -5.5500, lng: 150.1500 }
  },
  {
    id: 'milne-bay',
    name: 'Milne Bay',
    region: 'Southern',
    capital: 'Alotau',
    description: 'Archipelago of 600 islands, crystal lagoons, the historic Kula Ring exchange, and the National Canoe & Kundu Festival.',
    heroImage: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
    coordinates: { lat: -10.3167, lng: 150.4500 }
  },
  {
    id: 'new-ireland',
    name: 'New Ireland',
    region: 'Islands',
    capital: 'Kavieng',
    description: 'Long ribbon island renowned for epic wave surfing, Malagan wooden carvings, WWII plane wrecks, and the Boluminski Highway.',
    heroImage: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop&q=80',
    coordinates: { lat: -2.5744, lng: 150.7967 }
  },
  {
    id: 'madang',
    name: 'Madang',
    region: 'Momase',
    capital: 'Madang',
    description: 'Coined the "Prettiest Town in the South Pacific", famed for deep harbor diving, Flying Fox roosts, and coastal villages.',
    heroImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80',
    coordinates: { lat: -5.2167, lng: 145.8000 }
  },
  {
    id: 'oro',
    name: 'Oro (Northern)',
    region: 'Southern',
    capital: 'Popondetta',
    description: 'Fjord-like sunken volcanic calderas at Tufi, spectacular coral shelf drop-offs, and habitat of Queen Alexandra Birdwing butterfly.',
    heroImage: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800&auto=format&fit=crop&q=80',
    coordinates: { lat: -9.0833, lng: 149.3167 }
  },
  {
    id: 'hela',
    name: 'Hela',
    region: 'Highlands',
    capital: 'Tari',
    description: 'Highland territory celebrated for the Huli Wigmen, magnificent highland moss forests, and pristine birdwatching reserves.',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
    coordinates: { lat: -5.8450, lng: 142.9460 }
  }
];

export const TOURISM_CATEGORIES: TourismCategory[] = [
  {
    id: 'cat-trekking',
    name: 'Trekking & Adventure',
    iconName: 'Footprints',
    description: 'Challenging wilderness trails including Kokoda Track, Black Cat, and Mt Wilhelm ascents.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
  },
  {
    id: 'cat-diving',
    name: 'Scuba Diving & Liveaboards',
    iconName: 'Waves',
    description: 'Pristine coral atolls, barrier reefs, WWII plane and ship wreck explorations.',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300'
  },
  {
    id: 'cat-culture',
    name: 'Cultural Festivals & Singsings',
    iconName: 'Sparkles',
    description: 'Authentic tribal cultural shows, customary ceremonies, singsing performances, and crafts.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
  },
  {
    id: 'cat-eco-lodge',
    name: 'Eco-Lodges & Rainforest Retreats',
    iconName: 'Trees',
    description: 'Sustainable wilderness accommodation embedded in virgin rainforests and river basins.',
    badgeColor: 'bg-green-100 text-green-800 border-green-300'
  },
  {
    id: 'cat-surfing',
    name: 'Surfing & Coastal Expeditions',
    iconName: 'Wind',
    description: 'Uncrowded reef breaks, coastal outrigger expeditions, and surf management reserves.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300'
  },
  {
    id: 'cat-birdwatching',
    name: 'Birdwatching & Wildlife Safaris',
    iconName: 'Feather',
    description: 'Specialist expeditions for Birds of Paradise, tree kangaroos, and endemic orchid species.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300'
  },
  {
    id: 'cat-hospitality',
    name: 'Hotels, Resorts & Lodging',
    iconName: 'Hotel',
    description: 'Modern city hotels, boutique oceanfront resorts, and comfortable provincial transit hubs.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300'
  },
  {
    id: 'cat-homestay',
    name: 'Village Homestays & Community',
    iconName: 'Home',
    description: 'Immersive family stays in traditional rural villages sharing local customs and daily life.',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-300'
  },
  {
    id: 'cat-wwii-heritage',
    name: 'WWII & Historical Heritage',
    iconName: 'Landmark',
    description: 'Guided visits to Pacific War battlefields, memorial cemeteries, tunnels, and relics.',
    badgeColor: 'bg-stone-100 text-stone-800 border-stone-300'
  },
  {
    id: 'cat-transport',
    name: 'Tour Charters & Transport',
    iconName: 'Compass',
    description: 'Licensed passenger transfer fleets, 4WD safari vehicles, and private coastal water-taxis.',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300'
  }
];

export const INITIAL_OPERATORS: TourismOperator[] = [
  {
    id: 'op-png-paradise',
    businessName: 'PNG Paradise Tours Ltd',
    tradingName: 'PNG Paradise Adventures',
    operatorType: 'Tour Operator & Expeditions',
    categoryId: 'cat-trekking',
    categoryName: 'Trekking & Adventure',
    province: 'National Capital District',
    district: 'Moresby South',
    address: 'Suite 4B, Harbourside West, Stanley Esplanade, Port Moresby',
    contactPerson: 'John Wari',
    email: 'info@pngparadisetours.com.pg',
    phone: '+675 321 4455',
    website: 'https://www.pngparadisetours.com.pg',
    description: 'Premier eco-adventure outfitter offering guided Kokoda Track treks, birding expeditions in Varirata National Park, and cultural excursions across the Papuan Coast.',
    latitude: -9.4790,
    longitude: 147.1494,
    registrationStatus: 'Registered',
    membershipStatus: 'Active',
    licenseStatus: 'Active',
    complianceStatus: 'Compliant',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80'
    ],
    features: ['Licensed Kokoda Guides', 'Satellite SOS Tracking', 'Full Camping Gear Provided', 'Local Village Porter Support', 'First Aid Certified'],
    priceRange: 'PGK 850 - PGK 4,200',
    rating: 4.9,
    reviewCount: 48,
    createdDate: '2026-01-15T09:30:00Z',
    lastUpdatedDate: '2026-08-10T14:20:00Z'
  },
  {
    id: 'op-walindi-plantation',
    businessName: 'Walindi Plantation Resort Ltd',
    tradingName: 'Walindi Dive Resort',
    operatorType: 'Dive Resort & Liveaboard',
    categoryId: 'cat-diving',
    categoryName: 'Scuba Diving & Liveaboards',
    province: 'West New Britain',
    district: 'Talasea',
    address: 'Kimbe Bay Coast Highway, Talasea District, Kimbe',
    contactPerson: 'Cecil Rhodes',
    email: 'reservations@walindidive.com.pg',
    phone: '+675 983 5441',
    website: 'https://www.walindidive.com.pg',
    description: 'World-famous boutique dive resort on the shores of Kimbe Bay, boasting pristine coral reefs, seamounts, resident dolphin pods, and eco-bungalows in tropical rainforest.',
    latitude: -5.4333,
    longitude: 150.1000,
    registrationStatus: 'Registered',
    membershipStatus: 'Active',
    licenseStatus: 'Active',
    complianceStatus: 'Compliant',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop&q=80',
    features: ['PADI 5-Star Dive Centre', 'FeBrina & Oceania Liveaboards', 'Rainforest Birdwatching', 'Nitrox Facility', 'Volcano Hot Spring Tours'],
    priceRange: 'PGK 1,200 - PGK 6,500',
    rating: 5.0,
    reviewCount: 92,
    createdDate: '2025-11-20T08:00:00Z',
    lastUpdatedDate: '2026-08-01T11:15:00Z'
  },
  {
    id: 'op-tufi-dive-resort',
    businessName: 'Tufi Resort Operations Ltd',
    tradingName: 'Tufi Dive & Cultural Resort',
    operatorType: 'Resort & Adventure Specialist',
    categoryId: 'cat-diving',
    categoryName: 'Scuba Diving & Liveaboards',
    province: 'Oro (Northern)',
    district: 'Ijivitari',
    address: 'Cape Nelson Fjord Peninsula, Tufi, Oro Province',
    contactPerson: 'Moyuru Kalo',
    email: 'stay@tufiresort.com.pg',
    phone: '+675 323 5995',
    website: 'https://www.tufiresort.com.pg',
    description: 'Perched on cliffs overlooking spectacular volcanic fjords, Tufi offers unmatched reef diving, sea kayaking, deep fjord exploration, and authentic Oro tattoo cultural tours.',
    latitude: -9.0833,
    longitude: 149.3167,
    registrationStatus: 'Registered',
    membershipStatus: 'Active',
    licenseStatus: 'Active',
    complianceStatus: 'Compliant',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    features: ['Fjord Kayaking', 'Toby’s Reef & Outer Atolls', 'Tolai Tattoo Homestay', 'WWII PT Boat Wrecks', 'Helicopter Charters'],
    priceRange: 'PGK 950 - PGK 5,000',
    rating: 4.8,
    reviewCount: 64,
    createdDate: '2025-12-05T10:00:00Z',
    lastUpdatedDate: '2026-07-28T16:40:00Z'
  },
  {
    id: 'op-rabaul-tours',
    businessName: 'Volcano Sightseeing & Historical Tours Ltd',
    tradingName: 'Rabaul Volcano & WWII Expeditions',
    operatorType: 'Historical & Cultural Specialist',
    categoryId: 'cat-wwii-heritage',
    categoryName: 'WWII & Historical Heritage',
    province: 'East New Britain',
    district: 'Kokopo',
    address: 'Williams Road, Kokopo Commercial Precinct, East New Britain',
    contactPerson: 'Ezekiel ToBaining',
    email: 'info@rabaulvolcanotours.com.pg',
    phone: '+675 982 8820',
    website: 'https://www.rabaulvolcanotours.com.pg',
    description: 'Specialist expeditions exploring Mount Tavurvur active caldera, Admiral Yamamoto bunker, submarine bases, Japanese barge tunnels, and the enigmatic Baining Fire Dance.',
    latitude: -4.3421,
    longitude: 152.2683,
    registrationStatus: 'Registered',
    membershipStatus: 'Active',
    licenseStatus: 'Active',
    complianceStatus: 'Compliant',
    heroImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
    features: ['Active Volcano Treks', 'Baining Night Fire Dance', 'Yamamoto Bunker Tours', 'Duke of York Island Day Trips', 'Air-conditioned 4WD'],
    priceRange: 'PGK 450 - PGK 2,400',
    rating: 4.9,
    reviewCount: 51,
    createdDate: '2026-02-10T11:00:00Z',
    lastUpdatedDate: '2026-08-05T09:00:00Z'
  },
  {
    id: 'op-tari-birding-lodge',
    businessName: 'Ambua Highlands Eco-Lodge Ltd',
    tradingName: 'Ambua Lodge & Birding Sanctuary',
    operatorType: 'Highland Eco-Lodge',
    categoryId: 'cat-birdwatching',
    categoryName: 'Birdwatching & Wildlife Safaris',
    province: 'Hela',
    district: 'Tari-Pori',
    address: 'Tari Highlands Ridge, Ambua Gap, Hela Province',
    contactPerson: 'Peter Huli',
    email: 'reservations@ambualodge.com.pg',
    phone: '+675 542 1438',
    website: 'https://www.ambualodge.com.pg',
    description: 'World-renowned eco-lodge situated at 7,000 feet altitude in the Tari Valley. Home to 13 distinct species of Birds of Paradise and the iconic Huli Wigmen bachelor cult.',
    latitude: -5.8450,
    longitude: 142.9460,
    registrationStatus: 'Registered',
    membershipStatus: 'Active',
    licenseStatus: 'Active',
    complianceStatus: 'Compliant',
    heroImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80',
    features: ['13 Bird of Paradise Species', 'Huli Wigmen Cultural Tour', 'Nature Trails & Canopy Bridges', 'Electric Heating in Cabins', 'Orchid Garden'],
    priceRange: 'PGK 1,400 - PGK 7,200',
    rating: 4.9,
    reviewCount: 76,
    createdDate: '2025-10-18T14:30:00Z',
    lastUpdatedDate: '2026-07-15T12:00:00Z'
  },
  {
    id: 'op-goroka-cultural',
    businessName: 'Asaro Cultural Village Experience Ltd',
    tradingName: 'Goroka Mudmen Cultural Homestays',
    operatorType: 'Cultural & Community Tourism',
    categoryId: 'cat-culture',
    categoryName: 'Cultural Festivals & Singsings',
    province: 'Eastern Highlands',
    district: 'Daulo',
    address: 'Asaro Valley Turnoff, Highlands Highway, Goroka',
    contactPerson: 'Benjamin Asaro',
    email: 'mudmen@gorokaculture.com.pg',
    phone: '+675 532 2911',
    website: 'https://www.gorokaculture.com.pg',
    description: 'Immersive cultural tours into the Asaro Mudmen mythology, traditional mumu earth-oven banquets, bamboo flute performances, and organic coffee farm harvests.',
    latitude: -6.0833,
    longitude: 145.3833,
    registrationStatus: 'Registered',
    membershipStatus: 'Active',
    licenseStatus: 'Active',
    complianceStatus: 'Compliant',
    heroImage: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80',
    features: ['Original Mudmen Singsing', 'Traditional Earth Mumu Feast', 'Organic Coffee Roasting', 'Village Guesthouse Accommodation', 'Goroka Show VIP Escort'],
    priceRange: 'PGK 350 - PGK 1,800',
    rating: 4.8,
    reviewCount: 39,
    createdDate: '2026-03-01T09:00:00Z',
    lastUpdatedDate: '2026-08-02T13:45:00Z'
  },
  {
    id: 'op-alotau-canoe',
    businessName: 'Milne Bay Island Charters & Canoes',
    tradingName: 'Milne Bay Coral Sea Expeditions',
    operatorType: 'Marine & Cultural Outfitter',
    categoryId: 'cat-culture',
    categoryName: 'Cultural Festivals & Singsings',
    province: 'Milne Bay',
    district: 'Alotau',
    address: 'Sandershute Waterfront Road, Alotau, Milne Bay',
    contactPerson: 'Salome Didima',
    email: 'tours@milnebaycoralsea.com.pg',
    phone: '+675 641 1234',
    website: 'https://www.milnebaycoralsea.com.pg',
    description: 'Custom island-hopping, Kundu drum carving workshops, traditional war canoe excursions, and trips to the Samarai Island colonial historical enclave.',
    latitude: -10.3167,
    longitude: 150.4500,
    registrationStatus: 'Registered',
    membershipStatus: 'Active',
    licenseStatus: 'Active',
    complianceStatus: 'Compliant',
    heroImage: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&auto=format&fit=crop&q=80',
    features: ['National Canoe Festival Passes', 'Manta Ray Snorkeling at Gona Bara Bara', 'Samarai Island Heritage Walk', 'Skull Cave Tours', 'Fiberglass Outrigger Boats'],
    priceRange: 'PGK 600 - PGK 3,200',
    rating: 4.7,
    reviewCount: 29,
    createdDate: '2026-01-22T10:15:00Z',
    lastUpdatedDate: '2026-07-20T15:10:00Z'
  },
  {
    id: 'op-kavieng-surf',
    businessName: 'Nusa Island Retreat Ltd',
    tradingName: 'Nusa Island Surf & Eco Resort',
    operatorType: 'Surf & Marine Retreat',
    categoryId: 'cat-surfing',
    categoryName: 'Surfing & Coastal Expeditions',
    province: 'New Ireland',
    district: 'Kavieng',
    address: 'Nusa Island, Harbour Passage, Kavieng, New Ireland',
    contactPerson: 'Shaun O’Hanlon',
    email: 'stay@nusaislandretreat.com.pg',
    phone: '+675 984 2247',
    website: 'https://www.nusaislandretreat.com.pg',
    description: 'Authentic traditional island retreat set across the water from Kavieng town. Famous for world-class uncrowded surf breaks, game fishing, and sunset seafood dining.',
    latitude: -2.5744,
    longitude: 150.7967,
    registrationStatus: 'Registered',
    membershipStatus: 'Active',
    licenseStatus: 'Active',
    complianceStatus: 'Compliant',
    heroImage: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&auto=format&fit=crop&q=80',
    features: ['SAPNG Surf Management Area', 'Speedboat Surf Transfers', 'Overwater Bungalows', 'Fresh Mangrove Crab Dining', 'Game Fishing Gear'],
    priceRange: 'PGK 750 - PGK 3,800',
    rating: 4.9,
    reviewCount: 88,
    createdDate: '2025-09-12T07:45:00Z',
    lastUpdatedDate: '2026-08-08T10:30:00Z'
  },
  {
    id: 'op-madang-resort',
    businessName: 'Madang Resort & Kalibobo Cruises Ltd',
    tradingName: 'Madang Resort Hotel & Marina',
    operatorType: 'Luxury Hotel & Cruise Operator',
    categoryId: 'cat-hospitality',
    categoryName: 'Hotels, Resorts & Lodging',
    province: 'Madang',
    district: 'Madang',
    address: 'Coastwatchers Avenue, Waterfront Peninsula, Madang',
    contactPerson: 'Sir Peter Barter',
    email: 'info@madangresort.com.pg',
    phone: '+675 422 2655',
    website: 'https://www.madangresort.com.pg',
    description: 'Landmark 15-acre tropical waterfront resort with private marina, Kalibobo luxury cruise catamaran, helicopter pad, diving center, and Olympic-size swimming pools.',
    latitude: -5.2167,
    longitude: 145.8000,
    registrationStatus: 'Registered',
    membershipStatus: 'Active',
    licenseStatus: 'Active',
    complianceStatus: 'Compliant',
    heroImage: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80',
    features: ['Kalibobo Spirit Catamaran', 'Coastwatchers Memorial Park Walk', 'Niugini Dive Adventures', 'Conference Facilities for 400', 'Four Restaurants & Bars'],
    priceRange: 'PGK 550 - PGK 4,500',
    rating: 4.6,
    reviewCount: 110,
    createdDate: '2025-08-01T08:00:00Z',
    lastUpdatedDate: '2026-08-11T16:00:00Z'
  },
  {
    id: 'op-kokoda-track-expeditions',
    businessName: 'Fuzzy Wuzzy Kokoda Treks Ltd',
    tradingName: 'Kokoda Trail Heritage Guides',
    operatorType: 'Adventure & Trekking',
    categoryId: 'cat-trekking',
    categoryName: 'Trekking & Adventure',
    province: 'Central',
    district: 'Kairuku-Hiri',
    address: 'Sogeri Plateau Basecamp, Sogeri Road, Central Province',
    contactPerson: 'Steven Oro',
    email: 'treks@kokodaheritage.com.pg',
    phone: '+675 325 7711',
    website: 'https://www.kokodaheritage.com.pg',
    description: '100% PNG locally-owned trekking outfitter with direct descendants of the legendary Fuzzy Wuzzy Angels, guiding 8 to 10-day Kokoda historical pilgrimages.',
    latitude: -9.4167,
    longitude: 147.4167,
    registrationStatus: 'Registered',
    membershipStatus: 'Active',
    licenseStatus: 'Active',
    complianceStatus: 'Compliant',
    heroImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    features: ['Kokoda Track Authority Licensed', 'Direct Community Support Royalties', 'Brigade Hill Historian Guides', 'Emergency Evacuation Protocol', 'Weight-balanced Porters'],
    priceRange: 'PGK 3,200 - PGK 7,800',
    rating: 4.9,
    reviewCount: 73,
    createdDate: '2026-02-05T09:10:00Z',
    lastUpdatedDate: '2026-07-29T14:15:00Z'
  },
  {
    id: 'op-hagen-cultural-tours',
    businessName: 'Rondon Ridge Highlands Tours Ltd',
    tradingName: 'Rondon Ridge Mountain Lodge',
    operatorType: 'Eco-Lodge & Cultural Safaris',
    categoryId: 'cat-eco-lodge',
    categoryName: 'Eco-Lodges & Rainforest Retreats',
    province: 'Western Highlands',
    district: 'Mount Hagen',
    address: 'Wahgi Valley Escarpment, Mt Hagen, Western Highlands',
    contactPerson: 'David Kome',
    email: 'stay@rondonridge.com.pg',
    phone: '+675 542 1439',
    website: 'https://www.rondonridge.com.pg',
    description: 'Set on Mount Amingab at 7,100 feet with sweeping panoramic vistas of the Wahgi Valley. Features 180 species of birdlife, orchid trails, and Melpa tribal cultural tours.',
    latitude: -5.8575,
    longitude: 144.2267,
    registrationStatus: 'Registered',
    membershipStatus: 'Active',
    licenseStatus: 'Active',
    complianceStatus: 'Compliant',
    heroImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    features: ['Wahgi Valley Panoramic Views', 'Hagen Show Special Packages', 'Hydro-Electric Powered Lodge', 'Botanical Orchid Reserve', 'Geothermal Heated Rooms'],
    priceRange: 'PGK 1,100 - PGK 5,800',
    rating: 4.8,
    reviewCount: 41,
    createdDate: '2025-11-04T12:00:00Z',
    lastUpdatedDate: '2026-08-04T10:20:00Z'
  },
  {
    id: 'op-lae-international',
    businessName: 'Lae City Hotel & Conference Ltd',
    tradingName: 'Lae International Hotel',
    operatorType: 'Business & Transit Hotel',
    categoryId: 'cat-hospitality',
    categoryName: 'Hotels, Resorts & Lodging',
    province: 'Morobe',
    district: 'Lae Urban',
    address: '4th Street & Markham Road, Top Town, Lae, Morobe',
    contactPerson: 'Angela Morobe',
    email: 'frontdesk@laeintlhotel.com.pg',
    phone: '+675 472 2000',
    website: 'https://www.laeintlhotel.com.pg',
    description: 'The premier 4-star hospitality standard in Morobe, offering luxury executive suites, poolside dining, gymnasium, airport shuttles, and Rainforest Habitat excursions.',
    latitude: -6.7281,
    longitude: 146.9944,
    registrationStatus: 'Registered',
    membershipStatus: 'Active',
    licenseStatus: 'Active',
    complianceStatus: 'Compliant',
    heroImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80',
    features: ['Free Nadzab Airport Shuttle', 'Executive Business Lounge', 'Luluai Italian Restaurant', 'Swimming Pool & Gym', 'Rainforest Habitat Tour Desk'],
    priceRange: 'PGK 480 - PGK 1,950',
    rating: 4.5,
    reviewCount: 84,
    createdDate: '2025-10-01T08:00:00Z',
    lastUpdatedDate: '2026-07-25T11:30:00Z'
  },
  // Sample Pending / Under Review Operators for Demonstrating Workflows
  {
    id: 'op-sepik-river-expeditions',
    businessName: 'Sepik River Canoe Safaris Ltd',
    tradingName: 'Middle Sepik Crocodile Tribal Tours',
    operatorType: 'River & Cultural Expedition',
    categoryId: 'cat-culture',
    categoryName: 'Cultural Festivals & Singsings',
    province: 'Madang',
    district: 'Madang Rural',
    address: 'Pagwi Wharf Access, Sepik River Basin Road',
    contactPerson: 'Alois Yambun',
    email: 'info@sepiksafaris.com.pg',
    phone: '+675 719 8832',
    website: 'https://www.sepiksafaris.com.pg',
    description: 'Motorized dugout canoe expeditions exploring Spirit Houses (Haus Tambaran), crocodile initiation culture, and master woodcarvers in Palembei and Kanganaman.',
    latitude: -4.1200,
    longitude: 143.0500,
    registrationStatus: 'Under Review',
    membershipStatus: 'Pending',
    licenseStatus: 'Pending',
    complianceStatus: 'Conditional',
    heroImage: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80',
    features: ['Haus Tambaran Ceremonial Entry', 'Crocodile Singsing Festival', 'Master Carver Studio Access', 'Overnight Village Guesthouses'],
    priceRange: 'PGK 1,200 - PGK 4,800',
    rating: 4.7,
    reviewCount: 15,
    createdDate: '2026-07-20T10:00:00Z',
    lastUpdatedDate: '2026-08-14T09:15:00Z'
  },
  {
    id: 'op-loloata-island',
    businessName: 'Loloata Island Resort Operations',
    tradingName: 'Loloata Island Luxury Resort',
    operatorType: 'Luxury Island Resort',
    categoryId: 'cat-hospitality',
    categoryName: 'Hotels, Resorts & Lodging',
    province: 'National Capital District',
    district: 'Bootless Bay',
    address: 'Loloata Island, Bootless Bay, Central/NCD Coast',
    contactPerson: 'David Chapman',
    email: 'stay@loloataislandresort.com',
    phone: '+675 7108 8000',
    website: 'https://www.loloataislandresort.com',
    description: 'Luxury private island getaway located 20 minutes from Port Moresby. Overwater villas, Sea-View suites, oceanfront spa, dive center, and private catamaran charter.',
    latitude: -9.5300,
    longitude: 147.2800,
    registrationStatus: 'Registered',
    membershipStatus: 'Active',
    licenseStatus: 'Active',
    complianceStatus: 'Compliant',
    heroImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
    features: ['Overwater Ocean Suites', 'Bootless Bay Marine Sanctuary', 'Sea Spa Wellness Centre', 'Private Catamaran Transfers', 'Gourmet Reef Grill'],
    priceRange: 'PGK 1,100 - PGK 4,900',
    rating: 4.8,
    reviewCount: 128,
    createdDate: '2025-07-15T09:00:00Z',
    lastUpdatedDate: '2026-08-12T10:00:00Z'
  },
  {
    id: 'op-baining-wild',
    businessName: 'Baining Highlands Eco-Trek Ltd',
    tradingName: 'Baining Wilderness Treks',
    operatorType: 'Wilderness Hiking',
    categoryId: 'cat-trekking',
    categoryName: 'Trekking & Adventure',
    province: 'East New Britain',
    district: 'Gazelle',
    address: 'Gaulim Valley Road, Gazelle Peninsula, East New Britain',
    contactPerson: 'Mathew ToVutur',
    email: 'contact@bainingwildtreks.com.pg',
    phone: '+675 982 4433',
    website: 'https://www.bainingwildtreks.com.pg',
    description: 'Rugged guided mountain walks into the Baining ranges, exploring undiscovered waterfalls, rare nocturnal wildlife, and authentic highland hamlet culture.',
    latitude: -4.4500,
    longitude: 152.0500,
    registrationStatus: 'Submitted',
    membershipStatus: 'None',
    licenseStatus: 'Pending',
    complianceStatus: 'Conditional',
    heroImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    features: ['Baining Range Summits', 'Jungle Survival Masterclasses', 'Traditional Bamboo Cooking', 'Certified Bush Guides'],
    priceRange: 'PGK 400 - PGK 1,900',
    rating: 4.6,
    reviewCount: 8,
    createdDate: '2026-08-01T14:20:00Z',
    lastUpdatedDate: '2026-08-16T11:00:00Z'
  }
];

export const INITIAL_REGISTRATIONS: RegistrationApplication[] = [
  {
    id: 'reg-png-paradise',
    applicationNumber: 'TPA-REG-2026-0012',
    operatorId: 'op-png-paradise',
    operatorName: 'PNG Paradise Tours Ltd',
    status: 'Registered',
    submittedDate: '2026-01-15T09:30:00Z',
    reviewedDate: '2026-01-20T14:00:00Z',
    reviewer: 'Grace Pakur',
    reviewerNotes: 'All IPA business records, Kokoda trail safety certifications, and insurance policies verified. Approved for National Tourism Registry.',
    history: [
      {
        timestamp: '2026-01-15T09:30:00Z',
        fromStatus: 'Draft',
        toStatus: 'Submitted',
        actor: 'John Wari',
        role: 'operator',
        notes: 'Initial formal application submitted with supporting documents.'
      },
      {
        timestamp: '2026-01-17T11:00:00Z',
        fromStatus: 'Submitted',
        toStatus: 'Under Review',
        actor: 'Grace Pakur',
        role: 'staff',
        notes: 'Compliance checklist verification initiated by TPA staff.'
      },
      {
        timestamp: '2026-01-20T14:00:00Z',
        fromStatus: 'Under Review',
        toStatus: 'Approved',
        actor: 'Markus Kaumu',
        role: 'admin',
        notes: 'Full regulatory review completed. Approved for official registration.'
      },
      {
        timestamp: '2026-01-20T15:30:00Z',
        fromStatus: 'Approved',
        toStatus: 'Registered',
        actor: 'Grace Pakur',
        role: 'staff',
        notes: 'Operator registered in National Registry and credentials issued.'
      }
    ]
  },
  {
    id: 'reg-walindi',
    applicationNumber: 'TPA-REG-2025-0089',
    operatorId: 'op-walindi-plantation',
    operatorName: 'Walindi Plantation Resort Ltd',
    status: 'Registered',
    submittedDate: '2025-11-20T08:00:00Z',
    reviewedDate: '2025-11-25T11:00:00Z',
    reviewer: 'Markus Kaumu',
    reviewerNotes: 'PADI 5-star accreditation and marine safety records verified. Full registration status granted.',
    history: [
      {
        timestamp: '2025-11-20T08:00:00Z',
        fromStatus: 'Draft',
        toStatus: 'Submitted',
        actor: 'Cecil Rhodes',
        role: 'operator',
        notes: 'Annual renewal and registration dossier submitted.'
      },
      {
        timestamp: '2025-11-25T11:00:00Z',
        fromStatus: 'Submitted',
        toStatus: 'Approved',
        actor: 'Markus Kaumu',
        role: 'admin',
        notes: 'High compliance rating maintained. Approved.'
      },
      {
        timestamp: '2025-11-25T12:00:00Z',
        fromStatus: 'Approved',
        toStatus: 'Registered',
        actor: 'Grace Pakur',
        role: 'staff',
        notes: 'Registry record updated.'
      }
    ]
  },
  {
    id: 'reg-sepik',
    applicationNumber: 'TPA-REG-2026-0044',
    operatorId: 'op-sepik-river-expeditions',
    operatorName: 'Sepik River Canoe Safaris Ltd',
    status: 'Under Review',
    submittedDate: '2026-07-20T10:00:00Z',
    reviewer: 'Grace Pakur',
    reviewerNotes: 'Awaiting updated marine vessel survey certificate for outboard motorized dugouts.',
    history: [
      {
        timestamp: '2026-07-20T10:00:00Z',
        fromStatus: 'Draft',
        toStatus: 'Submitted',
        actor: 'Alois Yambun',
        role: 'operator',
        notes: 'Application submitted.'
      },
      {
        timestamp: '2026-07-25T14:30:00Z',
        fromStatus: 'Submitted',
        toStatus: 'Under Review',
        actor: 'Grace Pakur',
        role: 'staff',
        notes: 'Requested updated marine safety inspection cert.'
      }
    ]
  },
  {
    id: 'reg-baining',
    applicationNumber: 'TPA-REG-2026-0048',
    operatorId: 'op-baining-wild',
    operatorName: 'Baining Highlands Eco-Trek Ltd',
    status: 'Submitted',
    submittedDate: '2026-08-01T14:20:00Z',
    history: [
      {
        timestamp: '2026-08-01T14:20:00Z',
        fromStatus: 'Draft',
        toStatus: 'Submitted',
        actor: 'Mathew ToVutur',
        role: 'operator',
        notes: 'Application submitted for Gazelle wilderness tours.'
      }
    ]
  }
];

export const INITIAL_MEMBERSHIPS: MembershipRecord[] = [
  {
    id: 'mem-001',
    membershipNumber: 'TPA-MEM-2026-0019',
    operatorId: 'op-png-paradise',
    operatorName: 'PNG Paradise Tours Ltd',
    membershipType: 'Tour Operator Member',
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    status: 'Active',
    feePaid: 2500,
    notes: 'National TPA Tour Operator Association Membership in good standing.'
  },
  {
    id: 'mem-002',
    membershipNumber: 'TPA-MEM-2026-0004',
    operatorId: 'op-walindi-plantation',
    operatorName: 'Walindi Plantation Resort Ltd',
    membershipType: 'Dive & Marine Specialist',
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    status: 'Active',
    feePaid: 3500,
    notes: 'Charter member of PNG Divers Association.'
  },
  {
    id: 'mem-003',
    membershipNumber: 'TPA-MEM-2026-0011',
    operatorId: 'op-tufi-dive-resort',
    operatorName: 'Tufi Resort Operations Ltd',
    membershipType: 'Accommodation Provider',
    startDate: '2026-01-01',
    expiryDate: '2026-12-31',
    status: 'Active',
    feePaid: 3500,
    notes: 'Member of PNG Tourism Industry Association.'
  },
  {
    id: 'mem-004',
    membershipNumber: 'TPA-MEM-2026-0015',
    operatorId: 'op-rabaul-tours',
    operatorName: 'Volcano Sightseeing & Historical Tours Ltd',
    membershipType: 'Tour Operator Member',
    startDate: '2026-02-01',
    expiryDate: '2027-01-31',
    status: 'Active',
    feePaid: 2000,
    notes: 'East New Britain Tourism Bureau Affiliate.'
  },
  {
    id: 'mem-005',
    membershipNumber: 'TPA-MEM-2026-0022',
    operatorId: 'op-goroka-cultural',
    operatorName: 'Asaro Cultural Village Experience Ltd',
    membershipType: 'Eco & Cultural Affiliate',
    startDate: '2026-03-01',
    expiryDate: '2027-02-28',
    status: 'Active',
    feePaid: 1500,
    notes: 'Eastern Highlands Cultural Custodians Chapter.'
  },
  {
    id: 'mem-006',
    membershipNumber: 'TPA-MEM-2025-0078',
    operatorId: 'op-sepik-river-expeditions',
    operatorName: 'Sepik River Canoe Safaris Ltd',
    membershipType: 'Tour Operator Member',
    startDate: '2025-08-01',
    expiryDate: '2026-07-31',
    status: 'Expired',
    feePaid: 1800,
    notes: 'Renewal notice dispatched. Grace period active.'
  }
];

export const INITIAL_LICENSES: LicenseRecord[] = [
  {
    id: 'lic-001',
    licenseNumber: 'TPA-LIC-2026-0081',
    operatorId: 'op-png-paradise',
    operatorName: 'PNG Paradise Tours Ltd',
    licenseType: 'Trekking & Wilderness Guide Licence',
    issueDate: '2026-01-20',
    expiryDate: '2027-01-19',
    status: 'Active',
    conditions: [
      'Maintain maximum guide-to-client ratio of 1:6 on wilderness routes',
      'Mandatory satellite communication beacon on all multi-day treks',
      'Current Kokoda Track Authority permit compliance'
    ],
    notes: 'Endorsed for Central Province and Milne Bay wilderness guiding.'
  },
  {
    id: 'lic-002',
    licenseNumber: 'TPA-LIC-2026-0005',
    operatorId: 'op-walindi-plantation',
    operatorName: 'Walindi Plantation Resort Ltd',
    licenseType: 'Marine & Scuba Charter Licence',
    issueDate: '2026-01-05',
    expiryDate: '2027-01-04',
    status: 'Active',
    conditions: [
      'National Maritime Safety Authority (NMSA) certified dive vessels',
      'Emergency pure oxygen delivery systems on all dive tenders',
      'Qualified divemaster on all offshore excursions'
    ],
    notes: 'Covers Kimbe Bay, Witu Islands, and Fathers Reefs operations.'
  },
  {
    id: 'lic-003',
    licenseNumber: 'TPA-LIC-2026-0023',
    operatorId: 'op-tufi-dive-resort',
    operatorName: 'Tufi Resort Operations Ltd',
    licenseType: 'Hospitality & Guest House Licence',
    issueDate: '2025-12-10',
    expiryDate: '2026-12-09',
    status: 'Active',
    conditions: [
      'Compliance with National Food Sanitation and Water Quality Act',
      'Certified guest rescue vessel operational at all times'
    ],
    notes: 'Covers main resort accommodation and village homestay affiliates.'
  },
  {
    id: 'lic-004',
    licenseNumber: 'TPA-LIC-2026-0037',
    operatorId: 'op-rabaul-tours',
    operatorName: 'Volcano Sightseeing & Historical Tours Ltd',
    licenseType: 'Transport & Tour Vehicle Licence',
    issueDate: '2026-02-15',
    expiryDate: '2027-02-14',
    status: 'Active',
    conditions: [
      'Annual roadworthiness certification for all 4WD transport passenger vehicles',
      'Volcanic hazard briefing protocol provided to all passengers'
    ],
    notes: 'Covers Gazelle Peninsula and Rabaul Caldera tour routes.'
  }
];

export const INITIAL_COMPLIANCE: Record<string, OperatorCompliance> = {
  'op-png-paradise': {
    operatorId: 'op-png-paradise',
    overallStatus: 'Compliant',
    lastAssessedDate: '2026-01-20T14:00:00Z',
    assessorNotes: 'All 6 statutory requirements meet standard. High compliance rating.',
    requirements: [
      {
        id: 'cr-1',
        name: 'Investment Promotion Authority (IPA) Business Registration',
        category: 'Legal',
        status: 'Compliant',
        issueDate: '2024-03-12',
        expiryDate: '2027-03-11',
        documentRef: 'IPA-DOC-449102.pdf',
        verifiedBy: 'Grace Pakur',
        notes: 'IPA entity 1-10293 active and verified.'
      },
      {
        id: 'cr-2',
        name: 'PNG TPA Tourism Commercial Licence',
        category: 'Legal',
        status: 'Compliant',
        issueDate: '2026-01-20',
        expiryDate: '2027-01-19',
        documentRef: 'TPA-LIC-2026-0081.pdf',
        verifiedBy: 'Markus Kaumu',
        notes: 'Licence active in good standing.'
      },
      {
        id: 'cr-3',
        name: 'Public Liability Insurance (PGK 5,000,000)',
        category: 'Insurance',
        status: 'Compliant',
        issueDate: '2026-01-10',
        expiryDate: '2027-01-09',
        documentRef: 'QBE-PNG-POL-8812.pdf',
        verifiedBy: 'Grace Pakur',
        notes: 'Underwritten by QBE Insurance PNG.'
      },
      {
        id: 'cr-4',
        name: 'Wilderness First Aid & Safety Certification',
        category: 'Safety',
        status: 'Compliant',
        issueDate: '2025-06-15',
        expiryDate: '2027-06-14',
        documentRef: 'ST-JOHN-WFA-9912.pdf',
        verifiedBy: 'Grace Pakur',
        notes: 'Certified by St John Ambulance PNG.'
      },
      {
        id: 'cr-5',
        name: 'Internal Revenue Commission (IRC) Tax Clearance',
        category: 'Financial',
        status: 'Compliant',
        issueDate: '2025-11-01',
        expiryDate: '2026-10-31',
        documentRef: 'IRC-TCC-2025-992.pdf',
        verifiedBy: 'Markus Kaumu',
        notes: 'Valid IRC Tax Clearance Certificate on file.'
      },
      {
        id: 'cr-6',
        name: 'Annual Environmental & Community Impact Return',
        category: 'Quality',
        status: 'Compliant',
        issueDate: '2026-01-15',
        expiryDate: '2027-01-14',
        documentRef: 'CEPA-RETURN-2026.pdf',
        verifiedBy: 'Grace Pakur',
        notes: 'Submitted CEPA community royalty distribution record.'
      }
    ]
  },
  'op-walindi-plantation': {
    operatorId: 'op-walindi-plantation',
    overallStatus: 'Compliant',
    lastAssessedDate: '2026-01-05T10:00:00Z',
    assessorNotes: 'World-class compliance rating.',
    requirements: [
      {
        id: 'cr-w1',
        name: 'IPA Business Registration',
        category: 'Legal',
        status: 'Compliant',
        issueDate: '2023-01-10',
        expiryDate: '2028-01-09',
        documentRef: 'IPA-WAL-0021.pdf',
        verifiedBy: 'Grace Pakur'
      },
      {
        id: 'cr-w2',
        name: 'TPA Scuba & Marine Licence',
        category: 'Legal',
        status: 'Compliant',
        issueDate: '2026-01-05',
        expiryDate: '2027-01-04',
        documentRef: 'TPA-LIC-2026-0005.pdf',
        verifiedBy: 'Markus Kaumu'
      },
      {
        id: 'cr-w3',
        name: 'Marine Liability Insurance',
        category: 'Insurance',
        status: 'Compliant',
        issueDate: '2026-01-01',
        expiryDate: '2027-01-01',
        documentRef: 'DAN-INS-2026.pdf',
        verifiedBy: 'Grace Pakur'
      },
      {
        id: 'cr-w4',
        name: 'Dive Safety & Hyperbaric Chamber Affiliation',
        category: 'Safety',
        status: 'Compliant',
        issueDate: '2025-12-01',
        expiryDate: '2026-11-30',
        documentRef: 'DAN-MED-CERT.pdf',
        verifiedBy: 'Grace Pakur'
      }
    ]
  },
  'op-sepik-river-expeditions': {
    operatorId: 'op-sepik-river-expeditions',
    overallStatus: 'Conditional',
    lastAssessedDate: '2026-07-25T14:30:00Z',
    assessorNotes: 'Marine vessel survey pending inspection renewal.',
    requirements: [
      {
        id: 'cr-s1',
        name: 'IPA Business Registration',
        category: 'Legal',
        status: 'Compliant',
        issueDate: '2024-05-10',
        expiryDate: '2027-05-09',
        documentRef: 'IPA-SEP-994.pdf',
        verifiedBy: 'Grace Pakur'
      },
      {
        id: 'cr-s2',
        name: 'NMSA Small Craft Survey Certificate',
        category: 'Safety',
        status: 'Pending',
        issueDate: '2025-06-01',
        expiryDate: '2026-06-01',
        notes: 'Under inspection by provincial maritime officer.'
      },
      {
        id: 'cr-s3',
        name: 'Public Liability Insurance',
        category: 'Insurance',
        status: 'Compliant',
        issueDate: '2026-01-01',
        expiryDate: '2026-12-31',
        documentRef: 'PAC-INS-2026.pdf',
        verifiedBy: 'Grace Pakur'
      }
    ]
  }
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    timestamp: '2026-08-19T08:30:00Z',
    user: 'Markus Kaumu',
    role: 'TPA Administrator',
    action: 'System Health Check & Registry Sync',
    entity: 'System',
    entityId: 'SYS-SYNC-881',
    notes: 'Automated data pipeline verified 32 provincial operator nodes.'
  },
  {
    id: 'aud-002',
    timestamp: '2026-08-16T11:00:00Z',
    user: 'Grace Pakur',
    role: 'TPA Staff',
    action: 'Registration Status Updated',
    entity: 'Registration',
    entityId: 'reg-baining',
    previousStatus: 'Draft',
    newStatus: 'Submitted',
    notes: 'Application received for Baining Highlands Eco-Trek Ltd.'
  },
  {
    id: 'aud-003',
    timestamp: '2026-08-14T09:15:00Z',
    user: 'Grace Pakur',
    role: 'TPA Staff',
    action: 'Registration Status Updated',
    entity: 'Registration',
    entityId: 'reg-sepik',
    previousStatus: 'Submitted',
    newStatus: 'Under Review',
    notes: 'Requested updated marine safety inspection certification.'
  },
  {
    id: 'aud-004',
    timestamp: '2026-08-10T14:20:00Z',
    user: 'Markus Kaumu',
    role: 'TPA Administrator',
    action: 'Licence Renewed & Audit Verified',
    entity: 'Licence',
    entityId: 'lic-001',
    previousStatus: 'Pending Renewal',
    newStatus: 'Active',
    notes: 'Annual license extension granted for PNG Paradise Tours Ltd.'
  },
  {
    id: 'aud-005',
    timestamp: '2026-08-01T10:00:00Z',
    user: 'Grace Pakur',
    role: 'TPA Staff',
    action: 'Membership Created',
    entity: 'Membership',
    entityId: 'mem-001',
    newStatus: 'Active',
    notes: 'Tour Operator Member record established for PNG Paradise Tours Ltd.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Registration Application Approved',
    message: 'PNG Paradise Tours Ltd registration has been verified and added to the National Tourism Registry.',
    timestamp: '2026-08-19T08:00:00Z',
    read: false,
    type: 'workflow',
    operatorId: 'op-png-paradise'
  },
  {
    id: 'notif-2',
    title: 'New Application Pending Review',
    message: 'Baining Highlands Eco-Trek Ltd has submitted a new commercial tour registration.',
    timestamp: '2026-08-16T11:00:00Z',
    read: false,
    type: 'workflow',
    targetRole: 'staff'
  },
  {
    id: 'notif-3',
    title: 'Licence Expiry Warning',
    message: 'Tufi Dive Resort Hospitality licence is due for annual renewal in 110 days.',
    timestamp: '2026-08-12T09:00:00Z',
    read: true,
    type: 'licensing',
    targetRole: 'admin'
  }
];
