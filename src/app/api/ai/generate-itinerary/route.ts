import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { preferences } = await request.json()
    
      // Enhanced itinerary generation with real hotels and activities
      const destination = preferences.destination || 'Kenya'
      const budget = preferences.budget || 'mid-range'
      const duration = preferences.duration || '1 week'
      
        // Real hotels and activities based on destination and budget
        const hotels = {
          'Morocco': {
            luxury: [
              { name: 'La Mamounia', type: '5-Star Hotel', cost: 400, location: 'Marrakech' },
              { name: 'Royal Mansour', type: 'Ultra-Luxury Hotel', cost: 500, location: 'Marrakech' },
              { name: 'Four Seasons Casablanca', type: '5-Star Hotel', cost: 350, location: 'Casablanca' }
            ],
            'mid-range': [
              { name: 'Riad Yasmine', type: 'Boutique Hotel', cost: 180, location: 'Marrakech' },
              { name: 'Hotel Continental', type: 'Hotel', cost: 150, location: 'Casablanca' },
              { name: 'Riad Dar Zaman', type: 'Boutique Hotel', cost: 160, location: 'Fes' }
            ],
            budget: [
              { name: 'Hostel Riad Marrakech', type: 'Hostel', cost: 60, location: 'Marrakech' },
              { name: 'Hotel Central', type: 'Hotel', cost: 80, location: 'Casablanca' },
              { name: 'Riad Budget', type: 'Guesthouse', cost: 70, location: 'Fes' }
            ]
          },
          'Egypt': {
            luxury: [
              { name: 'Four Seasons Nile Plaza', type: '5-Star Hotel', cost: 380, location: 'Cairo' },
              { name: 'Sofitel Legend Old Cataract', type: 'Luxury Hotel', cost: 420, location: 'Aswan' },
              { name: 'Ritz Carlton Cairo', type: '5-Star Hotel', cost: 350, location: 'Cairo' }
            ],
            'mid-range': [
              { name: 'Nile Hotel', type: 'Hotel', cost: 180, location: 'Cairo' },
              { name: 'Aswan Hotel', type: 'Hotel', cost: 160, location: 'Aswan' },
              { name: 'Luxor Hotel', type: 'Hotel', cost: 170, location: 'Luxor' }
            ],
            budget: [
              { name: 'Cairo Backpackers', type: 'Hostel', cost: 50, location: 'Cairo' },
              { name: 'Aswan Budget Hotel', type: 'Hotel', cost: 80, location: 'Aswan' },
              { name: 'Luxor Guesthouse', type: 'Guesthouse', cost: 70, location: 'Luxor' }
            ]
          },
          'Tunisia': {
            luxury: [
              { name: 'Four Seasons Tunis', type: '5-Star Hotel', cost: 320, location: 'Tunis' },
              { name: 'Dar El Jeld', type: 'Luxury Hotel', cost: 280, location: 'Tunis' },
              { name: 'Hotel Africa', type: '5-Star Hotel', cost: 300, location: 'Tunis' }
            ],
            'mid-range': [
              { name: 'Hotel Carlton', type: 'Hotel', cost: 150, location: 'Tunis' },
              { name: 'Sidi Bou Said Hotel', type: 'Hotel', cost: 140, location: 'Sidi Bou Said' },
              { name: 'Hammamet Resort', type: 'Resort', cost: 160, location: 'Hammamet' }
            ],
            budget: [
              { name: 'Tunis Backpackers', type: 'Hostel', cost: 40, location: 'Tunis' },
              { name: 'Sidi Bou Said Guesthouse', type: 'Guesthouse', cost: 60, location: 'Sidi Bou Said' },
              { name: 'Hammamet Budget Hotel', type: 'Hotel', cost: 70, location: 'Hammamet' }
            ]
          },
          'Algeria': {
            luxury: [
              { name: 'Sheraton Algiers', type: '5-Star Hotel', cost: 300, location: 'Algiers' },
              { name: 'El Aurassi Hotel', type: 'Luxury Hotel', cost: 280, location: 'Algiers' },
              { name: 'Hotel Sofitel', type: '5-Star Hotel', cost: 320, location: 'Algiers' }
            ],
            'mid-range': [
              { name: 'Hotel El Djazair', type: 'Hotel', cost: 140, location: 'Algiers' },
              { name: 'Hotel Aurassi', type: 'Hotel', cost: 150, location: 'Algiers' },
              { name: 'Constantine Hotel', type: 'Hotel', cost: 130, location: 'Constantine' }
            ],
            budget: [
              { name: 'Algiers Backpackers', type: 'Hostel', cost: 45, location: 'Algiers' },
              { name: 'Constantine Guesthouse', type: 'Guesthouse', cost: 60, location: 'Constantine' },
              { name: 'Oran Budget Hotel', type: 'Hotel', cost: 70, location: 'Oran' }
            ]
          },
          'Kenya': {
          luxury: [
            { name: 'Giraffe Manor', type: 'Boutique Hotel', cost: 450, location: 'Nairobi' },
            { name: 'Angama Mara', type: 'Luxury Lodge', cost: 380, location: 'Maasai Mara' },
            { name: 'Serena Safari Lodge', type: '5-Star Lodge', cost: 320, location: 'Amboseli' }
          ],
          'mid-range': [
            { name: 'Safari Park Hotel', type: 'Resort', cost: 180, location: 'Nairobi' },
            { name: 'Mara Serena Safari Lodge', type: 'Lodge', cost: 220, location: 'Maasai Mara' },
            { name: 'Kilaguni Serena Safari Lodge', type: 'Lodge', cost: 190, location: 'Amboseli' }
          ],
          budget: [
            { name: 'Nairobi Safari Club', type: 'Hotel', cost: 120, location: 'Nairobi' },
            { name: 'Mara Sopa Lodge', type: 'Lodge', cost: 150, location: 'Maasai Mara' },
            { name: 'Amboseli Serena Safari Lodge', type: 'Lodge', cost: 140, location: 'Amboseli' }
          ]
        },
        'Tanzania': {
          luxury: [
            { name: 'Four Seasons Safari Lodge', type: 'Luxury Lodge', cost: 420, location: 'Serengeti' },
            { name: 'Singita Grumeti', type: 'Ultra-Luxury Lodge', cost: 480, location: 'Serengeti' },
            { name: 'Ngorongoro Crater Lodge', type: 'Luxury Lodge', cost: 380, location: 'Ngorongoro' }
          ],
          'mid-range': [
            { name: 'Serena Safari Lodge', type: 'Lodge', cost: 200, location: 'Serengeti' },
            { name: 'Ngorongoro Serena Safari Lodge', type: 'Lodge', cost: 180, location: 'Ngorongoro' },
            { name: 'Arusha Serena Hotel', type: 'Hotel', cost: 160, location: 'Arusha' }
          ],
          budget: [
            { name: 'Serengeti Sopa Lodge', type: 'Lodge', cost: 140, location: 'Serengeti' },
            { name: 'Ngorongoro Sopa Lodge', type: 'Lodge', cost: 130, location: 'Ngorongoro' },
            { name: 'Arusha Hotel', type: 'Hotel', cost: 100, location: 'Arusha' }
          ]
        },
        'Mozambique': {
          luxury: [
            { name: 'Azura Benguerra Island', type: 'Luxury Resort', cost: 400, location: 'Benguerra Island' },
            { name: 'Anantara Bazaruto Island', type: '5-Star Resort', cost: 350, location: 'Bazaruto Island' },
            { name: 'White Pearl Resorts', type: 'Boutique Resort', cost: 320, location: 'Ponta Mamoli' }
          ],
          'mid-range': [
            { name: 'Casa do Mar', type: 'Beach Resort', cost: 180, location: 'Vilanculos' },
            { name: 'Mozambique Lodge', type: 'Lodge', cost: 150, location: 'Maputo' },
            { name: 'Pemba Beach Hotel', type: 'Resort', cost: 160, location: 'Pemba' }
          ],
          budget: [
            { name: 'Hotel Cardoso', type: 'Hotel', cost: 80, location: 'Maputo' },
            { name: 'Pemba Lodge', type: 'Lodge', cost: 100, location: 'Pemba' },
            { name: 'Vilanculos Lodge', type: 'Lodge', cost: 90, location: 'Vilanculos' }
          ]
        },
        'South Africa': {
          luxury: [
            { name: 'Safari Lodge Kruger', type: 'Luxury Lodge', cost: 380, location: 'Kruger National Park' },
            { name: 'Cape Grace Hotel', type: '5-Star Hotel', cost: 350, location: 'Cape Town' },
            { name: 'Sabi Sabi Earth Lodge', type: 'Ultra-Luxury Lodge', cost: 450, location: 'Sabi Sands' }
          ],
          'mid-range': [
            { name: 'Protea Hotel', type: 'Hotel', cost: 180, location: 'Cape Town' },
            { name: 'Kruger Safari Lodge', type: 'Lodge', cost: 200, location: 'Kruger National Park' },
            { name: 'Johannesburg Hotel', type: 'Hotel', cost: 160, location: 'Johannesburg' }
          ],
          budget: [
            { name: 'Backpackers Lodge', type: 'Hostel', cost: 50, location: 'Cape Town' },
            { name: 'Kruger Budget Lodge', type: 'Lodge', cost: 80, location: 'Kruger National Park' },
            { name: 'Johannesburg Hostel', type: 'Hostel', cost: 40, location: 'Johannesburg' }
          ]
        },
        'Zambia': {
          luxury: [
            { name: 'Royal Livingstone Hotel', type: '5-Star Hotel', cost: 400, location: 'Livingstone' },
            { name: 'Tongabezi Lodge', type: 'Luxury Lodge', cost: 350, location: 'Livingstone' },
            { name: 'Sausage Tree Camp', type: 'Ultra-Luxury Camp', cost: 450, location: 'Lower Zambezi' }
          ],
          'mid-range': [
            { name: 'Zambezi Sun Hotel', type: 'Resort', cost: 180, location: 'Livingstone' },
            { name: 'Chongwe River Camp', type: 'Lodge', cost: 200, location: 'Lower Zambezi' },
            { name: 'Lusaka Hotel', type: 'Hotel', cost: 160, location: 'Lusaka' }
          ],
          budget: [
            { name: 'Jollyboys Backpackers', type: 'Hostel', cost: 50, location: 'Livingstone' },
            { name: 'Zambezi Waterfront Lodge', type: 'Lodge', cost: 80, location: 'Livingstone' },
            { name: 'Lusaka Backpackers', type: 'Hostel', cost: 40, location: 'Lusaka' }
          ]
        }
      }

        const activities = {
          'Morocco': [
            { name: 'Marrakech Medina Tour', cost: 60, duration: '4 hours', location: 'Marrakech' },
            { name: 'Atlas Mountains Trek', cost: 120, duration: '8 hours', location: 'Atlas Mountains' },
            { name: 'Sahara Desert Experience', cost: 200, duration: '3 days', location: 'Merzouga' },
            { name: 'Fes Cultural Tour', cost: 80, duration: '6 hours', location: 'Fes' },
            { name: 'Chefchaouen Blue City', cost: 100, duration: '1 day', location: 'Chefchaouen' },
            { name: 'Casablanca City Tour', cost: 70, duration: '4 hours', location: 'Casablanca' },
            { name: 'Traditional Hammam Experience', cost: 50, duration: '2 hours', location: 'Marrakech' },
            { name: 'Berber Village Visit', cost: 90, duration: '6 hours', location: 'Atlas Mountains' }
          ],
          'Egypt': [
            { name: 'Pyramids of Giza Tour', cost: 80, duration: '4 hours', location: 'Cairo' },
            { name: 'Nile River Cruise', cost: 150, duration: '3 days', location: 'Luxor to Aswan' },
            { name: 'Valley of the Kings', cost: 60, duration: '4 hours', location: 'Luxor' },
            { name: 'Karnak Temple Complex', cost: 50, duration: '3 hours', location: 'Luxor' },
            { name: 'Abu Simbel Temples', cost: 120, duration: '8 hours', location: 'Aswan' },
            { name: 'Cairo Museum Tour', cost: 40, duration: '3 hours', location: 'Cairo' },
            { name: 'Red Sea Diving', cost: 100, duration: '4 hours', location: 'Hurghada' },
            { name: 'Islamic Cairo Walking Tour', cost: 45, duration: '3 hours', location: 'Cairo' }
          ],
          'Tunisia': [
            { name: 'Carthage Archaeological Site', cost: 30, duration: '3 hours', location: 'Tunis' },
            { name: 'Sidi Bou Said Village', cost: 25, duration: '2 hours', location: 'Sidi Bou Said' },
            { name: 'El Jem Amphitheater', cost: 40, duration: '4 hours', location: 'El Jem' },
            { name: 'Medina of Tunis Tour', cost: 35, duration: '3 hours', location: 'Tunis' },
            { name: 'Hammamet Beach Day', cost: 20, duration: '6 hours', location: 'Hammamet' },
            { name: 'Dougga Roman Ruins', cost: 45, duration: '5 hours', location: 'Dougga' },
            { name: 'Kairouan Great Mosque', cost: 30, duration: '3 hours', location: 'Kairouan' },
            { name: 'Matmata Troglodyte Dwellings', cost: 60, duration: '6 hours', location: 'Matmata' }
          ],
          'Algeria': [
            { name: 'Algiers Casbah Tour', cost: 40, duration: '3 hours', location: 'Algiers' },
            { name: 'Tassili n\'Ajjer Rock Art', cost: 150, duration: '5 days', location: 'Tassili n\'Ajjer' },
            { name: 'Constantine Bridges Tour', cost: 35, duration: '3 hours', location: 'Constantine' },
            { name: 'Oran Cultural Tour', cost: 30, duration: '4 hours', location: 'Oran' },
            { name: 'Tipaza Roman Ruins', cost: 25, duration: '4 hours', location: 'Tipaza' },
            { name: 'Djemila Archaeological Site', cost: 30, duration: '3 hours', location: 'Djemila' },
            { name: 'Algiers Museums Tour', cost: 20, duration: '3 hours', location: 'Algiers' },
            { name: 'Sahara Desert Adventure', cost: 200, duration: '4 days', location: 'Tamanrasset' }
          ],
          'Kenya': [
          { name: 'Maasai Mara Game Drive', cost: 120, duration: '6 hours', location: 'Maasai Mara National Reserve' },
          { name: 'Amboseli Elephant Safari', cost: 100, duration: '4 hours', location: 'Amboseli National Park' },
          { name: 'Nairobi National Park Tour', cost: 80, duration: '4 hours', location: 'Nairobi National Park' },
          { name: 'Cultural Village Visit', cost: 60, duration: '3 hours', location: 'Maasai Village' },
          { name: 'Hot Air Balloon Safari', cost: 200, duration: '3 hours', location: 'Maasai Mara' },
          { name: 'Giraffe Center Visit', cost: 40, duration: '2 hours', location: 'Nairobi' },
          { name: 'Elephant Orphanage Tour', cost: 50, duration: '2 hours', location: 'Nairobi' },
          { name: 'Nairobi City Tour', cost: 70, duration: '4 hours', location: 'Nairobi' }
        ],
        'Tanzania': [
          { name: 'Serengeti Game Drive', cost: 150, duration: '8 hours', location: 'Serengeti National Park' },
          { name: 'Ngorongoro Crater Tour', cost: 180, duration: '6 hours', location: 'Ngorongoro Crater' },
          { name: 'Tarangire National Park Safari', cost: 120, duration: '6 hours', location: 'Tarangire National Park' },
          { name: 'Lake Manyara Safari', cost: 100, duration: '4 hours', location: 'Lake Manyara National Park' },
          { name: 'Hot Air Balloon Safari', cost: 250, duration: '3 hours', location: 'Serengeti' },
          { name: 'Cultural Tour', cost: 80, duration: '4 hours', location: 'Maasai Village' },
          { name: 'Arusha City Tour', cost: 60, duration: '3 hours', location: 'Arusha' }
        ],
        'Mozambique': [
          { name: 'Bazaruto Island Diving', cost: 120, duration: '4 hours', location: 'Bazaruto Archipelago' },
          { name: 'Benguerra Island Snorkeling', cost: 80, duration: '3 hours', location: 'Benguerra Island' },
          { name: 'Maputo City Tour', cost: 60, duration: '4 hours', location: 'Maputo' },
          { name: 'Vilanculos Beach Day', cost: 40, duration: '6 hours', location: 'Vilanculos' },
          { name: 'Pemba Bay Sailing', cost: 100, duration: '4 hours', location: 'Pemba' },
          { name: 'Cultural Village Tour', cost: 50, duration: '3 hours', location: 'Local Village' },
          { name: 'Mozambique Island History Tour', cost: 70, duration: '4 hours', location: 'Mozambique Island' },
          { name: 'Dhow Sunset Cruise', cost: 90, duration: '3 hours', location: 'Vilanculos Bay' }
        ],
        'South Africa': [
          { name: 'Kruger National Park Safari', cost: 150, duration: '8 hours', location: 'Kruger National Park' },
          { name: 'Cape Town City Tour', cost: 80, duration: '6 hours', location: 'Cape Town' },
          { name: 'Table Mountain Hike', cost: 60, duration: '4 hours', location: 'Table Mountain' },
          { name: 'Robben Island Tour', cost: 40, duration: '3 hours', location: 'Robben Island' },
          { name: 'Wine Tasting Tour', cost: 70, duration: '4 hours', location: 'Stellenbosch' },
          { name: 'Shark Cage Diving', cost: 120, duration: '3 hours', location: 'Gansbaai' },
          { name: 'Cultural Township Tour', cost: 50, duration: '3 hours', location: 'Soweto' },
          { name: 'Boulders Beach Penguin Colony', cost: 30, duration: '2 hours', location: 'Simon\'s Town' }
        ],
        'Zambia': [
          { name: 'Victoria Falls Tour', cost: 80, duration: '4 hours', location: 'Livingstone' },
          { name: 'Devil\'s Pool Swim', cost: 120, duration: '3 hours', location: 'Victoria Falls' },
          { name: 'Lower Zambezi Safari', cost: 150, duration: '8 hours', location: 'Lower Zambezi National Park' },
          { name: 'White Water Rafting', cost: 100, duration: '6 hours', location: 'Victoria Falls' },
          { name: 'Microlight Flight', cost: 200, duration: '1 hour', location: 'Livingstone' },
          { name: 'Cultural Village Tour', cost: 60, duration: '4 hours', location: 'Mukuni Village' },
          { name: 'Sunset Cruise', cost: 90, duration: '3 hours', location: 'Zambezi River' },
          { name: 'Elephant Back Safari', cost: 180, duration: '4 hours', location: 'Livingstone' }
        ]
      }

        // Temporarily return empty array until database is set up
        const verifiedBusinesses: any[] = []
    
    // If no verified businesses exist, return message
    if (verifiedBusinesses.length === 0) {
      return NextResponse.json({
        success: true,
        itinerary: {
          title: `No verified results match your search for ${destination}`,
          duration: `${duration} - ${preferences.travelDates || '2024'}`,
          total_cost: 0,
          days: [],
          transport_options: [],
          recommendations: [
            'No verified businesses have listed their services for this destination yet.',
            'Only verified and trusted businesses appear in AI recommendations.',
            'Check back later as more verified African businesses join the platform.',
            'Consider exploring other destinations that may have verified listings.'
          ],
          message: 'No verified results match your search. Only verified businesses appear in AI recommendations.'
        }
      })
    }
    
    const accommodationBusinesses = verifiedBusinesses.filter(b => 
      b.businessType === 'safari' || b.businessType === 'adventure' || b.duration.includes('day')
    )
    const activityBusinesses = verifiedBusinesses.filter(b => 
      b.businessType === 'cultural' || b.duration.includes('hour')
    )
    
    // Filter by budget
    const budgetFilter = (business: any) => {
      if (budget === 'budget') return business.price <= 200
      if (budget === 'luxury') return business.price >= 300
      return business.price > 200 && business.price < 300
    }
    
    const selectedHotels = accommodationBusinesses.filter(budgetFilter)
    const selectedActivities = activityBusinesses.filter(budgetFilter)
    
    // Use real business data only
    const hotelTier = selectedHotels
    const activityTier = selectedActivities
    
      // Define realistic travel times between major locations (in hours)
      const travelTimes = {
        'Morocco': {
          'Marrakech to Fes': 4,
          'Marrakech to Casablanca': 2.5,
          'Fes to Chefchaouen': 3,
          'Casablanca to Rabat': 1,
          'Marrakech to Atlas Mountains': 1.5,
          'Fes to Merzouga': 8
        },
        'Egypt': {
          'Cairo to Luxor': 1.5,
          'Luxor to Aswan': 3,
          'Cairo to Alexandria': 2.5,
          'Aswan to Abu Simbel': 3.5,
          'Cairo to Hurghada': 1,
          'Luxor to Cairo': 1.5
        },
        'Tunisia': {
          'Tunis to Sidi Bou Said': 0.5,
          'Tunis to Hammamet': 1,
          'Tunis to Kairouan': 2,
          'Tunis to El Jem': 2.5,
          'Tunis to Dougga': 1.5,
          'Tunis to Matmata': 4
        },
        'Algeria': {
          'Algiers to Constantine': 4,
          'Algiers to Oran': 3.5,
          'Algiers to Tipaza': 1,
          'Constantine to Tamanrasset': 2,
          'Algiers to Djemila': 2.5,
          'Algiers to Tassili': 8
        },
        'Kenya': {
          'Nairobi to Maasai Mara': 5,
          'Nairobi to Amboseli': 4,
          'Nairobi to Mombasa': 8,
          'Maasai Mara to Amboseli': 6,
          'Nairobi to Nakuru': 3,
          'Nairobi to Tsavo': 4
        },
        'Tanzania': {
          'Arusha to Serengeti': 6,
          'Arusha to Ngorongoro': 3,
          'Arusha to Tarangire': 2,
          'Serengeti to Ngorongoro': 4,
          'Arusha to Lake Manyara': 2,
          'Arusha to Zanzibar': 1.5
        },
        'Mozambique': {
          'Maputo to Vilanculos': 6,
          'Maputo to Pemba': 8,
          'Vilanculos to Bazaruto': 1,
          'Maputo to Inhambane': 4,
          'Pemba to Quirimbas': 2,
          'Maputo to Gorongosa': 3
        },
        'South Africa': {
          'Cape Town to Johannesburg': 2,
          'Cape Town to Kruger': 2.5,
          'Johannesburg to Kruger': 4,
          'Cape Town to Stellenbosch': 1,
          'Cape Town to Gansbaai': 2,
          'Cape Town to Garden Route': 4
        },
        'Zambia': {
          'Lusaka to Livingstone': 7,
          'Livingstone to Lower Zambezi': 4,
          'Lusaka to South Luangwa': 6,
          'Livingstone to Victoria Falls': 0.5,
          'Lusaka to Kafue': 3,
          'Livingstone to Lusaka': 7
        }
      }

      // Define transport options with realistic costs
      const transportOptions = {
        'Morocco': [
          { type: 'Domestic Flight', costPerHour: 150, speed: 'fast' },
          { type: 'Train (ONCF)', costPerHour: 25, speed: 'medium' },
          { type: 'Bus (CTM)', costPerHour: 15, speed: 'slow' },
          { type: 'Private Transfer', costPerHour: 40, speed: 'medium' },
          { type: 'Car Rental', costPerHour: 20, speed: 'medium' }
        ],
        'Egypt': [
          { type: 'Domestic Flight', costPerHour: 120, speed: 'fast' },
          { type: 'Train (Egyptian Railways)', costPerHour: 20, speed: 'medium' },
          { type: 'Nile Cruise', costPerHour: 80, speed: 'slow' },
          { type: 'Bus', costPerHour: 12, speed: 'slow' },
          { type: 'Private Transfer', costPerHour: 35, speed: 'medium' }
        ],
        'Tunisia': [
          { type: 'Domestic Flight', costPerHour: 100, speed: 'fast' },
          { type: 'Train (SNCFT)', costPerHour: 18, speed: 'medium' },
          { type: 'Bus (SNT)', costPerHour: 10, speed: 'slow' },
          { type: 'Private Transfer', costPerHour: 30, speed: 'medium' },
          { type: 'Car Rental', costPerHour: 15, speed: 'medium' }
        ],
        'Algeria': [
          { type: 'Domestic Flight', costPerHour: 110, speed: 'fast' },
          { type: 'Bus (SNTF)', costPerHour: 12, speed: 'slow' },
          { type: 'Private Transfer', costPerHour: 35, speed: 'medium' },
          { type: 'Car Rental', costPerHour: 18, speed: 'medium' }
        ],
        'Kenya': [
          { type: 'Domestic Flight', costPerHour: 200, speed: 'fast' },
          { type: 'Bus (Modern Coast)', costPerHour: 20, speed: 'slow' },
          { type: 'Private Transfer', costPerHour: 50, speed: 'medium' },
          { type: 'Car Rental', costPerHour: 25, speed: 'medium' }
        ],
        'Tanzania': [
          { type: 'Domestic Flight', costPerHour: 180, speed: 'fast' },
          { type: 'Bus (Dalla Dalla)', costPerHour: 15, speed: 'slow' },
          { type: 'Private Transfer', costPerHour: 45, speed: 'medium' },
          { type: 'Car Rental', costPerHour: 22, speed: 'medium' }
        ],
        'Mozambique': [
          { type: 'Domestic Flight', costPerHour: 160, speed: 'fast' },
          { type: 'Bus (Mozambique Express)', costPerHour: 18, speed: 'slow' },
          { type: 'Private Transfer', costPerHour: 40, speed: 'medium' },
          { type: 'Boat Transfer', costPerHour: 60, speed: 'slow' }
        ],
        'South Africa': [
          { type: 'Domestic Flight', costPerHour: 150, speed: 'fast' },
          { type: 'Bus (Greyhound)', costPerHour: 25, speed: 'slow' },
          { type: 'Private Transfer', costPerHour: 45, speed: 'medium' },
          { type: 'Car Rental', costPerHour: 30, speed: 'medium' }
        ],
        'Zambia': [
          { type: 'Domestic Flight', costPerHour: 170, speed: 'fast' },
          { type: 'Bus (Zambia Railways)', costPerHour: 22, speed: 'slow' },
          { type: 'Private Transfer', costPerHour: 48, speed: 'medium' },
          { type: 'Car Rental', costPerHour: 28, speed: 'medium' }
        ]
      }

      // Generate itinerary with realistic travel time planning
      const days = []
      const numDays = duration.includes('week') ? 7 : duration.includes('days') ? parseInt(duration) : 7
      const usedActivities = new Set()
      const usedHotels = new Set()
      
      // Sort activities by cost to match budget preferences
      const sortedActivities = [...activityTier].sort((a, b) => {
        const costA = a.cost || a.price || 0
        const costB = b.cost || b.price || 0
        if (budget === 'budget') return costA - costB
        if (budget === 'luxury') return costB - costA
        return Math.random() - 0.5 // Random for mid-range
      })

      // Track current location for travel time calculations
      let currentLocation = 'Main City'
      
      for (let i = 1; i <= numDays; i++) {
        const dayActivities = []
        const dayTravel = []
        
        // Select hotel (avoid repetition)
        let hotel
        let attempts = 0
        do {
          hotel = hotelTier[Math.floor(Math.random() * hotelTier.length)]
          attempts++
        } while (usedHotels.has(hotel.name || hotel.businessName) && attempts < 10)
        
        if (hotel && !usedHotels.has(hotel.name || hotel.businessName)) {
          usedHotels.add(hotel.name || hotel.businessName)
        }

        // Calculate travel time if moving to different location
        if (i > 1 && hotel && hotel.location !== currentLocation) {
          const travelKey = `${currentLocation} to ${hotel.location}`
          const reverseKey = `${hotel.location} to ${currentLocation}`
          const travelTime = (travelTimes as any)[destination]?.[travelKey] || (travelTimes as any)[destination]?.[reverseKey] || 2
          
          // Select appropriate transport based on budget and distance
          const availableTransport = (transportOptions as any)[destination] || []
          let selectedTransport = availableTransport[0] // Default to first option
          
          if (budget === 'budget') {
            selectedTransport = availableTransport.find((t: any) => t.speed === 'slow') || availableTransport[0]
          } else if (budget === 'luxury') {
            selectedTransport = availableTransport.find((t: any) => t.speed === 'fast') || availableTransport[0]
          } else {
            selectedTransport = availableTransport.find((t: any) => t.speed === 'medium') || availableTransport[0]
          }
          
          const transportCost = Math.round(selectedTransport.costPerHour * travelTime)
          
          dayTravel.push({
            time: '08:00',
            type: 'Travel',
            from: currentLocation,
            to: hotel.location,
            transport: selectedTransport.type,
            duration: `${travelTime} hours`,
            cost: transportCost,
            note: `Travel time: ${travelTime} hours by ${selectedTransport.type.toLowerCase()}`
          })
          
          currentLocation = hotel.location
        }
        
        // Morning activity (always include one, but account for travel time)
        let morningActivity
        attempts = 0
        do {
          morningActivity = sortedActivities[Math.floor(Math.random() * sortedActivities.length)]
          attempts++
        } while (usedActivities.has(morningActivity.name) && attempts < 10)
        
        if (morningActivity && !usedActivities.has(morningActivity.title || morningActivity.name)) {
          usedActivities.add(morningActivity.title || morningActivity.name)
          
          // Adjust start time based on travel
          const startTime = dayTravel.length > 0 ? '12:00' : '08:00'
          
          dayActivities.push({
            time: startTime,
            activity: morningActivity.title || morningActivity.name,
            location: morningActivity.city || morningActivity.location,
            duration: morningActivity.duration,
            cost: morningActivity.price || morningActivity.cost
          })
        }
        
        // Afternoon activity (if we have time and unused activities)
        if (i > 1 && i < numDays && usedActivities.size < selectedActivities.length) {
          let afternoonActivity
          attempts = 0
          do {
            afternoonActivity = sortedActivities[Math.floor(Math.random() * sortedActivities.length)]
            attempts++
          } while (usedActivities.has(afternoonActivity.name) && attempts < 10)
          
          if (afternoonActivity && !usedActivities.has(afternoonActivity.title || afternoonActivity.name)) {
            usedActivities.add(afternoonActivity.title || afternoonActivity.name)
            dayActivities.push({
              time: '15:00',
              activity: afternoonActivity.title || afternoonActivity.name,
              location: afternoonActivity.city || afternoonActivity.location,
              duration: afternoonActivity.duration,
              cost: afternoonActivity.price || afternoonActivity.cost
            })
          }
        }
        
        days.push({
          day: i,
          date: `2024-03-${i.toString().padStart(2, '0')}`,
          activities: dayActivities,
          travel: dayTravel,
          accommodation: {
            name: hotel.businessName || hotel.name,
            type: hotel.businessType || hotel.type,
            cost: hotel.price || hotel.cost,
            location: hotel.city || hotel.location
          }
        })
      }
    
    // Calculate total cost including travel
    const totalCost = days.reduce((sum, day) => {
      const activityCost = day.activities.reduce((actSum, activity) => actSum + activity.cost, 0)
      const travelCost = day.travel?.reduce((travelSum, travel) => travelSum + travel.cost, 0) || 0
      return sum + activityCost + day.accommodation.cost + travelCost
    }, 0)

    // Get available transport options for the destination
    const availableTransportOptions = (transportOptions as any)[destination]?.map((t: any) => t.type) || []

    const mockItinerary = {
      title: `Amazing ${destination} Adventure`,
      duration: `${duration} - ${preferences.travelDates || '2024'}`,
      total_cost: totalCost,
      days: days,
      transport_options: availableTransportOptions,
      recommendations: [
        'Pack light but bring layers for temperature changes',
        'Bring a good camera for wildlife photography',
        'Try local cuisine and interact with communities',
        'Respect wildlife and follow guide instructions',
        'Bring sunscreen and insect repellent',
        'Book activities in advance during peak season',
        'Consider travel insurance for international visitors',
        'Learn basic local phrases for better cultural interaction',
        'Plan for realistic travel times between locations',
        'Consider domestic flights for long distances to maximize your time',
        'Account for travel time when planning daily activities',
        'Book transport in advance for popular routes'
      ]
    }

    return NextResponse.json({
      success: true,
      itinerary: mockItinerary
    })
  } catch (error) {
    console.error('Error generating itinerary:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate itinerary' },
      { status: 500 }
    )
  }
}