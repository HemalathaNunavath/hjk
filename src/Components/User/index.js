import React, { useState, useEffect } from "react";

import './index.css'

const User = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", email: "", department: "" });
  const [error, setError] = useState("");
  const apiUrl = "https://jsonplaceholder.typicode.com/users";

  // here we can fetch users on load
  useEffect(() => {
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch(() => setError("Failed to load users."));
  }, []);

  // here we can handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // here we can Add or Edit user
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = formData.id ? "PUT" : "POST";
    const url = formData.id ? `${apiUrl}/${formData.id}` : apiUrl;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (method === "POST") {
          setUsers([...users, { ...formData, id: data.id }]);
        } else {
          setUsers(users.map((user) => (user.id === formData.id ? formData : user)));
        }
        setFormData({ id: "", name: "", email: "", department: "" });
      })
      .catch(() => setError("Failed to save user."));
  };

  
  const handleDelete = (id) => {
    fetch(`${apiUrl}/${id}`, { method: "DELETE" })
      .then(() => setUsers(users.filter((user) => user.id !== id)))
      .catch(() => setError("Failed to delete user."));
  };


  const handleEdit = (user) => {
    setFormData(user);
  };

  return (
    <div className = "bg-container">
    <div style={{ padding: "20px" }}>
      <h1>User Management</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* this part was User Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ marginRight: "10px" }}
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ marginRight: "10px" }}
        />
        <input
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          style={{ marginRight: "10px" }}
        />
        <button type="submit">{formData.id ? "Update" : "Add"}</button>
      </form>

      {/* this part was User List  */}
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr className = "table-row">
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.department || "N/A"}</td>
              <td>
                <button className = "edit-button" onClick={() => handleEdit(user)} style={{ marginRight: "5px" }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default User;
