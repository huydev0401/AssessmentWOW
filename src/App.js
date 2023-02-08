import React from "react";

function App(props) {
  return <div></div>;
}

export default App;

// import "./App.css";
// import { Layout, Table } from "antd";
// import { useContext, useEffect } from "react";
// import { RealmContext } from "./context/realmProvider";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAssessments, selectAssessments } from "./redux/store";
// import ComUserCelView from "./components/user/ComUserCelView";
// function App() {
//   const { mongo } = useContext(RealmContext);
//   const assessments = useSelector(selectAssessments);
//   const dispatch = useDispatch();

//   const columns = [
//     {
//       title: "Title",
//       dataIndex: "title",
//       key: "title",
//     },
//     {
//       title: "User",
//       dataIndex: "user",
//       key: "user",
//       render: (_, record) => <ComUserCelView userId={record.user} />,
//     },
//   ];
//   useEffect(() => {
//     console.log("here");
//     dispatch(fetchAssessments({ mongo }));
//   }, []);
//   return (
//     <Layout>
//       <Table rowKey='_id' dataSource={assessments} columns={columns} />
//     </Layout>
//   );
// }

// export default App;
