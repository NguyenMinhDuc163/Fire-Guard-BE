const pool = require('../configs/db.config');

const getGuidesAndNews = async (category, limit) => {
    const query = `
    SELECT id, title, type, url, content
    FROM guides_and_news
    WHERE category = $1 ORDER BY id
    LIMIT $2 ; 
  `;
    const values = [category, limit];

    const result = await pool.query(query, values);
    return result.rows;
};

const addMultipleGuidesAndNews = async (guidesAndNews) => {
    const query = `
    INSERT INTO guides_and_news (title, type, url, content, category)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

    for (let item of guidesAndNews) {
        const { title, type, url, content, category } = item;
        const values = [title, type, url, content, category];
        await pool.query(query, values);
    }
};
module.exports = {
    getGuidesAndNews,
    addMultipleGuidesAndNews
};