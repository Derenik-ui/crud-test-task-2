

import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      editText: "",
      postText: "",
    }
  }

  getInfo = () => {
    fetch(`${process.env.REACT_APP_API_URL}`)
      .then((resp) => resp.json())
      .then((dataFromServer) =>
        this.setState(() => ({
          data: dataFromServer,
        }))
      )
      .catch((err) => console.log(err));
  };

  handleDelete = (userId) => {
    fetch(`${process.env.REACT_APP_API_URL}/${userId}`, {
      method: "DELETE",
    })
      .then((resp) => {
        if (resp.ok) {
          console.log(`User with ID ${userId} deleted successfully`);
          this.getInfo();
        } else {
          console.error(`Failed to delete user with ID ${userId}`);
        }
      })
  }

  handleEdit = (userId) => {
    fetch(`${process.env.REACT_APP_API_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: this.state.editText,
      }),
    })
      .then((resp) => {
        if (resp.ok) {
          console.log(`User with ID ${userId} updated successfully`);
          this.getInfo();
        } else {
          console.error(`Failed to update user with ID ${userId}`);
        }
      })
      .catch((err) => {
        console.error('Error:', err);
      });
  }

  addPerson = () => {
    fetch(process.env.REACT_APP_API_URL, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.state.postText,
      }),
    })
      .then((resp) => resp.json())
      .then((newUser) => {
        console.log("New user added successfully", newUser);
        this.getInfo();
      })
      .catch((err) => console.error("Error:", err));
  }

  handleChange = (event) => {
    this.setState({ editText: event.target.value })
  }

  handleAddPerson = (event) => {
    this.setState({ postText: event.target.value })
  };

  componentDidMount() {
    this.getInfo();
  }

  render() {
    const { data } = this.state

    return (
      <>
        <div className="input-and-button">
            <input
              placeholder="Add person"
              type="text"
              id="newUserNameInput"
              value={this.postText}
              onChange={this.handleAddPerson}
            />
            <button className="add_btn" onClick={this.addPerson} >Add</button>
        </div>

        <div className="container">
        {data.length ? data.map((item) => {
          return (
            <div key={item.id} className="user">
              <img src={item.avatar} alt="user-avatar" className="user-avatar" />
              <span>{item.name}</span>
              <div className="btns">
                <button className="del_btn" onClick={() => this.handleDelete(item.id)}>
                  Delete
                </button>
              </div>
              <div>
                <input type="text" placeholder="New Name" value={this.editText} onChange={this.handleChange} />
                <button className="edit_btn" onClick={() => this.handleEdit(item.id)}>Edit</button>
              </div>
            </div>
          )
        }) : <div>Loading</div>}
      </div>
      </>
    )
  }
}

export default App
