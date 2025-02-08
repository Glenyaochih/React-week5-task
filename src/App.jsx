/* eslint-disable react/react-in-jsx-scope */
import { PiMotorcycleFill } from "react-icons/pi";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import { useForm } from "react-hook-form";
import ReactLoading from "react-loading";
const { VITE_BASE_URL, VITE_API_PATH } = import.meta.env;

function App() {
  //* Product Section
  const [Products, setProducts] = useState([]);
  const [tempProduct, setTempProduct] = useState([]);
  const [isScreenLoading, setIsScreenLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    getCartList();
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
  const [cartList, setCartList] = useState({});

  const addCartItems = async (product_id, qty) => {
    setIsLoading(true);
    try {
      await axios.post(`${VITE_BASE_URL}/v2/api/${VITE_API_PATH}/cart`, {
        data: {
          product_id,
          qty: parseInt(qty),
        },
      });
      getCartList();
    } catch (error) {
      alert("加入購物車失敗");
    } finally {
      setIsLoading(false);
    }
  };

  const getCartList = async () => {
    try {
      const res = await axios.get(
        `${VITE_BASE_URL}/v2/api/${VITE_API_PATH}/cart`
      );
      setCartList(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      alert("取得購物車品項失敗");
    }
  };

  const deleteCartItem = async (id) => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${VITE_BASE_URL}/v2/api/${VITE_API_PATH}/cart/${id}`);
      getCartList();
    } catch (error) {
      alert("刪除品項失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  const deleteCart = async () => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${VITE_BASE_URL}/v2/api/${VITE_API_PATH}/carts`);
      getCartList();
    } catch (error) {
      alert("刪除品項失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  const updateCartItem = async (cartId, product_id, qty) => {
    try {
      setIsScreenLoading(true);
      const res = await axios.put(
        `${VITE_BASE_URL}/v2/api/${VITE_API_PATH}/cart/${cartId}`,
        {
          data: {
            product_id,
            qty: parseInt(qty),
          },
        }
      );
      getCartList();
    } catch (error) {
      alert("修改失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  useEffect(() => {
    getCartList();
  }, []);

  //* Cart Section

  //* Form Section
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const onSubmit = (data) => {
    console.log(data);
    const { message, ...user } = data;
    const sortedData = {
      data: {
        user,
        message,
      },
    };
    cartCheckOut(sortedData);
    reset();
  };

  const cartCheckOut = async (data) => {
    setIsScreenLoading(true);
    try {
      await axios.post(`${VITE_BASE_URL}/v2/api/${VITE_API_PATH}/order`, data);
      reset();
      getCartList();
    } catch (error) {
      alert("結帳失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  //* Form Section

  //* Load Section

  //* Load Section
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
                      disabled={isLoading}
                      type="button"
                      className="btn btn-primary d-flex align-items-center gap-2"
                    >
                      立即預訂
                      {isLoading&&(<ReactLoading
                        type={"spin"}
                        color={"#000"}
                        height={"1.5rem"}
                        width={"1.5rem"}
                      />)}
                      
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
                          disabled={isLoading}
                          className="btn btn-outline-danger d-flex align-items-center gap-2"
                          onClick={() => addCartItems(product.id, 1)}
                        >
                          立即預訂
                          {isLoading&&(<ReactLoading
                        type={"spin"}
                        color={"#000"}
                        height={"1.5rem"}
                        width={"1.5rem"}
                      />)}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {cartList.carts?.length > 0 && (
              <div>
                <div className="text-end py-5">
                  <button
                    className="btn btn-outline-danger"
                    type="button"
                    onClick={deleteCart}
                  >
                    清空購物車
                  </button>
                </div>
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th style={{ width: "80px" }}></th>
                      <th style={{ width: "100px" }}>圖片</th>
                      <th>品名</th>
                      <th style={{ width: "150px" }}>數量/單位</th>
                      <th className="text-end">單價</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartList.carts?.map((cartItem) => {
                      return (
                        <tr key={cartItem.id}>
                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => deleteCartItem(cartItem.id)}
                            >
                              Delete
                            </button>
                          </td>
                          <td>
                            <img
                              src={cartItem.product.imageUrl}
                              alt={cartItem.product.title}
                              className="img-fluid"
                            />
                          </td>
                          <td>
                            <p>{cartItem.product.title}</p>
                          </td>
                          <td style={{ width: "150px" }}>
                            <div className="d-flex align-items-center">
                              <div className="btn-group me-2" role="group">
                                <button
                                  type="button"
                                  className="btn btn-outline-dark btn-sm"
                                  onClick={() => {
                                    updateCartItem(
                                      cartItem.id,
                                      cartItem.product_id,
                                      cartItem.qty - 1
                                    );
                                  }}
                                  disabled={cartItem.qty === 1}
                                >
                                  -
                                </button>
                                <span
                                  className="btn border border-dark"
                                  style={{ width: "50px", cursor: "auto" }}
                                >
                                  {cartItem.qty}
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-outline-dark btn-sm"
                                  onClick={() => {
                                    updateCartItem(
                                      cartItem.id,
                                      cartItem.product_id,
                                      cartItem.qty + 1
                                    );
                                  }}
                                >
                                  +
                                </button>
                              </div>
                              <span className="input-group-text bg-transparent border-0">
                                <p>{cartItem.product.unit}</p>
                              </span>
                            </div>
                          </td>
                          <td className="text-end">{cartItem.total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="4" className="text-end">
                        總計
                      </td>
                      <td className="text-end">{cartList.total}</td>
                    </tr>
                    <tr>
                      <td colSpan="4" className="text-end text-success">
                        折扣價
                      </td>
                      <td className="text-end text-success"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
          <div className="my-5 row justify-content-center">
            <form className="col-md-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "必需填入Email",
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: "E-mail 格式錯誤",
                    },
                  })}
                  className={`form-control ${errors.email && "is-invalid"}`}
                  type="email"
                  placeholder="請輸入 Email"
                />
                {errors.email && (
                  <div className="invalid-feedback">
                    {errors?.email?.message}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  收件人姓名
                </label>
                <input
                  id="name"
                  {...register("name", {
                    required: {
                      value: true,
                      message: "請填入收檢件人姓名",
                    },
                  })}
                  className={`form-control ${errors.name && "is-invalid"}`}
                  type="text"
                  placeholder="請輸入姓名"
                />
                {errors.name && (
                  <div className="invalid-feedback">
                    {errors?.name?.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                  收件人電話
                </label>
                <input
                  id="tel"
                  {...register("tel", {
                    required: {
                      value: true,
                      message: "請填入收件人電話",
                    },
                    pattern: {
                      value: /^(0[2-8]\d{7}|09\d{8})$/,
                      message: "電話格式錯誤",
                    },
                  })}
                  className={`form-control ${errors.tel && "is-invalid"}`}
                  type="text"
                  placeholder="請輸入電話"
                />
                {errors.tel && (
                  <div className="invalid-feedback">{errors?.tel?.message}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  收件人地址
                </label>
                <input
                  id="address"
                  {...register("address", {
                    required: {
                      value: true,
                      message: "請輸入收件人地址",
                    },
                  })}
                  className={`form-control ${errors.address && "is-invalid"}`}
                  type="text"
                  placeholder="請輸入地址"
                />
                {errors.address && (
                  <div className="invalid-feedback">
                    {errors?.address?.message}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  留言
                </label>
                <textarea
                  id="message"
                  {...register("message")}
                  className={`form-control ${errors.address && "is-invalid"}`}
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
        {isScreenLoading && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(255,255,255,0.3)",
              zIndex: 999,
            }}
          >
            <ReactLoading
              type="spin"
              color="black"
              width="4rem"
              height="4rem"
            />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
