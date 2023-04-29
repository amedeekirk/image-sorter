const router = require('express').Router();
const {selectRandom} = require('../utils/mysql');

// Handles requests for random images
router.get('/', (req, res) => {
    (async () => {
        try {
            const result = await selectRandom();
            res.status(200).json({
                status: 'success',
                message: `https://d30qdzipuz6ou2.cloudfront.net/${result.imgname}`
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