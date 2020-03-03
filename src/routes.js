import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import OrderController from './app/controllers/OrderController';
import DeliveredOrderController from './app/controllers/DeliveredOrderController';
import UndeliveredOrderController from './app/controllers/UndeliveredOrderController';
import PickupController from './app/controllers/PickupController';
import DeliveryController from './app/controllers/DeliveryController';
import ProblemDashboardController from './app/controllers/ProblemDashboardController';
import ProblemController from './app/controllers/ProblemController';

import authentication from './app/middlewares/authentication';
import RecipientCheckData from './app/middlewares/RecipientCheckData';
import CheckAdministration from './app/middlewares/checkAdministration';

const upload = multer(multerConfig);
const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authentication);
routes.use(CheckAdministration);
routes.post('/files', upload.single('file'), FileController.store);

routes.get('/deliverymen', DeliverymanController.index);
routes.post('/deliverymen', DeliverymanController.create);
routes.put('/deliverymen/:id', DeliverymanController.update);
routes.delete('/deliverymen/:id', DeliverymanController.delete);

routes.get('/deliverymen/:id/deliveries', DeliveredOrderController.index);
routes.get('/deliverymen/:id/undelivered', UndeliveredOrderController.index);

routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.post(
    '/deliverymen/:delivermanId/orders/:/pickup',
    PickupController.store
);
routes.post(
    '/deliverymen/:delivermanId/orders/:orderId/delivery',
    DeliveryController.store
);

routes.get('/deliveries/problems', ProblemDashboardController.index);
routes.get('/delivery/:id/problems', ProblemController.index);
routes.post('/delivery/:id/problems', ProblemController.store);

routes.post('/recipients', RecipientCheckData, RecipientController.store);
routes.put('/recipients/:id', RecipientCheckData, RecipientController.update);

export default routes;
