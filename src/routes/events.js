const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const cors = require('cors');
let corsOptions = {
    origin: 'https://schulcloud.github.io'
};
router.use(cors(corsOptions));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

// Queries
const deleteEvent = require('../queries/deleteEvent');

// HTTP Requests
const newNotificationForScopeIds = require('../http-requests/newNotificationForScopeIds');

// Authorization
const authorize = require("../authorization/index");

// Services
const getEvents = require('../services/events/getEvents');
const getScopesForToken = require('../services/scopes/getScopesForToken');
const createAndSendNotification = require('../services/notifications/createAndSendNotification');

// Event Handler
const returnSuccess = require('./utils/returnSuccess');
const returnError = require('./utils/returnError');
const returnSuccessWithoutContent = require('./utils/returnSuccessWithoutContent');
const returnJSONResponse = require('./utils/returnJSONResponse');

router.options('/:eventId', cors(corsOptions));

// DELETE /events/:eventId
router.delete('/:eventId', authorize, function (req, res) {
    const eventId = req.params.eventId;
    Promise.resolve(deleteEvent([eventId])).then(
        function (result) {
            returnSuccessWithoutContent(res);
            createAndSendNotification.forDeletedEvent(req.body.scopeIds);
        },
        returnError.bind(null, res)
    );
});

// GET /events/
router.get('/', authorize, function (req, res) {
    const filter = {
        scopeId: req.get('scope-id'),
        eventId: req.get('event-id'),
        from: req.get('from'),
        until: req.get('until'),
        all: req.get('all')
    };
    const token = req.get('Authorization');
    Promise.resolve(getEvents(filter, token)).then(
        function (result) {
            returnJSONResponse(res, result);
        },
        returnError.bind(null, res)
    );
});

// POST /events/
router.post('/', authorize, function (req, res) {
    // TODO: implement
    returnError(res);

    // Promise.resolve(/*TODO*/).then(
    //     function (result) {
    //         res.status(200).send(/*TODO*/);
    //         createAndSendNotification.forNewEvent(req.body.scopeIds);
    //     },
    //     returnError.bind(null, res)
    // );
});

// PUT /events/:eventId
router.put('/:eventId', authorize, function (req, res) {
    // TODO: implement
    returnError(res);

    // Promise.resolve(/*TODO*/).then(
    //     function (result) {
    //         res.status(200).send(/*TODO*/);
    //         createAndSendNotification.forModifiedEvent(req.body.scopeIds);
    //     },
    //     returnError.bind(null, res)
    // );
});

module.exports = router;
