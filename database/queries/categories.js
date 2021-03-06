import { Database } from "../index";

/**
 * gets an access token and institution_id for an item_id
 *
 * @param {Object} categories the categories to save.
 * @returns {Void}.
 */
const saveCategories = async (categories) => {
  const db = new Database();
  const pendingQueries = categories.map(async (category) => {
    let categoryName, categorySub, categoryDetail;

    if (category.hierarchy?.length > 0) {
      categoryName = category.hierarchy[0];
    }
    if (category?.hierarchy.length > 1) {
      categorySub = category.hierarchy[1];
    }
    if (category?.hierarchy.length > 2) {
      categoryDetail = category.hierarchy[2];
    }

    const sql = `
    INSERT INTO categories
      (
        category,
        subcategory
      )
    VALUES ($1, $2)
    ON CONFLICT (category,subcategory)
    DO UPDATE SET
      category=$1,
      subcategory=$2
  `;

    await db.save(sql, [categoryName ?? null, categorySub ?? "Other"]);
  });

  try {
    await Promise.all(pendingQueries);
  } catch (error) {
    console.error(error);
  } finally {
    await db.end();
  }
};

export { saveCategories };
