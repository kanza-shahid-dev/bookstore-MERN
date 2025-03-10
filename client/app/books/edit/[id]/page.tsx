"use client";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import Spinner from "@/components/Spinner";
import BackButton from "@/components/BackButton";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";

const EditBook = () => {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [publishYear, setPublishYear] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const navigate = useRouter();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    const fetchBookById = async () => {
      try {
        const response = await fetch(`http://localhost:5000/books/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }
        const data = await response.json();

        setTitle(data.title || ""); // Ensure it doesn't become undefined
        setAuthor(data.author || "");
        setPublishYear(data.publishYear?.toString() || "");
        setLoading(false);
      } catch (err) {
        setLoading(false);
        enqueueSnackbar("An error occurred. Check console.", {
          variant: "error",
        });
        console.error(err);
      }
    };

    fetchBookById();
  }, []);

  const handleEditBook = () => {
    const data = {
      title,
      author,
      publishYear: Number(publishYear), // Ensure it's a number before sending
    };

    setLoading(true);
    axios
      .put(`http://localhost:5000/books/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Book edited successfully", { variant: "success" });
        navigate.push("/");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error editing book", { variant: "error" });
        console.error(error);
      });
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Edit Book</h1>
      {loading ? <Spinner /> : null}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2  w-full "
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Publish Year</label>
          <input
            type="number"
            value={publishYear}
            onChange={(e) => setPublishYear(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2  w-full "
          />
        </div>
        <button className="p-2 bg-sky-300 m-8" onClick={handleEditBook}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditBook;
