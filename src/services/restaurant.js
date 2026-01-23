const Restaurant = require("../models/Restaurant");

exports.getCities = async () => {
  return await Restaurant.getAllCities();
};

exports.getRestaurantsByCity = async (citySlug, filters) => {
  return await Restaurant.getRestaurantsByCity(citySlug, filters);
};

exports.getRestaurantDetails = async (restaurantId) => {
  const restaurant = await Restaurant.getRestaurantById(restaurantId);
  if (!restaurant) {
    throw new Error("Restaurant not found");
  }
  return restaurant;
};

exports.searchRestaurants = async (filters) => {
  return await Restaurant.searchRestaurants(filters);
};