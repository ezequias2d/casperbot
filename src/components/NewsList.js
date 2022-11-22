import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase-config";
import News from "./News";
import NewsModal from "./NewsModal";

const NewsList = props => {
  const [hasUser, setHasUser] = useState(false);
  const [user] = useAuthState(auth);
  const [news, setNews] = useState([])

  useEffect(() => {
    setHasUser(user !== null)
  }, [user])

  useEffect(() => {
    const query = collection(db, 'news');
    onSnapshot(query, (querySnapshot) => {
      setNews(querySnapshot.docs.map(doc => ({
        id: doc.id,
        data: doc.data(),
      })))
    })
  }, [])

  const createHandle = async (news) => {
    try {
      await addDoc(collection(db, 'news'), news);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div id='portfolio' className='container text-center bg-grey' >
      <h2 style={{ marginTop: 16, marginBottom: 16 }}>News</h2>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Título</th>
            <th scope="col">Descrição</th>
            <th scope="col">Tema</th>
            <th scope="col">Link</th>
            <th scope="col">Imagem</th>
          </tr>
        </thead>
        <tbody>

          {Object.keys(news).map((key) => (
            <News key={key} id={news[key].id} item={news[key].data} hasUser={hasUser} />
          ))}
        </tbody>
      </table>

      <div className="float-end">
        <NewsModal
          variant="primary"
          news={{
            title: "Novo Titulo",
            topic: "Esportes",
            image: "",
            description: "Nova descrição",
            link: "Link para noticia",
          }}
          name="Criar"
          id={props.id}
          onSave={createHandle} />
      </div>
    </div>
  );
};

export default NewsList;