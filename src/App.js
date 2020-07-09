import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import wtf from "./wtf.png";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      callNumber: 0,
      showModal: false,
    }
  }

  componentWillMount() {
    this.setupInterceptors();
  }

  setupInterceptors = () => {
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error && error.response) {
          this.setState({showModal: true});
        }
        return Promise.reject(error);
      }
    );
  };

  getAllData = (apiList) => {
    return Promise.all(apiList.map(this.fetchData));
  }
  
  fetchData = (api) => {
    return new Promise((resolve) => {
      return axios
      .get(api)
      .then(function(response) {
        resolve(response.data.data);
      })
      .catch(function(error) {
        resolve(error.response);
      });
    });
  }

  handleCallAPI = () => {
    let apiList = [];
    for (let i = 1; i <= this.state.callNumber; ++i) {
      apiList.push(`https://reqres.in/api/users/${i}`);
    }

    let {dispatch} = this.props;
    this.getAllData(apiList)
    .then((data) => dispatch({type: 'STARTED_CALL_API', data}));
  }

  handleClose = () => {
    this.setState({ showModal: false });
  }

  handleRetry = () => {
    let {dispatch} = this.props;
    this.getAllData(this.props.store.failAPIs)
    .then((data) => dispatch({type: 'STARTED_CALL_API', data}));
    
    this.setState({ showModal: false });
  }

  render() {
    return (
      <div className="App">
        <div className="container">
          <div className="row my-5 text-center justify-content-center">
            <div className="col-8 d-flex justify-content-center">
              <input
                className="form-control w-50"
                type="number"
                onChange={async e => await this.setState({callNumber: e.target.value})}
              />
              <button
                onClick={this.handleCallAPI} 
                className="btn btn-primary ml-2"
              >
                SYNC  
              </button>
            </div>
          </div>
          <div className="row">
          {
            this.props.store.results.map((user, index) => {
              return (
                <div className="col-12" key={index}>
                  <div className="d-flex align-items-start py-4">
                    <div style={{borderRadius: "15px", overflow: "hidden"}}>
                      <img src={user.avatar} alt={user.first_name}/>
                    </div>
                    <div className="pl-4">
                      <h6>{user.first_name} {user.last_name}</h6>
                      <div>{user.email}</div>
                    </div>
                  </div>
                </div>
              )
            })
          }
          </div>
          {
            this.props.store.total !==0 &&
            (
              this.props.store.countFail === 0 
              ? <h5 style={{position: "fixed", right: "20px", bottom: "20px"}}>
                  {this.props.store.countSuccess}/{this.props.store.total} Success
                </h5>
              : <h5 style={{position: "fixed", right: "20px", bottom: "20px"}}>
                  {this.props.store.countSuccess}/{this.props.store.total} Success and {this.props.store.countFail}/{this.props.store.total} Fail
                </h5>
            )
          }
        </div>
        <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Body>
            <h3 className="text-center pb-5">Something Wrong!</h3>
            <div className="text-center pb-5">
              <img className="w-50" src={wtf} alt="wtf"/>
            </div>
            <div className="d-flex justify-content-end">
              <Button 
                variant="warning" 
                onClick={this.handleClose}
              >
                Close
              </Button>
              <Button 
                className="ml-3"
                variant="primary" 
                onClick={this.handleRetry}
              >
                Retry
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default connect((store) => {
  return {
    store: store
  }
})(App);
