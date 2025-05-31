import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [proveedores, setProveedores] = useState([]);
  const [form, setForm] = useState({ nombre: '', direccion: '' });
  const [editId, setEditId] = useState(null);

  const API_URL = 'http://localhost:3000/proveedores';

  // Leer proveedores al cargar
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setProveedores(data));
  }, []);

  // Cambios en los inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Crear o actualizar proveedor
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editId ? 'PUT' : 'POST';
    const url = editId ? `${API_URL}/${editId}` : API_URL;

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    })
      .then(() => {
        setForm({ nombre: '', direccion: '' });
        setEditId(null);
        return fetch(API_URL);
      })
      .then(res => res.json())
      .then(data => setProveedores(data));
  };

  // Editar proveedor
  const handleEdit = (proveedor) => {
    setForm({
      nombre: proveedor.nombre,
      direccion: proveedor.direccion
    });
    setEditId(proveedor.id);
  };

  // Eliminar proveedor
  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
      .then(() => fetch(API_URL))
      .then(res => res.json())
      .then(data => setProveedores(data));
  };

  return (
    <>
      <h1>Gestión de Proveedores</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
        />
        <input
          name="direccion"
          placeholder="Dirección"
          value={form.direccion}
          onChange={handleChange}
        />
        <button type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            proveedores.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.nombre}</td>
                <td>{item.direccion}</td>
                <td>
                  <button onClick={() => handleEdit(item)}>Editar</button>
                  <button onClick={() => handleDelete(item.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </>
  );
}

export default App;