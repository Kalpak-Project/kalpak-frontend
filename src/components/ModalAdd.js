import React, { useState, useCallback } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import axios from 'axios';


const ModalAdd = ({onUpdate, table, fields, button}) => {

    const formItemLayout =
        {
          labelCol: {
            span: 15,
            
          },
          wrapperCol: {
            span: 15,
          },
        }
        
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState(fields.map(title => ({key: title, title: title, value: null})));
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [okBtnDisable, setOkBtnDisable] = useState(true);
  
    const showModal = () => {
      setVisible(true);
    };
  
    const handleOk = () => {
        addToDB()
        onUpdate()
        setData(fields.map(title => ({key: title, title: title, value: null})))
        setConfirmLoading(true);
        setTimeout(() => {
        setVisible(false);
        setConfirmLoading(false);
      }, 500);
    };

    const addToDB = () => {
        const newElement = data.map(({key, title, value}) => ({key: key, value: value}))
        console.log(newElement)
        axios.post('/'+table, newElement).then(res => {
            console.log(res)
        }).catch(err => {console.log(err)})
    }
  
    const handleCancel = () => {
      console.log('Clicked cancel button');
      setData(fields.map(title => ({key: title, title: title, value: null})))
      setVisible(false);
    };


    //doesn't work when all fields are filled and after that delete them (stay clickable)
    const checkFilledFields = () => {
      // data.map(({key, title, value}) => (value != null ? setOkBtnDisable(false) : setOkBtnDisable(true)))
      setOkBtnDisable(data.find(({value}) => !value) !== undefined)
    }

    const onChange = useCallback((changeKey, newValue) => {
        setData(data.map(({key, title, value}) =>({key: key, value: key === changeKey ? newValue : value, title: title})))
        checkFilledFields()
      }, [data])

  
    return (
      <>
        <Button type="primary" onClick={showModal} >
            {button}
        </Button>
        <Modal
         
          title={button}
          visible={visible}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          width={600}
          bodyStyle={{height:280}}
          okButtonProps={{disabled: okBtnDisable}}
        >
        <Form    
        {...formItemLayout}
        layout='vertical'
        > 
        
        {data.map(({title, key, value}) =>
                <Form.Item label={title} name={title}
                  rules={[
                    {
                      required: true,
                      message: 'Please enter the '+title,
                    },
                  ]}
                  key={key} className='items-from-modal-add'>
                <Input style={{width: 300}} value={value} onChange={(event) => onChange(key, event.target.value)} placeholder={"Enter the "+title} />
                </Form.Item>
        )}      
      </Form>
        </Modal>
      </>
    );
  };
  

export default ModalAdd
