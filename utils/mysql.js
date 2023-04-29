const { Sequelize, QueryTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');

const sequelize = new Sequelize(
    process.env.MYSQL_DB,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        dialect: 'mysql',
        host: process.env.MYSQL_HOST,
        port: 3306,
        logging: false
    }
);

// Selects random paths from image_data table
async function selectRandom() {
    const query = `SELECT * FROM image_info ORDER BY RAND() LIMIT 1;`
    const results = await sequelize.query(query, {type: QueryTypes.SELECT});
    return results[0]
}

// Selects a (usually) random pairing from image_data table
async function selectDuel() {
    let results = null
    const highestVotedQuery = `SELECT * FROM image_info WHERE votes = (SELECT MAX(votes) FROM image_info) ORDER BY RAND() LIMIT 1;`
    const highestVoted = await sequelize.query(highestVotedQuery, {type: QueryTypes.SELECT})
    // Flatten the normal distribution for more balanced results
    if (Math.floor(Math.random() * 4) !== 1) {
        lvQuery = `SELECT * FROM image_info WHERE votes = (SELECT MIN(votes) FROM image_info) ORDER BY RAND() LIMIT 1;`
        const res1 = await sequelize.query(lvQuery, {type: QueryTypes.SELECT});
        query = `SELECT * FROM image_info WHERE id != ${res1[0].id} ORDER BY RAND() LIMIT 1;`
        const res2 = await sequelize.query(query, {type: QueryTypes.SELECT});
        results = [...res1, ...res2]
    }  else {
        let query = `SELECT * FROM image_info ORDER BY RAND() LIMIT 2;`
        results = await sequelize.query(query, {type: QueryTypes.SELECT});

        console.log(results[0].votes, results[1].votes, 'highest:', highestVoted[0].votes)
        // If image has been seen the most times, try to find new images
        if (results[0].votes === highestVoted[0].votes || results[1].votes === highestVoted[0].votes) {
            console.log('old', results)
            results = await sequelize.query(query, {type: QueryTypes.SELECT});
            console.log('new', results)
        }
    }

    const uuid = uuidv4()
    const uq = `INSERT INTO uuid_verification (uuid, img1, img2, responded, timestamp) 
        VALUES ('${uuid}', '${results[0].imgname}', '${results[1].imgname}', 0, now());`
    await sequelize.query(uq, {type: QueryTypes.INSERT})

    return {results, uuid}
}

async function checkMax() {
    const totalVotesQuery = `SELECT id - noVotes AS total 
                             FROM (SELECT id FROM uuid_verification ORDER BY ID DESC LIMIT 1) AS a 
                             INNER JOIN (SELECT COUNT(*) AS noVotes FROM uuid_verification WHERE responded = 0) AS b;`
    const totalVotes = (await sequelize.query(totalVotesQuery, {type: QueryTypes.SELECT}))[0]
    return totalVotes.total < 100000
}

// Posts duel results to image_data table
async function postResults(uuid, winner, loser) {
    const totalVotesQuery = `SELECT id - noVotes AS total 
                             FROM (SELECT id FROM uuid_verification ORDER BY ID DESC LIMIT 1) AS a 
                             INNER JOIN (SELECT COUNT(*) AS noVotes FROM uuid_verification WHERE responded = 0) AS b;`
    const uuid_verify = `SELECT uuid, responded FROM uuid_verification 
        WHERE uuid = "${uuid}"   
        AND (img1 = "${winner}" AND img2 = "${loser}")
        OR (img2 = "${winner}" AND img1 = "${loser}")`

    const totalVotes = (await sequelize.query(totalVotesQuery, {type: QueryTypes.SELECT}))[0]
    const uuidQuery = await sequelize.query(uuid_verify, {type: QueryTypes.SELECT})

    if (totalVotes.total < 100000 && uuidQuery && uuidQuery[0] && uuidQuery[0].responded === 0) {
        const setResponded = `UPDATE uuid_verification SET responded = 1 WHERE uuid = "${uuidQuery[0].uuid}"`
        const winnerQuery = `UPDATE image_info SET votes = votes + 1, wins = wins + 1 WHERE imgname = "${winner}"`
        const loserQuery = `UPDATE image_info SET votes = votes + 1, losses = losses + 1 WHERE imgname = "${loser}"`
        const uuidUpdate = await sequelize.query(setResponded, {type: QueryTypes.UPDATE})
        const winnerUpdate = await sequelize.query(winnerQuery, {type: QueryTypes.UPDATE});
        const loserUpdate = await sequelize.query(loserQuery, {type: QueryTypes.UPDATE});
        return [uuidUpdate, winnerUpdate, loserUpdate]
    } else {
        return null
    }
}

