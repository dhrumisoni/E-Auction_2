import db from "../Config/db.js";

// Function to get cities with hierarchical data
export const getCitiesWithHierarchy = async (id = 0) => {
  let query = `
    SELECT 
      cities.id AS city_id,
      cities.name AS city_name,
      states.name AS state_name,
      countries.name AS country_name,
      subregions.name AS subregion_name,
      regions.name AS region_name
    FROM cities
    INNER JOIN states ON cities.state_id = states.id
    INNER JOIN countries ON states.country_id = countries.id
    INNER JOIN subregions ON countries.subregion_id = subregions.id
    INNER JOIN regions ON subregions.region_id = regions.id
  `;
  
  // If id is provided, filter by city_id
  if (id !== 0) {
    query += ` WHERE cities.id = ${id}`;
  }

  // Execute the query and await the result
  const result = await db.query(query, { type: db.QueryTypes.SELECT });

  return result;
};

export default getCitiesWithHierarchy;
