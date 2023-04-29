const router = require('express').Router();
const {selectDuel, checkMax} = require('../utils/mysql');

// Handles requests for a duel pairing
router.get('/', (req, res) => {
    (async () => {
        try {
            const isBelowMax = await checkMax();
            if (isBelowMax) {
                const result = await selectDuel();
                res.status(200).json({
                    status: 'success',
                    message: {
                        images: [
                            `https://d30qdzipuz6ou2.cloudfront.net/${result.results[0].imgname}`,
                            `https://d30qdzipuz6ou2.cloudfront.net/${result.results[1].imgname}`
                        ],
                        uuid: result.uuid
                    }
                });
            } else {
                res.status(202).json({
                    status: 'accepted',
                    message: 'Voting has concluded'

                })
            }
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