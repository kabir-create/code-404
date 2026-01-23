const { pool } = require("../config/db");

exports.getAllCities = async () => {
  const { rows } = await pool.query(`
    SELECT 
      city,
      city_slug,
      COUNT(*) as restaurant_count,
      ROUND(AVG(rating)::numeric, 2) as avg_rating
    FROM restaurants
    WHERE is_active = true
    GROUP BY city, city_slug
    ORDER BY restaurant_count DESC
  `);
  return rows;
};

exports.getRestaurantsByCity = async (citySlug, filters = {}) => {
  let query = `
    SELECT 
      id, name, address, city, cuisine, rating, 
      price_range, image_url, phone_no
    FROM restaurants
    WHERE (city_slug = $1 OR LOWER(city) = LOWER($1))
    AND is_active = true
  `;
  
  const params = [citySlug];
  let paramCount = 1;
  
  if (filters.search) {
    paramCount++;
    query += ` AND (name ILIKE $${paramCount} OR cuisine ILIKE $${paramCount})`;
    params.push(`%${filters.search}%`);
  }
  
  if (filters.minRating) {
    paramCount++;
    query += ` AND rating >= $${paramCount}`;
    params.push(parseFloat(filters.minRating));
  }
  
  query += ` ORDER BY rating DESC`;
  
  const { rows } = await pool.query(query, params);
  return rows;
};

exports.getRestaurantById = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM restaurants WHERE id = $1 AND is_active = true`,
    [id]
  );
  return rows[0];
};

exports.searchRestaurants = async (filters = {}) => {
  let query = `
    SELECT 
      id, name, address, city, cuisine, rating, 
      price_range, image_url
    FROM restaurants
    WHERE is_active = true
  `;
  
  const params = [];
  let paramCount = 0;
  
  if (filters.q) {
    paramCount++;
    query += ` AND (name ILIKE $${paramCount} OR cuisine ILIKE $${paramCount})`;
    params.push(`%${filters.q}%`);
  }
  
  if (filters.city) {
    paramCount++;
    query += ` AND city ILIKE $${paramCount}`;
    params.push(`%${filters.city}%`);
  }
  
  query += ` ORDER BY rating DESC LIMIT 50`;
  
  const { rows } = await pool.query(query, params);
  return rows;
};