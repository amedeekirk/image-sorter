const express = require("express");
const router = require('express').Router();
const path = require('path');

// Handles requests for random images
router.get(['/', '/analytics', '/analytics/*'], (req, res) => {
    (async () => {
        try {
            res.sendFile(path.join(__dirname, '../client/dist'));
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