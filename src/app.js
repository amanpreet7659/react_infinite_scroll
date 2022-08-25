import axios from "axios";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const App = () => {
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 20,
  });
  const [state, setState] = useState({
    items: [],
    hasMore: true,
  });
  const [totalPassengers, setTotalPassengers] = useState(500);

  const getUserData = async () => {
    try {
      const response = await axios.get(
        `https://api.instantwebtools.net/v1/passenger?page=${queryParams.page}&size=${queryParams.limit}`
      );
      setTotalPassengers(response.data.totalPassengers);
      if (state.items.length >= totalPassengers) {
        return setState({ ...state, hasMore: false });
      } else {
        setQueryParams({
          ...queryParams,
          limit: queryParams.limit + 20,
        });
        setState({
          ...state,
          items: state.items.concat(response.data.data),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div>
      <InfiniteScroll
        dataLength={state?.items?.length} //This is important field to render the next data
        next={getUserData}
        hasMore={state.hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        // below props only if you need pull down functionality
        refreshFunction={getUserData}
        pullDownToRefresh
        pullDownToRefreshThreshold={50}
        pullDownToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        }
      >
        {state?.items?.map((data, index) => (
          <div>
            {index}
            <br />
            <img width={80} height={40} src={data && data?.airline[0]?.logo} />
          </div>
        ))}
      </InfiniteScroll>
      {/* <table>
        <thead>
          <th>#</th>
          <th>Name</th>
          <th>Trips</th>
          <th>Airline Name</th>
          <th>Airline Country</th>
          <th>Airline Logo</th>
          <th>Slogan</th>
        </thead>
        <tbody>
          {userData?.data?.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.trips}</td>
              <td>{user.airline[0].name}</td>
              <td>{user.airline[0].country}</td>
              <td>
                <img src={user.airline[0].logo} height={40} width={80} />
              </td>
              <td>{user.airline[0].slogan}</td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default App;
