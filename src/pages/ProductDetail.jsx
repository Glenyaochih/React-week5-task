import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';

const { VITE_BASE_URL, VITE_API_PATH } = import.meta.env;

export default function ProductDetail() {
  const [product, setProduct] = useState({});
  const [qtySelect, setQtySelect] = useState(1);
  const { id: product_id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProductSource = async () => {
      // setIsScreenLoading(true);
      try {
        const res = await axios.get(
          `${VITE_BASE_URL}/v2/api/${VITE_API_PATH}/product/${product_id}`
        );
        setProduct(res.data.product);
      } catch (error) {
        alert(error.message);
      } finally {
        // setIsScreenLoading(false);
      }
    };
    getProductSource();
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
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-6'>
          <img
            className='img-fluid'
            src={product.imageUrl}
            alt={product.title}
          />
        </div>
        <div className='col-6'>
          <div className='d-flex align-items-center gap-2'>
            <h2>{product.title}</h2>
            <span className='badge text-bg-success'>{product.category}</span>
          </div>
          <p className='mb-3'>{product.description}</p>
          <p className='mb-3'>{product.content}</p>
          <h5 className='mb-3'>NT$ {product.price}</h5>
          <div className='input-group align-items-center w-75'>
            <select
              value={qtySelect}
              onChange={(e) => setQtySelect(e.target.value)}
              id='qtySelect'
              className='form-select'
            >
              {Array.from({ length: 10 }).map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
            <button
              type='button'
              disabled={isLoading}
              className='btn btn-primary d-flex align-items-center gap-2'
              onClick={() => addCartItems(product.id, qtySelect)}
            >
              加入購物車
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
          <div>
          <button
              className='btn btn-primary mt-5 ms-auto'
              type='button'
              onClick={() => {
                navigate(-1);
              }}
            >
              回到上一頁
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
