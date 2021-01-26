const express = require('express');
const {
	isLoggedIn,
	hasManagementPermission,
} = require('../../route-hooks/common');
const router = new express.Router();

router.use('/login', require('./login'));

router.use(isLoggedIn());
router.use(hasManagementPermission());

router.use('/logout', require('./logout'));
router.use('/users', require('./user'));
router.use('/channels', require('./channel'));
router.use('/tags', require('./tag'));
router.use('/orders', require('./order'));

module.exports = router;
