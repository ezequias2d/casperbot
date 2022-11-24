import { useState } from "react";
import { storage } from "../firebase-config"
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { Button, Modal, Form, Image } from "react-bootstrap";

const NewsModal = props => {
  const [progresspercent, setProgresspercent] = useState(0);
  const [title, setTitle] = useState(props.news.title);
  const [description, setDescription] = useState(props.news.description);
  const [topic, setTopic] = useState(props.news.topic);
  const [link, setLink] = useState(props.news.link);
  const [image, setImage] = useState(props.news.image);
  const [file, setFile] = useState('');
  const [show, setShow] = useState(false);
  const httpsPattern = /^https:\/\//i;
  const httpPattern = /^http:\/\//i;

  const postNews = async () => {
    if (!(httpsPattern.test(link) || httpPattern.test(link)))
      return;
      
    if (file) {
      const storageRef = ref(storage, `files/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      await uploadTask.on("state_changed",
        (snapshot) => {
          const progress =
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgresspercent(progress);
        },
        (error) => {
          alert(error)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            setImage(downloadURL);
            await props.onSave({
              title: title,
              topic: topic,
              image: downloadURL,
              description: description,
              link: link,
            }, props.id);
          })
        }
      )
    }
    else {
      await props.onSave({
        title: title,
        topic: topic,
        image: image,
        description: description,
        link: link,
      }, props.id);
    }
    setShow(false)
  }

  const handleClose = () => setShow(false);

  const handleShow = () => {
    setTitle(props.news.title);
    setDescription(props.news.description);
    setTopic(props.news.topic);
    setLink(props.news.link);
    setImage(props.news.image);
    setShow(true);
  }

  return (
    <>
      <Button variant={props.variant} onClick={handleShow}>
        {props.name}
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.Name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                placeholder="Título"
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tema</Form.Label>
              <Form.Select
                placeholder="Tema"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="Esportes">Esportes</option>
                <option value="Política">Política</option>
                <option value="Entretenimento">Entretenimento</option>
                <option value="Famosos">Famosos</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                placeholder="Link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                isInvalid={!(httpsPattern.test(link) || httpPattern.test(link))}
              />
              <Form.Control.Feedback type="invalid">
                O link precisa ser um caminho absoluto prefixado com "https://"" ou "http://""
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Imagem</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>

            {
              !image &&
              <Form.Group className="mb-3">
                <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
              </Form.Group>
            }
            {
              image &&
              <Form.Group className="mb-3">
                <Image
                  src={image}
                  thumbnail={true} />
              </Form.Group>
            }
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
          <Button variant="primary" onClick={postNews}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NewsModal;