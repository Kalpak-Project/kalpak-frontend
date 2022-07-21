import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import axios from 'axios';


const ModalAdd = ({onChange, table, fields, button}) => {

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
    const [data, setData] = useState(fields.map(()=>null));
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [okBtnDisable, setOkBtnDisable] = useState(true);
  
    const showModal = () => {
      setVisible(true);
    };
  
    const handleOk = () => {
        addToDB()
        setData(fields.map(()=>null));
        setConfirmLoading(true);
        setTimeout(() => {
        setVisible(false);
        setConfirmLoading(false);
      }, 500);
    };

    
    const addToDB = useCallback(() => {
        var newElement = fields.map(({title},i) => (title === 'Constraints' ?
        {key: title, value: (data[i] !== null) && (data[i][0] === undefined) ? data[i].slice(1) : data[i]} :
        {key: title, value: data[i]}))    
        console.log("new element: ")
        console.log(newElement)
        axios.post('/api/'+table, newElement).then(res => {
            onChange()
            console.log(res)
        }).catch(err => {console.log(err)})
    }, [onChange, data, fields])
  
    const handleCancel = () => {
      console.log('Clicked cancel button');
      setData(fields.map(()=>null));
      setVisible(false);
    };


    useEffect(() => {
      console.log("data: ", data)
      if (table != "roles"){
        setOkBtnDisable(data.find(value => !value) !== undefined)
      } else {
        var requiredData = [...data];
        requiredData.pop();
        console.log(requiredData);
        setOkBtnDisable(requiredData.find(value => !value) !== undefined)
      }
    }, [data])


    const onValueChange = useCallback((changeKey, newValue) => {
        console.log("change key", changeKey, ", new value: ", newValue)
        setData((prevData)=>fields.map(({title},i) => title===changeKey? newValue:prevData[i]))
        
      }, [fields])

  
    return (
      <>
        <Button type="primary" shape='round' onClick={showModal} >
          {button}
        </Button>
        <Modal
          title={button}
          visible={visible}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          width={540}
          okButtonProps={{disabled: okBtnDisable}}
          centered
        >
        <Form    
        {...formItemLayout}
        layout='vertical'
        > 
        
        {fields.map(({title,inputRender,required},i) =>
                <Form.Item label={title}
                  required={required}
                  rules={[
                    {
                      required: required,
                      message: `Please Input ${title}!`,
                    },
                  ]} 
                  key={title} className='items-from-modal-add'>
               {inputRender?
               inputRender(data[i],(newValue)=>onValueChange(title,newValue)):
                <Input style={{width: 250}} value={data[i]} onChange={(event) => onValueChange(title, event.target.value)} placeholder={"Enter the "+title} />
               }
               {title == 'Duration' && <font style={{fontSize: 'small'}}> Days</font>}
                </Form.Item>
        )}      
      </Form>
        </Modal>
      </>
    );
  };
  

export default ModalAdd
