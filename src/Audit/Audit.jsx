import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userActions } from "../_actions";
import { history } from "../_helpers";
import "./Audit.css";
import { Navbar, Nav } from "react-bootstrap";
import { useEffect, useState } from "react";
function Auditpage(props) {
  const { user, users } = props;

  const [userSet,setUserSet] = useState(users.items)
  const [userList,setUserList] = useState(users.items)
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [sortBy,setSortBy] = useState('Date');
  const [timeFormat,setTimeFormat] = useState('24');

  useEffect(() => {
    if(user.role!=="Auditor"){
      history.push("/");
    }
    props.getUsers();
  }, []);

  useEffect(()=>{
    if(users.items)
    {
      setUserSet(users.items)
      setUserList(sliceData(users.items,page,25))
    setPagination(calculateRange(Object.values(users.items), 25));

    
  }
  },[users])

  //calculate page divisions
  const calculateRange = (data, rowsPerPage) => {
    const range = [];
    const num = Math.ceil(data.length / rowsPerPage);
    for (let i = 1; i <= num; i++) {
        range.push(i);
    }
    return range; 
  } 

  //divide data to page
  const sliceData = (data, page, rowsPerPage) => {
    return data.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }  

  // Search
  const handleSearch = (event) => {
    console.log(event.target.value)
    let search = event.target.value;
    if (event.target.value !== "") {
      let search_results = users.items.filter(
        (item) =>
          item.firstName.toLowerCase().includes(search.toLowerCase()) ||
          item.lastName.toLowerCase().includes(search.toLowerCase()) ||
          item.id.toLowerCase().includes(search.toLowerCase()) ||
          item.createdDate.toLowerCase().includes(search.toLowerCase()) ||
          item.role.toLowerCase().includes(search.toLowerCase())
      );
      setUserSet(search_results);
      setUserList(sliceData(search_results,1,25))
      setPagination(calculateRange(Object.values(search_results), 25))
    } else {
      handleChangePage(1);
    }
  };

  // Change Page
  const handleChangePage = (new_page) => {
    setPage(new_page);
    setUserList(sliceData(userSet, new_page, 25));
  };

  //Sort by
  const handleSort = (sortType) =>{
    
    let sortedList;
    switch(sortBy){
      //the switch case is inverted
      case 'Date': 
      
      sortedList = userSet.sort((a,b)=>{
        return ((a.firstName < b.firstName) ? -1 : ((a.firstName > b.firstName) ? 1 : 0));
      })
      break;
      default: 
      
      sortedList = userSet.sort((a,b)=>{
        return ((a.createdDate < b.createdDate) ? -1 : ((a.createdDate > b.createdDate) ? 1 : 0));
      })
      
    }
    
    setUserSet(sortedList)
    setUserList(sliceData(sortedList,1,25))
  }

  const handleDeleteUser = (id) => {
    return (e) => props.deleteUser(id);
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand></Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link>
            <Link to="/">Home</Link>
          </Nav.Link>
          <Nav.Link href="#features">Auditor</Nav.Link>
          <Nav.Link>
            <Link to="/login">Logout</Link>
          </Nav.Link>
        </Nav>
      </Navbar>
      <div className="col-md-6 col-md">
        <h1>Hi {user.firstName}!</h1>
        <p>You're logged in with React!!</p>
        <h3>All login audit :</h3>
        <div className="table-functions">
        
          <input type="text" onChange={ev=>handleSearch(ev)} placeholder="Search/Filter" />
        
        <select name='Sort By' value={sortBy} onChange={(ev)=>{setSortBy(ev.target.value);handleSort();}}>
          <option value={'Date'}>Sort by date</option>
          <option value={'Name'}>Sort by name</option>
        </select>
        <select name='Time Format' value={timeFormat} onChange={(ev)=>{setTimeFormat(ev.target.value)}}>
          <option value={'24'}>24 Hour</option>
          <option value={'12'}>12 Hour</option>
        </select>
        {userList && userList.length !== 0 ? (
          <div className="populated-table">
            {pagination.map((item, index) => (
              <span
                key={index}
                className={item === page ? "active-pagination" : "pagination"}
                onClick={() => handleChangePage(item)}
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          
            <span className="empty-table">No data</span>
          
        )}

        </div>
        {users.loading && <em>Loading users...</em>}
        {users.error && (
          <span className="text-danger">ERROR: {users.error}</span>
        )}
        {userList &&(<div className="user-screen"><table>
          <thead>
            <th>USER ID</th>
            <th>ROLE</th>
            <th>NAME</th>
            <th>DATE/TIME</th>
            <th>DELETE</th>
          </thead>

          {userList.length !== 0 ? (
            <tbody>
              {userList.map((user, index) => (
                <tr key={index}>
                  <td>
                    <span>{user.id}</span>
                  </td>
                  <td>
                    <span>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span>{user.firstName+ ' ' + user.lastName}</span>
                  </td>
                  <td>
                    <span>{new Date(user.createdDate).toLocaleDateString()} {timeFormat==='12'?new Date(user.createdDate).toLocaleTimeString('en-US'):new Date(user.createdDate).toLocaleTimeString()}</span>
                  </td>
                  <td>
                    <span>
                    {user.deleting ? (
                  <em> - Deleting...</em>
                ) : user.deleteError ? (
                  <span className="text-danger">
                    - ERROR: {user.deleteError}
                  </span>
                ) : (
                  <span>
                    <p style={{background: "darkred", padding:'2px 5px', color: 'white', cursor: 'pointer' }} onClick={handleDeleteUser(user.id)}>Delete</p>
                  </span>
                )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table></div>)}

        

       
      </div>
    </div>
  );
}

function mapState(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return { user, users };
}

const actionCreators = {
  getUsers: userActions.getAll,
  deleteUser: userActions.delete,
};

const connectedAuditPage = connect(mapState, actionCreators)(Auditpage);
export { connectedAuditPage as Auditpage };
