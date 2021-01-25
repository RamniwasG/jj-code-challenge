const routes = require('express').Router();

const deviceController = require('./../controllers/device.controller');

routes.get('/', deviceController.getDeviceList)
routes.post('/addDevice', deviceController.addDevice)
routes.put('/updateDeviceById/:id', deviceController.updateDeviceById)
routes.delete('/deleteDeviceById/:id', deviceController.deleteDevice)

module.exports = routes;
