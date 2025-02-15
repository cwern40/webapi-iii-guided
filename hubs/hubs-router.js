const express = require('express');

const Hubs = require('./hubs-model.js');
const Messages = require('../messages/messages-model.js');

const router = express.Router();

// this only runs if the url has /api/hubs in it
router.get('/', (req, res) => {
  Hubs.find(req.query)
  .then(hubs => {
    res.status(200).json(hubs);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error retrieving the hubs',
    });
  });
});

// /api/hubs/:id

router.get('/:id', validateId, (req, res) => {
  res.status(200).json(req.hub)
});

router.post('/', (req, res) => {
  Hubs.add(req.body)
  .then(hub => {
    res.status(201).json(hub);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error adding the hub',
    });
  });
});

router.delete('/:id', validateId, (req, res) => {
  Hubs.remove(req.params.id)
  .then(count => {
      res.status(200).json({ message: 'The hub has been nuked' });
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error removing the hub',
    });
  });
});

router.put('/:id', validateId, (req, res) => {
  Hubs.update(req.params.id, req.body)
  .then(hub => {
      res.status(200).json(hub);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error updating the hub',
    });
  });
});

// add an endpoint that returns all the messages for a hub
// this is a sub-route or sub-resource
router.get('/:id/messages', (req, res) => {
  Hubs.findHubMessages(req.params.id)
  .then(messages => {
    res.status(200).json(messages);
  })
  .catch (error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error getting the messages for the hub',
    });
  });
});

// add an endpoint for adding new message to a hub
router.post('/:id/messages', (req, res) => {
  const messageInfo = { ...req.body, hub_id: req.params.id };

  Messages.add(messageInfo)
  .then(message => {
    res.status(210).json(message);
  })
  .catch(error => {
    // log error to server
    console.log(error);
    res.status(500).json({
      message: 'Error getting the messages for the hub',
    });
  });
});

function validateId(req, res, next) {
  const { id } = req.params;

  Hubs.findById(id)
  .then(hub => {
    if (hub) {
      req.hub = hub
      next();
    } else {
      res.status(404).json({
        message: 'No hub with given id'
      })
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'Error processing the request'
    });
  }) ;
}

module.exports = router;
