import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);

  function deleteUser(_id) {
    const promise = fetch(`http://localhost:8000/users/${_id}`, {
      method: "DELETE",
    });

    return promise;
  }

  function removeOneCharacter(index) {
    const userId = characters[index]._id;
    deleteUser(userId)
      .then((response) => {
        if (response.status === 204) {
          const updated = characters.filter((character, i) => {
            return i !== index;
          });
          setCharacters(updated);
        } else {
          console.log(`Incorrect status code ${response.status}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }
  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function updateList(person) {
    postUser(person)
      .then((response) => {
        if (response.status === 201) {
          return response.json();
        } else {
          console.log(`Incorrect status code ${response.status}`);
        }
      })
      .then((success) => {
        setCharacters([...characters, success.createdUser]);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  useEffect(() => {
    fetchUsers()
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        setCharacters(json);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
