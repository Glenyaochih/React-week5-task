import { useEffect, useState } from 'react'
import axios from 'axios'

const {VITE_BASE_URL,VITE_API_PATH}= import.meta.env


function App() {
  const [allProduct,setAllProduct]=useState([]);

  useEffect(()=>{
    const getProductsSource =async()=>{
      try {
        const getProduct = await axios.get(`${VITE_BASE_URL}/v2/api/${VITE_API_PATH}/products`);
        console.log(getProduct.data.products);
        setAllProduct(getProduct.data.products)
      } catch (error) {
        alert(error.message)
      }
    }
    getProductsSource();
  },[])

  return (
    <div id="app">
    <div className="container">
      <div className="mt-4">
        {/* 產品Modal */}
        
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
            {allProduct.map((product)=>(
              <tr key={product.id}>
              <td style={{ width: '200px' }}>
                <div >
                  <img className='img-fluid' src={product.imageUrl} alt={product.title} />
                </div>
              </td>
              <td>
                <p>{product.title}</p>
              </td>
              <td>
                <div className="h5"></div>
                <del className="h6">原價{product.origin_price}</del>
                <div className="h5">優惠價{product.price}</div>
              </td>
              <td>
                <div className="btn-group btn-group-sm">
                  <button type="button" className="btn btn-outline-secondary">
                    <i className="fas fa-spinner fa-pulse"></i>
                    查看更多
                  </button>
                  <button type="button" className="btn btn-outline-danger">
                    <i className="fas fa-spinner fa-pulse"></i>
                    立即租車
                  </button>
                </div>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
        <div className="text-end">
          <button className="btn btn-outline-danger" type="button">清空購物車</button>
        </div>
        <table className="table align-middle">
          <thead>
            <tr>
              <th></th>
              <th>品名</th>
              <th style={{ width: '150px' }}>數量/單位</th>
              <th>單價</th>
            </tr>
          </thead>
          <tbody>
            {/* Cart rows here */}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="text-end">總計</td>
              <td className="text-end"></td>
            </tr>
            <tr>
              <td colSpan="3" className="text-end text-success">折扣價</td>
              <td className="text-end text-success"></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="my-5 row justify-content-center">
        <form className="col-md-6">
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input id="email" name="email" type="email" className="form-control" placeholder="請輸入 Email" />
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">收件人姓名</label>
            <input id="name" name="姓名" type="text" className="form-control" placeholder="請輸入姓名" />
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">收件人電話</label>
            <input id="tel" name="電話" type="text" className="form-control" placeholder="請輸入電話" />
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">收件人地址</label>
            <input id="address" name="地址" type="text" className="form-control" placeholder="請輸入地址" />
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">留言</label>
            <textarea id="message" className="form-control" cols="30" rows="10"></textarea>
          </div>
          <div className="text-end">
            <button type="submit" className="btn btn-danger">送出訂單</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  )
}

export default App
