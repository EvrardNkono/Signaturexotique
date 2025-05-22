import { useEffect, useState } from 'react';
import { API_URL } from '../config';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch(`${API_URL}/users`)
    .then((res) => res.json())
    .then((data) => {
      console.log('Réponse API utilisateurs :', data);

      // Vérifie si c'est bien un tableau
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (Array.isArray(data.users)) {
        setUsers(data.users); // au cas où ce serait { users: [...] }
      } else {
        console.error('Format de réponse inattendu pour les utilisateurs:', data);
        setUsers([]); // sécurité
      }

      setLoading(false);
    })
    .catch((err) => {
      console.error('Erreur chargement des utilisateurs :', err);
      setLoading(false);
    });
}, []);


  if (loading) return <p className="p-4">Chargement des utilisateurs...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-orange-600">Utilisateurs inscrits</h2>
      {users.length === 0 ? (
        <p>Aucun utilisateur enregistré.</p>
      ) : (
        <table className="w-full border-collapse shadow-lg">
          <thead>
            <tr className="bg-orange-100 text-sm text-left">
              <th className="border px-3 py-2">Nom</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Téléphone</th>
              <th className="border px-3 py-2">Offres ?</th>
              <th className="border px-3 py-2">Inscription</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-orange-50 text-sm">
                <td className="border px-3 py-2">{user.nom}</td>
                <td className="border px-3 py-2">{user.email}</td>
                <td className="border px-3 py-2">{user.num_tel}</td>
                <td className="border px-3 py-2 text-center">
                  {user.accept_offers ? '✅' : '❌'}
                </td>
                <td className="border px-3 py-2">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsers;
