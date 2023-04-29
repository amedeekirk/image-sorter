const router = require('express').Router();
const {postResults} = require('../utils/mysql');

// Handles response for duel pairing
router.post('/', (req, res) => {
    (async () => {
        if (!req.body.winner || !req.body.loser || !req.body.uuid) {
            res.status(400).json({
                message: 'missing data'
            })
        } else {
            try {
                const result = await postResults(req.body.uuid, req.body.winner, req.body.loser);
                res.status(200).json({
                    status: 'success'
                });
            } catch (err) {
                console.log(err)
                res.status(500).json({
                    status: 'error',
                    code: '500',
                    message: 'Internal Server Error, try again later.'
                });
            }
        }

    })();
});

exports.router = router;