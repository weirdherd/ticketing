import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import router from 'next/router';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title, price
    },
    onSuccess: () => {
      router.push('/');
    }
  })

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  }

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  }

  return (
    <div>
      <h1>新增一张票</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>标题</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}  
            className="form-control" 
          />
        </div>
        <div className="form-group">
          <label>价格</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control" />
        </div>
        {errors}
        <button className="btn btn-primary">提交</button>
      </form>
    </div>
  );
};

export default NewTicket;