// Selects the top 1000 most upvoted images
async function selectTopRated () {
    const ratingQuery = `SELECT imgname, (wins-losses) AS updoots FROM image_info ORDER BY updoots DESC LIMIT 1000;`
    const results = await sequelize.query(ratingQuery, {type: QueryTypes.SELECT});
    return results
}


async function selectBottomRated () {
    const ratingQuery = `SELECT imgname, (wins-losses) AS updoots FROM image_info ORDER BY updoots ASC LIMIT 1000;`
    const results = await sequelize.query(ratingQuery, {type: QueryTypes.SELECT});
    return results
}

async function selectStats() {
    const votesChartQuery = `SELECT  DATE(timestamp) Date, COUNT(DISTINCT uuid) totalCount FROM uuid_verification 
                                    WHERE responded = 1 
                                    GROUP BY DATE(timestamp);`

    const votesChartQuery7Days = `SELECT  DATE(timestamp) Date, COUNT(DISTINCT uuid) totalCount
                                  FROM    uuid_verification
                                  WHERE responded = 1
                                  AND  DATE(timestamp) >= DATE(NOW()) + INTERVAL - 6 DAY
                                  AND DATE(timestamp) <  NOW() + INTERVAL  0 DAY
                                  GROUP   BY  DATE(timestamp);`

    const votesChartQuery30Days = `SELECT  DATE(timestamp) Date, COUNT(DISTINCT uuid) totalCount
                                  FROM    uuid_verification
                                  WHERE responded = 1
                                  AND  DATE(timestamp) >= DATE(NOW()) + INTERVAL - 29 DAY
                                  AND DATE(timestamp) <  NOW() + INTERVAL  0 DAY
                                  GROUP   BY  DATE(timestamp);`

    const votesChartQueryWeekly = `SELECT DATE(timestamp) Date, COUNT(DISTINCT uuid) totalCount
                                   FROM uuid_verification
                                   WHERE responded = 1
                                   GROUP BY YEARWEEK(timestamp, 1);`

    const totalVotesQuery = `SELECT id - noVotes AS total 
                             FROM (SELECT id FROM uuid_verification ORDER BY ID DESC LIMIT 1) AS a 
                             INNER JOIN (SELECT COUNT(*) AS noVotes FROM uuid_verification WHERE responded = 0) AS b;`

    const votesPerSessionQuery = `SELECT (a.c1 / b.c2) - 1 AS final_count FROM 
                                    (SELECT COUNT(*) as c1 from uuid_verification ) a,
                                    (SELECT COUNT(*) as c2 from uuid_verification WHERE responded = 0 ) b;`

    const totalImagesQuery = `SELECT COUNT(*) as count FROM image_info;`

    const chartData = await sequelize.query(votesChartQuery, {type: QueryTypes.SELECT})
    const chartData7Day = await sequelize.query(votesChartQuery7Days, {type: QueryTypes.SELECT})
    const chartData30Day = await sequelize.query(votesChartQuery30Days, {type: QueryTypes.SELECT})
    const chartDataWeekly = await sequelize.query(votesChartQueryWeekly, {type: QueryTypes.SELECT})
    const totalVotes = (await sequelize.query(totalVotesQuery, {type: QueryTypes.SELECT}))[0]
    const averageVotes = (await sequelize.query(votesPerSessionQuery, {type: QueryTypes.SELECT}))[0]
    const totalImages = (await sequelize.query(totalImagesQuery, {type: QueryTypes.SELECT}))[0]

    return {chartData, chartData7Day, chartData30Day, chartDataWeekly, totalVotes, averageVotes, totalImages}
}


module.exports = {
    selectRandom,
    selectDuel,
    postResults,
    selectTopRated,
    selectBottomRated,
    selectStats,
    checkMax
};