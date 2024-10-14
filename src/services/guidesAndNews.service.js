const pool = require('../configs/db.config');

const getGuidesAndNews = async (category, limit) => {
    const query = `
    SELECT id, title, type, url, content
    FROM guides_and_news
    WHERE category = $1
    LIMIT $2;
  `;
    const values = [category, limit];

    const result = await pool.query(query, values);
    return result.rows;
};

module.exports = {
    getGuidesAndNews,
};
