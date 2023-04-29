const router = require('express').Router();
const {selectTopRated, selectBottomRated} = require('../utils/mysql');

// Handles requests for random images
router.get('/', (req, res) => {
    (async () => {
        try {
            let result = null
            if (req.query.bottom === 'true') {
                result = await selectBottomRated()
            } else {
                result = await selectTopRated();
            }
            res.status(200).json({
                status: 'success',
                message: result
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