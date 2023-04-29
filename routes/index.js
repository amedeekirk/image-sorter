const router = module.exports = require('express').Router();

router.use('/random', require('./random').router);
router.use('/duel', require('./duel').router);
router.use(`/results`, require('./results').router);
router.use(`/ranking`, require('./ranking').router);
router.use(`/stats`, require('./stats').router);
// router.use('/', require('./static').router);

// FUTURE ENDPOINTS
// router.use('/top', require('./top').router);
// router.use('/report', require('./id').router);

