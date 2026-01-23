const restaurantService = require("../services/restaurant.service");

exports.getCities = async (req, res) => {
  try {
    const cities = await restaurantService.getCities();
    res.json({
      success: true,
      cities,
      total: cities.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRestaurantsByCity = async (req, res) => {
  try {
    const { citySlug } = req.params;
    const filters = {
      search: req.query.search,
      minRating: req.query.minRating
    };
    
    const restaurants = await restaurantService.getRestaurantsByCity(citySlug, filters);
    
    res.json({
      success: true,
      city: citySlug,
      restaurants,
      count: restaurants.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRestaurantDetails = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await restaurantService.getRestaurantDetails(restaurantId);
    
    res.json({
      success: true,
      restaurant
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.searchRestaurants = async (req, res) => {
  try {
    const filters = {
      q: req.query.q,
      city: req.query.city,
      cuisine: req.query.cuisine,
      minRating: req.query.minRating
    };
    
    const restaurants = await restaurantService.searchRestaurants(filters);
    
    res.json({
      success: true,
      restaurants,
      count: restaurants.length
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};