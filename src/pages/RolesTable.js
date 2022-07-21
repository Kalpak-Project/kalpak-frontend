import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Table, List, Select, Spin, Input, Form, Typography,Popconfirm, InputNumber } from 'antd';
import ModalAdd from '../components/ModalAdd';
import { withUser } from '../components/userContext';
import { Navigate } from 'react-router-dom';
const { Option } = Select;

const RolesTable = withUser(({user}) => {


    const [{roles, loading}, setRoles] = useState({roles:[], loading: true});
    const [editingKey, setEditingKey] = useState('');
   
    const [form] = Form.useForm();
    const isEditing = (record) => record.key === editingKey;

    const columns = [
        {
          title: 'Title',
          dataIndex: 'Title',
          width: '20%',
          editable: true,
          required: true
        },
        {
          title: 'Duration (in days)',
          dataIndex: 'Duration',
          width: '20%',
          inputRender: (value, onChange)=><InputNumber min={1} max={1500} defaultValue={365} onChange={onChange} />,
          editable: true,
          required: true
        },
        {
          title: 'Description',
          dataIndex: 'Description',
          width: '20%',
          editable: true,
          required: true
        },
        {
          title: 'Requirement',
          dataIndex: 'Constraints',
          width: '20%',
          render: (record, index) => record !== null ?
            <List
            size="small"
            itemLayout="vertical"
            // bordered
            dataSource={record}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          /> : record,
          editable: true,
          inputRender: (value, onChange) =><ConSelect key={1} value={value} onChange={onChange}/>,
          required: false
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            width: '10%',
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
          console.log("row: ", row)
          const newData = [...roles];
          const index = newData.findIndex((item) => key === item.key);
          console.log("new data: ", newData[index])
          if (index > -1) {
            const item = row;
            item['key'] = key;
            if (item.Constraints[0] === undefined){
              item.Constraints.splice(1)
            }
            newData.splice(index, 1, { ...item, ...row });
            console.log("after fix: ", newData)
            setRoles({roles: newData, loading: false});
            updateDB(item['key'], item)
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
                    console.log("roles: ", res.data.roles)
                    setRoles({roles: res.data.roles, loading: false})
                }
            ).catch(err => {
                console.log(err)
            })
        }, [])


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
        required,
        ...restProps
      }) => {
        const inputNode = inputType === 'number' ? <InputNumber onStep={(value) => {
            record[dataIndex] = dataIndex === 'Duration' ? parseInt(value) : value
            console.log("update: " + record)
            const newRoles = roles.map(role=> role === record ? record: role)
          }}
          /> :
          dataIndex === 'Constraints' ?
          <ConSelect key={1} value={record} onChange={(value) => {
            console.log("value: ")
            console.log(value)
            record[dataIndex] = value.role_title
            console.log("update: ")
            console.log(record)
            const newRoles = roles.map(role => role === record ? record : role)
          }}/> : <Input />;
        return (
          <td {...restProps}>
            {editing ? (
              <Form.Item
                name={dataIndex}
                onChange={(event) => {
                    record[dataIndex] = dataIndex === 'Duration' ? parseInt(event.target.value) : event.target.value
                    console.log("update: " + event.target.value)
                    const newRoles = roles.map(role=> role === record ? record: role)
                  }}
                
                style={{
                  margin: 0,
                }}
                rules={[
                  {
                    required: required,
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
    const columnsTitles = columnsForModal.map(elem => ({title:elem.dataIndex, inputRender:elem.inputRender, required:elem.required}))

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
            loading={loading}
            rowClassName="editable-row"
            scroll={{y: 275}}
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

export const Con = ({value, i})=> {
  return value ? <div key={i} >{value.role_title}</div>: <Spin/>
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

export const ConSelect = ({value,onChange})=> {
  const [data,setData]=useState([]);

  useEffect(()=>{
      axios.get("/api/constraints").then((response)=>{
      console.log("cons", response.data.cons)
      setData(response.data.cons)            
      }).catch();
  },[onChange]);

  const cons = data.map((option,i)=><Option key={i} value={option.role_title}><Con value={option}/></Option>)
//   return <Select value={value} onChange={onChange}> 
//   {data.map((option,i)=><Option key={i} value={option.key}><Con value={option.key}/></Option>)}
// </Select>

  return <Select
    mode="multiple"
    size="small"
    allowClear
    style={{
      width: '100%',
    }}
    placeholder="Please select"
    defaultValue={[]}
    value={value}
    onChange={onChange}
  >
    {cons}
  </Select>
}

export default RolesTable