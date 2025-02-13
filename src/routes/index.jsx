import { createHashRouter } from 'react-router-dom';
import App from '../App';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import ShoppingCar from '../pages/ShoppingCart';
import HomePage from '../pages/HomePage';
import NotFound from '../pages/NotFound';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'products',
        element: <Products />,
      },
      {
        path: 'product/:id',
        element: <ProductDetail />,
      },
      {
        path: 'cart',
        element: <ShoppingCar />,
      },
      {
        path:'*',
        element:<NotFound/>,
      },
    ],
  },
];

const router = createHashRouter(routes);
export default router;
