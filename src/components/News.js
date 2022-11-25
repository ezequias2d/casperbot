import { collection, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Button } from "react-bootstrap";
import { db } from "../firebase-config";
import NewsModal from "./NewsModal";

const editHandler = async (news, id) => {
  const docRef = doc(collection(db, 'news'), id);
  try {
    await updateDoc(docRef, news);
  } catch (err) {
    alert(err);
  }
};

const News = props => {
  const deleteHandler = async () => {
    if (window.confirm("Você tem certeza que quer deletar?")) {
      try {
        await deleteDoc(doc(db, "news", props.id));
      }
      catch (err) {
        alert(err);
      }
    }
  }

  const limitString = (str) => {
    const length = 40;
    return str.length > length - 3
      ? `${str.substring(0, length)}...`
      : str;
  };

  return (
    <tr>
      <th scope="row">{props.id}</th>
      <td>{limitString(props.item.title)}</td>
      <td>{limitString(props.item.description)}</td>
      <td>{limitString(props.item.topic)}</td>
      <td>
        <a href={props.item.link}>Link</a>
      </td>
      <td>
        <a href={props.item.image}>
          <img src={props.item.image} alt='NewsImage' width='auto' height='64' />
        </a>
      </td>
      {
        props.hasUser &&
        <td>
          <div style={{ display: "flex" }}>
            <div style={{ padding: 2 }}>
              <NewsModal variant="secondary" news={props.item} name="Editar" id={props.id} onSave={editHandler} />
            </div>
            <div style={{ padding: 2 }}>
              <Button variant="danger" onClick={deleteHandler}>Deletar</Button>
            </div>
          </div>
        </td>
      }
    </tr >
  );
};

export default News