const router = require('express').Router();
const {selectStats} = require('../utils/mysql');

// Handles requests for random images
router.get('/', (req, res) => {
    (async () => {
        try {
            const result = await selectStats();
            res.status(200).json({
                status: 'success',
                message: {
                    chartData: result.chartData,
                    chartData7Day: result.chartData7Day,
                    chartData30Day: result.chartData30Day,
                    chartDataWeekly: result.chartDataWeekly,
                    totalVotes: result.totalVotes.total,
                    averageVotes: result.averageVotes.final_count,
                    totalImages: result.totalImages.count
                }
            });
        } catch (err) {
            console.log(err)
            res.status(500).json({
                status: 'error',
                code: '500',
                message: 'Internal Server Error, try again later.'
            });
        }

    })();
});

exports.router = router;