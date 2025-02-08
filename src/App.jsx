/* eslint-disable react/react-in-jsx-scope */
import { PiMotorcycleFill } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";

const { VITE_BASE_URL, VITE_API_PATH } = import.meta.env;

function App() {
  //* Product Section
  const [Products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState([]);

  useEffect(() => {
    const getProductsSource = async () => {
      try {
        const getProduct = await axios.get(
          `${VITE_BASE_URL}/v2/api/${VITE_API_PATH}/products`
        );
        setProducts(getProduct.data.products);
      } catch (error) {
        alert(error.message);
      }
    };
    getProductsSource();
  }, []);
  //* Product Section

  //* Modal Section
  const detailCheckModal = useRef(null);
  const detailCheckModalLink = useRef(null);
  useEffect(() => {
    detailCheckModal.current = new Modal(detailCheckModalLink.current, {
      backdrop: false,
    });
  }, []);

  const turnOnDetailModal = () => {
    detailCheckModal.current.show();
  };

  const turnOffDetailModal = () => {
    detailCheckModal.current.hide();
  };
  const productDetailHandler = (product) => {
    turnOnDetailModal();
    setTempProduct(product);
  };
  //* Modal Section

  //* Cart Section
  const [itemsQuantity, setItemsQuantity] = useState(1);
  const [cartList, setCartList] = useState([]);

  const addCartItems = async (product_id, qty) => {
    try {
      await axios.post(`${VITE_BASE_URL}/v2/api/${VITE_API_PATH}/cart`, {
        data: {
          product_id,
          qty: parseInt(qty),
        },
      });
      getCartList();
    } catch (error) {
      console.log(error);
    }
  };

  const getCartList = async () => {
    try {
      const res = await axios.get(
        `${VITE_BASE_URL}/v2/api/${VITE_API_PATH}/cart`
      );
      setCartList(res.data.data.carts)
      console.log(res.data.data.carts)
    } catch (error) {
      
    }
  };
  useEffect(()=>{
    getCartList();
    },[])
  //* Cart Section

  return (
    <>
      <div id="app">
        <div className="container">
          <div className="mt-4">
            {/* 產品Modal */}
            <div
              ref={detailCheckModalLink}
              className="modal fade"
              id="exampleModal"
              tabindex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="false"
              style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
            >
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">
                      廠牌：{tempProduct.title}
                    </h1>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      onClick={turnOffDetailModal}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <img
                      src={tempProduct.imageUrl}
                      alt={tempProduct.title}
                      className="img-fluid object-fit"
                    />
                    <div className="d-flex">
                      <PiMotorcycleFill size={24} className="me-2" />
                      <p>{tempProduct.content}</p>
                    </div>
                    <p>車輛特色：{tempProduct.description}</p>
                    <p>
                      價錢：{tempProduct.price}{" "}
                      <del>{tempProduct.origin_price}</del> 元/天
                    </p>
                    <div>
                      <label htmlFor="qtySelect">數量：</label>
                      <select
                        value={itemsQuantity}
                        onChange={(e) => setItemsQuantity(e.target.value)}
                        id="qtySelect"
                        className="form-select"
                      >
                        {Array.from({ length: 10 }).map((_, index) => (
                          <option key={index} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      onClick={() =>
                        addCartItems(tempProduct.id, itemsQuantity)
                      }
                      type="button"
                      className="btn btn-primary"
                    >
                      立即預訂
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* 產品Modal */}
            
            <table className="table align-middle">
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
                    <td style={{ width: "200px" }}>
                      <div>
                        <img
                          className="img-fluid"
                          src={product.imageUrl}
                          alt={product.title}
                        />
                      </div>
                    </td>
                    <td>
                      <p className="fs-5 fw-medium">{product.title}</p>
                    </td>
                    <td>
                      <div className="h5"></div>
                      <del className="h6">原價{product.origin_price}</del>
                      <div className="h5">優惠價{product.price}</div>
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            productDetailHandler(product);
                          }}
                        >
                          <i className="fas fa-spinner fa-pulse"></i>
                          查看更多
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => addCartItems(product.id, 1)}
                        >
                          <i className="fas fa-spinner fa-pulse"></i>
                          立即預訂
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-end">
              <button className="btn btn-outline-danger" type="button">
                清空購物車
              </button>
            </div>
            <table className="table align-middle">
              <thead>
                <tr>
                  <th></th>
                  <th>品名</th>
                  <th style={{ width: "150px" }}>數量/單位</th>
                  <th>單價</th>
                </tr>
              </thead>
              <tbody>
                {cartList.map((cartItem)=>{
                  return(
                  <tr key={cartItem.id}>
                    <td>
                      <button type="button" className="btn btn-outline-danger btn-sm">
                        Delete
                      </button>
                    </td>
                    <td>
                      <h5>{cartItem.product.title}</h5>
                    </td>
                    <td style={{ width: "150px" }}>
                      <div className="d-flex align-items-center">
                        <div className="btn-group me-2" role="group">
                          <button
                            type="button"
                            className="btn btn-outline-dark btn-sm"
                          >
                            -
                          </button>
                          <span
                            className="btn border border-dark"
                            style={{ width: "50px", cursor: "auto" }}
                          >
                            {cartItem.}
                          </span>
                          <button
                            type="button"
                            className="btn btn-outline-dark btn-sm"
                          >
                            +
                          </button>
                        </div>
                        <span className="input-group-text bg-transparent border-0">
                          unit
                        </span>
                      </div>
                    </td>
                    <td className="text-end">單項總價</td>
                  </tr>)
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end">
                    總計
                  </td>
                  <td className="text-end"></td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-end text-success">
                    折扣價
                  </td>
                  <td className="text-end text-success"></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="my-5 row justify-content-center">
            <form className="col-md-6">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="請輸入 Email"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  收件人姓名
                </label>
                <input
                  id="name"
                  name="姓名"
                  type="text"
                  className="form-control"
                  placeholder="請輸入姓名"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                  收件人電話
                </label>
                <input
                  id="tel"
                  name="電話"
                  type="text"
                  className="form-control"
                  placeholder="請輸入電話"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  收件人地址
                </label>
                <input
                  id="address"
                  name="地址"
                  type="text"
                  className="form-control"
                  placeholder="請輸入地址"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  留言
                </label>
                <textarea
                  id="message"
                  className="form-control"
                  cols="30"
                  rows="10"
                ></textarea>
              </div>
              <div className="text-end">
                <button type="submit" className="btn btn-danger">
                  送出訂單
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
