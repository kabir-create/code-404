import json
import os
import pandas as pd

print("🔍 Generating mock restaurant data...")

# Create output directory
output_dir = os.path.join(os.path.dirname(__file__), 'scraped_data')
os.makedirs(output_dir, exist_ok=True)
print(f"Output directory: {output_dir}")

# Mock restaurant data
restaurants_data = {
    "Delhi": [
        {"name": "Punjabi By Nature", "cuisine": "North Indian, Punjabi", "rating": 4.3, "location": "Connaught Place", "price_range": "₹₹₹"},
        {"name": "Saravana Bhavan", "cuisine": "South Indian", "rating": 4.1, "location": "Connaught Place", "price_range": "₹₹"},
        {"name": "Cafe Delhi Heights", "cuisine": "Continental, Italian", "rating": 4.4, "location": "Hauz Khas", "price_range": "₹₹"},
        {"name": "Karim's", "cuisine": "Mughlai, North Indian", "rating": 4.5, "location": "Jama Masjid", "price_range": "₹₹"},
        {"name": "Indian Accent", "cuisine": "Modern Indian", "rating": 4.7, "location": "Lodhi Road", "price_range": "₹₹₹₹"},
        {"name": "Bukhara", "cuisine": "North Indian", "rating": 4.6, "location": "Chanakyapuri", "price_range": "₹₹₹₹"},
        {"name": "Moti Mahal", "cuisine": "Mughlai", "rating": 4.2, "location": "Daryaganj", "price_range": "₹₹₹"},
        {"name": "Olive Bar & Kitchen", "cuisine": "Mediterranean", "rating": 4.3, "location": "Mehrauli", "price_range": "₹₹₹"},
        {"name": "Farzi Cafe", "cuisine": "Modern Indian", "rating": 4.4, "location": "Connaught Place", "price_range": "₹₹₹"},
        {"name": "Social", "cuisine": "Continental, Asian", "rating": 4.2, "location": "Hauz Khas", "price_range": "₹₹"},
    ],
    "Mumbai": [
        {"name": "Trishna", "cuisine": "Seafood, Coastal", "rating": 4.6, "location": "Fort", "price_range": "₹₹₹₹"},
        {"name": "Britannia & Co", "cuisine": "Parsi, Iranian", "rating": 4.5, "location": "Ballard Estate", "price_range": "₹₹"},
        {"name": "The Bombay Canteen", "cuisine": "Modern Indian", "rating": 4.7, "location": "Lower Parel", "price_range": "₹₹₹"},
        {"name": "Bademiya", "cuisine": "Mughlai, Kebabs", "rating": 4.3, "location": "Colaba", "price_range": "₹₹"},
        {"name": "Gajalee", "cuisine": "Seafood", "rating": 4.4, "location": "Vile Parle", "price_range": "₹₹₹"},
        {"name": "Wasabi by Morimoto", "cuisine": "Japanese", "rating": 4.6, "location": "Lower Parel", "price_range": "₹₹₹₹"},
        {"name": "Bastian", "cuisine": "Seafood", "rating": 4.5, "location": "Bandra", "price_range": "₹₹₹₹"},
        {"name": "Cafe Mondegar", "cuisine": "Continental", "rating": 4.2, "location": "Colaba", "price_range": "₹₹"},
        {"name": "Soam", "cuisine": "Gujarati, Rajasthani", "rating": 4.4, "location": "Bandra", "price_range": "₹₹₹"},
        {"name": "Masala Library", "cuisine": "Modern Indian", "rating": 4.6, "location": "Bandra Kurla Complex", "price_range": "₹₹₹₹"},
    ],
    "Bangalore": [
        {"name": "Karavalli", "cuisine": "Coastal, South Indian", "rating": 4.6, "location": "Vittal Mallya Road", "price_range": "₹₹₹₹"},
        {"name": "Vidyarthi Bhavan", "cuisine": "South Indian", "rating": 4.3, "location": "Basavanagudi", "price_range": "₹"},
        {"name": "Toit", "cuisine": "Continental, Brewery", "rating": 4.5, "location": "Indiranagar", "price_range": "₹₹₹"},
        {"name": "MTR", "cuisine": "South Indian", "rating": 4.2, "location": "Lalbagh Road", "price_range": "₹₹"},
        {"name": "Koshy's", "cuisine": "Continental, Indian", "rating": 4.1, "location": "MG Road", "price_range": "₹₹"},
        {"name": "Rim Naam", "cuisine": "Thai", "rating": 4.5, "location": "MG Road", "price_range": "₹₹₹₹"},
        {"name": "Truffles", "cuisine": "American, Burgers", "rating": 4.4, "location": "Koramangala", "price_range": "₹₹"},
        {"name": "The Only Place", "cuisine": "Continental, Steaks", "rating": 4.3, "location": "Museum Road", "price_range": "₹₹₹"},
        {"name": "Barbeque Nation", "cuisine": "Multi-Cuisine, BBQ", "rating": 4.2, "location": "Multiple Outlets", "price_range": "₹₹₹"},
        {"name": "Fatty Bao", "cuisine": "Asian, Fusion", "rating": 4.4, "location": "Indiranagar", "price_range": "₹₹₹"},
    ],
    "Pune": [
        {"name": "Malaka Spice", "cuisine": "Asian, Thai", "rating": 4.5, "location": "Koregaon Park", "price_range": "₹₹₹"},
        {"name": "Vaishali", "cuisine": "South Indian", "rating": 4.2, "location": "FC Road", "price_range": "₹₹"},
        {"name": "Arthur's Theme", "cuisine": "Continental", "rating": 4.3, "location": "Koregaon Park", "price_range": "₹₹₹"},
        {"name": "Shabree", "cuisine": "Maharashtrian", "rating": 4.4, "location": "Multiple Outlets", "price_range": "₹₹"},
        {"name": "German Bakery", "cuisine": "Continental, Bakery", "rating": 4.1, "location": "Koregaon Park", "price_range": "₹₹"},
        {"name": "Swig", "cuisine": "Multi-Cuisine", "rating": 4.3, "location": "Koregaon Park", "price_range": "₹₹₹"},
        {"name": "Paasha", "cuisine": "North Indian", "rating": 4.5, "location": "Koregaon Park", "price_range": "₹₹₹₹"},
        {"name": "The Urban Foundry", "cuisine": "Continental", "rating": 4.4, "location": "Baner", "price_range": "₹₹₹"},
        {"name": "Terttulia", "cuisine": "European", "rating": 4.2, "location": "Koregaon Park", "price_range": "₹₹₹"},
        {"name": "High Spirits", "cuisine": "Multi-Cuisine", "rating": 4.3, "location": "Koregaon Park", "price_range": "₹₹₹"},
    ],
    "Hyderabad": [
        {"name": "Paradise", "cuisine": "Biryani, Mughlai", "rating": 4.4, "location": "Secunderabad", "price_range": "₹₹"},
        {"name": "Bawarchi", "cuisine": "Biryani, North Indian", "rating": 4.3, "location": "RTC Cross Roads", "price_range": "₹₹"},
        {"name": "Shah Ghouse", "cuisine": "Biryani, Mughlai", "rating": 4.2, "location": "Tolichowki", "price_range": "₹₹"},
        {"name": "Chutneys", "cuisine": "South Indian", "rating": 4.1, "location": "Banjara Hills", "price_range": "₹₹"},
        {"name": "Ohri's", "cuisine": "Multi-Cuisine", "rating": 4.3, "location": "Multiple Outlets", "price_range": "₹₹₹"},
        {"name": "Flechazo", "cuisine": "Spanish, Continental", "rating": 4.5, "location": "Jubilee Hills", "price_range": "₹₹₹₹"},
        {"name": "Absolute Barbecues", "cuisine": "BBQ, Multi-Cuisine", "rating": 4.4, "location": "Multiple Outlets", "price_range": "₹₹₹"},
        {"name": "Minerva Coffee Shop", "cuisine": "South Indian", "rating": 4.2, "location": "Multiple Outlets", "price_range": "₹₹"},
        {"name": "Jewel of Nizam", "cuisine": "Hyderabadi", "rating": 4.5, "location": "Falaknuma Palace", "price_range": "₹₹₹₹"},
        {"name": "Over The Moon", "cuisine": "Continental", "rating": 4.3, "location": "Banjara Hills", "price_range": "₹₹₹"},
    ]
}

