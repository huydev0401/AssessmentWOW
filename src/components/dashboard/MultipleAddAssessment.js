import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Checkbox, Form, Input, Popconfirm, Space, Table } from "antd";
const EditableContext = React.createContext(null);
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};
function MultipleAddAssessment(props) {
  const [dataSource, setDataSource] = useState([
    {
      key: "0",
      email: "justin@a247.vn",
      firstname: "Nguyễn Hoàng",
      lastname: "Vũ",
    },
    {
      key: "1",
      email: "andy@a247.vn",
      firstname: "Nguyễn Thành",
      lastname: "Nhân",
    },
  ]);
  const [count, setCount] = useState(2);
  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };
  const defaultColumns = [
    {
      title: "Email",
      dataIndex: "email",
      width: "30%",
      editable: true,
    },
    {
      title: "Họ & Tên lót",
      dataIndex: "firstname",
      editable: true,
    },
    {
      title: "Tên",
      dataIndex: "lastname",
      editable: true,
    },
    {
      title: "#",
      dataIndex: "operation",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm
            title="Sure to delete?"
            onConfirm={() => handleDelete(record.key)}
          >
            <a>Delete</a>
          </Popconfirm>
        ) : null,
    },
  ];
  const handleAdd = () => {
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: "32",
      address: `London, Park Lane no. ${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });
  return (
    <div>
      <Space>
        <Checkbox.Group>
          <Checkbox value="DISC" style={{ lineHeight: "32px" }}>
            DISC
          </Checkbox>
          <Checkbox value="Motivators" style={{ lineHeight: "32px" }}>
            Motivators
          </Checkbox>
          <Checkbox value="Sale IQ Plus" style={{ lineHeight: "32px" }}>
            Sale IQ Plus
          </Checkbox>
          <Checkbox value="EIQ 2" style={{ lineHeight: "32px" }}>
            EIQ 2
          </Checkbox>
          <Checkbox value="Learning Styles" style={{ lineHeight: "32px" }}>
            Learning Styles
          </Checkbox>
        </Checkbox.Group>
        <Button
          onClick={handleAdd}
          type="primary"
          style={{
            marginBottom: 16,
          }}
        >
          Add a row
        </Button>
      </Space>
      <Table
        id="MultipleAdd"
        components={components}
        rowClassName={() => "editable-row"}
        dataSource={dataSource}
        columns={columns}
      />
    </div>
  );
}

export default MultipleAddAssessment;
