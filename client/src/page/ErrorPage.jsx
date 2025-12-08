import { useRouteError, Link, useNavigate } from "react-router-dom";
import "./ErrorPage.css";

function ErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  function handleGoBack() {
    navigate(-1);
  }

  let title = "An error occurred";
  let message = "Sorry, something went wrong.";
  let imageUrl =
    "https://cdn.dribbble.com/userupload/21626638/file/original-00fb06a706f33285cf52a8d7f3366c40.png";

  if (error?.status === 404) {
    title = "404 - Page Not Found";
    message = "Sorry, the page you are looking for does not exist.";
    imageUrl =
      "https://cdn.dribbble.com/userupload/41781155/file/original-877505e306afb4820c7ffa3de9159c6b";
  } else if (error?.status === 500) {
    title = "500 - Internal Server Error";
    message = "Sorry, something went wrong on our end.";
    imageUrl =
      "https://cdn.dribbble.com/userupload/26512557/file/original-767403b1e3694511188af6622f9831f1.gif";
  } else if (error?.status === 401) {
    title = "401 - Unauthorized";
    message = "Sorry, you are not authorized to view this page.";
    imageUrl =
      "https://cdn.dribbble.com/userupload/42147088/file/original-33ab8b67969aa2604c025778b505b102.jpg";
  }

  return (
    <div className="error-page">
      <h1>{title}</h1>
      <p>{message}</p>
      <img src={imageUrl} alt={title} />
      {/* <Link to="/" className="error-page-link">Go back to HomePage</Link> */}
      <button className="error-page-link" onClick={handleGoBack}>
        Go back
      </button>
    </div>
  );
}

export default ErrorPage;
