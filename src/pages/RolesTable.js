import React, { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { Table, Select, Spin, Input, Form, Typography,Popconfirm, InputNumber, Button } from 'antd';
import ModalAdd from '../components/ModalAdd';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
const {Option}=Select;

const RolesTable = withUser(({user}) => {


    const [{roles, loading}, setRoles] = useState({roles:[], loading: true});
    const [editingKey, setEditingKey] = useState('');
   
    const [form] = Form.useForm();
    const isEditing = (record) => record.key === editingKey;

    const columns = [
        {
            title: 'Title',
            dataIndex: 'Title',
            width: '30%',
            editable: true,
        },
        {
            title: 'Duration (in days)',
            dataIndex: 'Duration',
            width: '20%',
            inputRender: (value, onChange)=><InputNumber min={1} max={1000} defaultValue={365} onChange={onChange} />,
            editable: true,
        },
        {
            title: 'Description',
            dataIndex: 'Description',
            width: '30%',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            width: '15%',
            render: (_, record) => {
              const editable = isEditing(record);
              return editable ? (
                <span>
                  <Typography.Link
                    onClick={() => save(record.key)}
                    style={{
                      marginRight: 8,
                    }}
                  >
                    Save
                  </Typography.Link>
                  <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
              ) : (
                <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                  Edit
                </Typography.Link>
              );
            },
          },
    ]

    const edit = (record) => {
        form.setFieldsValue({
          Title: '',
          Duration: '',
          Description: '',
          ...record,
        });
        setEditingKey(record.key);
      };
    
      const cancel = () => {
        setEditingKey('');
      };

      const updateDB = useCallback( 
        (key, newDoc) => {
        axios.post(`/api/roles/${key}`, newDoc).then(
            res => {
                console.log(newDoc)
            }).catch(err => console.log(err))
      }, [roles])

      const save = async (key) => {
        try {
          const row = await form.validateFields();
          const newData = [...roles];
          const index = newData.findIndex((item) => key === item.key);
          console.log(newData[index])
          if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, { ...item, ...row });
            setRoles({roles: newData, loading: false});
            updateDB(item['key'], item)
            // resetRoles()
            setEditingKey('');
          } else {
            newData.push(row);
            setRoles({roles: newData, loading: false});
            setEditingKey('');
          }
        } catch (errInfo) {
          console.log('Validate Failed:', errInfo);
        }
      };

      const mergedColumns = columns.map((col) => {
        if (!col.editable) {
          return col;
        }
        return {
          ...col,
          onCell: (record) => ({
            record,
            inputType: col.dataIndex === 'Duration' ? 'number' : 'text',
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
          }),
        };
      });
    

    const resetRoles = useCallback(
        () => {
            axios.get('/api/roles').then(
                res => {
                    console.log("update data")
                    setRoles({roles: res.data.roles, loading: false})
                }
            ).catch(err => {
                console.log(err)
            })
        },
        [],
    )


    useEffect(() => {
       resetRoles()
    }, [])


    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
      }) => {
        const inputNode = inputType === 'number' ? <InputNumber onStep={(value) => {
            record[dataIndex] = dataIndex === 'Duration' ? parseInt(value) : value
            console.log("update111: " + record)
            const newRoles = roles.map(role=> role === record ? record: role)
          }}
          /> : <Input />;
        return (
          <td {...restProps}>
            {editing ? (
              <Form.Item
                name={dataIndex}
                onChange={(event) => {
                    record[dataIndex] = dataIndex === 'Duration' ? parseInt(event.target.value) : event.target.value
                    console.log("update: " + record)
                    const newRoles = roles.map(role=> role === record ? record: role)
                  }}
                
                style={{
                  margin: 0,
                }}
                rules={[
                  {
                    required: true,
                    message: `Please Input ${title}!`,
                  },
                ]}
              >
                {inputNode}
              </Form.Item>
            ) : (
              children
            )}
          </td>
        );
      };      
    
    const columnsForModal = columns
    columnsForModal.pop()
    const columnsTitles = columnsForModal.map(elem => ({title:elem.dataIndex, inputRender:elem.inputRender}))

    return (
        user === null ? <Navigate to='/login' /> :
            !user['isAdmin'] ? <Navigate to='/' /> :
            <div>
                <ModalAdd onChange={resetRoles} table={"roles"} fields={columnsTitles} button='Add New Role' />
        <Form form={form} component={false}>
          <Table
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={roles}
            columns={mergedColumns}
            rowClassName="editable-row"
            scroll={{y: 350}}
            pagination={{
              onChange: cancel,
            }}
          />
        </Form>
        </div>
      );
})

export const Role = ({value})=> {
    const [data,setData]=useState();
    useEffect(()=>{
        axios.get(`/api/roles/${value}`).then((response)=>{
        setData(response.data["Title"])            
        }).catch();
    },[]);
    return data? <div>{data}</div>: <Spin/>
}


export const RoleSelect = ({value,onChange})=> {
    const [data,setData]=useState([]);
    useEffect(()=>{
        axios.get("/api/roles").then((response)=>{
        setData(response.data.roles)            
        }).catch();
    },[]);
    return <Select value={value} onChange={onChange}> 
        {data.map((option,i)=><Option key={i} value={option.key}><Role value={option.key}/></Option>)}
    </Select>
}

export default RolesTable