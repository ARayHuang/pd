const express = require('express');
const { isLoggedIn } = require('../../route-hooks/common');
const router = new express.Router();

router.use('/login', require('./login'));

router.use(isLoggedIn());

router.use('/logout', require('./logout'));
router.use('/users', require('./user'));
router.use('/tags', require('./tag'));
router.use('/channels', require('./channel'));
router.use('/orders', require('./order'));
router.use('/invitations', require('./invitation'));

module.exports = router;
