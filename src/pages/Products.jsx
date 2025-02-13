
import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactLoading from 'react-loading';
import { Link} from 'react-router-dom';
const { VITE_BASE_URL, VITE_API_PATH } = import.meta.env

export default function Products() {

  const [Products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isScreenLoading, setIsScreenLoading] = useState(false);

  useEffect(() => {
    const getProductsSource = async () => {
      setIsScreenLoading(true);
      try {
        const getProduct = await axios.get(
          `${VITE_BASE_URL}/v2/api/${VITE_API_PATH}/products`
        );
        setProducts(getProduct.data.products);
      } catch (error) {
        alert(error.message);
      } finally {
        setIsScreenLoading(false);
      }
    };
    getProductsSource();
  }, []);

  const addCartItems = async (product_id, qty) => {
    setIsLoading(true);
    try {
      await axios.post(`${VITE_BASE_URL}/v2/api/${VITE_API_PATH}/cart`, {
        data: {
          product_id,
          qty: parseInt(qty),
        },
      });
    } catch (error) {
      alert('加入購物車失敗');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='container'>
      <table className='table align-middle'>
        <thead>
          <tr>
            <th>圖片</th>
            <th>商品名稱</th>
            <th>價格</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Products.map((product) => (
            <tr key={product.id}>
              <td style={{ width: '200px' }}>
                <div>
                  <img
                    className='img-fluid'
                    src={product.imageUrl}
                    alt={product.title}
                  />
                </div>
              </td>
              <td>
                <p className='fs-5 fw-medium'>{product.title}</p>
              </td>
              <td>
                <div className='h5'></div>
                <del className='h6'>原價{product.origin_price}</del>
                <div className='h5'>優惠價{product.price}</div>
              </td>
              <td>
                <div className='btn-group btn-group-sm'>
                  <Link
                  to={`/product/${product.id}`}
                    type='button'
                    className='btn btn-outline-secondary'
                  >
                    <i className='fas fa-spinner fa-pulse'></i>
                    查看更多
                  </Link>
                  <button
                    type='button'
                    disabled={isLoading}
                    className='btn btn-outline-danger d-flex align-items-center gap-2'
                    onClick={() => addCartItems(product.id, 1)}
                  >
                    立即預訂
                    {isLoading && (
                      <ReactLoading
                        type={'spin'}
                        color={'#000'}
                        height={'1.5rem'}
                        width={'1.5rem'}
                      />
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isScreenLoading && (
          <div
            className='d-flex justify-content-center align-items-center'
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(255,255,255,0.3)',
              zIndex: 999,
            }}
          >
            <ReactLoading
              type='spin'
              color='black'
              width='4rem'
              height='4rem'
            />
          </div>
        )}
    </div>
  );
}