# Build the complete data structure
all_restaurants = []
restaurants_by_city = {}

for city, restaurants in restaurants_data.items():
    city_slug = city.lower()
    restaurants_by_city[city] = []
    
    for i, resto in enumerate(restaurants):
        restaurant = {
            "name": resto["name"],
            "slug": resto["name"].lower().replace(" ", "-").replace("&", "and").replace("'", ""),
            "url": f"https://www.eazydiner.com/{city_slug}/{resto['name'].lower().replace(' ', '-')}",
            "location": resto["location"],
            "cuisine": resto["cuisine"],
            "rating": resto["rating"],
            "price_range": resto["price_range"],
            "image_url": "",
            "phone": "",
            "address": f"{resto['location']}, {city}",
            "city": city,
            "city_slug": city_slug
        }
        all_restaurants.append(restaurant)
        restaurants_by_city[city].append(restaurant)

final_data = {
    "total_count": len(all_restaurants),
    "cities": list(restaurants_by_city.keys()),
    "restaurants_by_city": restaurants_by_city,
    "all_restaurants": all_restaurants
}

# Save to JSON
json_path = os.path.join(output_dir, 'eazydiner_restaurants.json')
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(final_data, f, indent=2, ensure_ascii=False)
print(f"✓ JSON saved to: {json_path}")

# Save to CSV
csv_path = os.path.join(output_dir, 'eazydiner_restaurants.csv')
df = pd.DataFrame(all_restaurants)
df.to_csv(csv_path, index=False, encoding='utf-8')
print(f"✓ CSV saved to: {csv_path}")

print(f"\n✅ Generated {len(all_restaurants)} restaurants across {len(restaurants_by_city)} cities!")
print("\nRestaurants by city:")
for city, restos in restaurants_by_city.items():
    print(f"  {city}: {len(restos)} restaurants")