const router = require("express").Router();
const {
  getCities,
  getRestaurantsByCity,
  getRestaurantDetails,
  searchRestaurants
} = require("../controllers/Restaurant.js");

// Get all cities
router.get("/cities", getCities);

// Get restaurants by city
router.get("/city/:citySlug", getRestaurantsByCity);

// Search restaurants
router.get("/search", searchRestaurants);

// Get single restaurant details
router.get("/:restaurantId", getRestaurantDetails);

module.exports = router;