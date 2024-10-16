
"use client";

import { useState } from "react";
import { GoAlertFill } from "react-icons/go";
import { IoCheckmarkCircleSharp } from "react-icons/io5";

export default function EditSportsNewsForm() {
  const [title, setTitle] = useState("");
  const [League, setLeague] = useState("");
  const [image, setImage] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!title || !League || !image || !author || !content) {
      setIsAlertModalOpen(true);
      return;
    }
  
    const response = await fetch('/api/appnews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, league: League, image, author, content }),
    });
  
    if (response.ok) {
      setIsSuccessModalOpen(true);
    } else {
      console.error('Failed to save news');
      setIsAlertModalOpen(true);
    }
  };
  

  const closeAlertModal = () => {
    setIsAlertModalOpen(false);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans font-bold">
      <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg w-1/2">
        <h2 className="text-3xl font-semibold text-center mb-6">เพิ่มข่าวกีฬา</h2>

        <div className="flex space-x-4 mb-4">
          <div className="form-control flex-1">
            <label htmlFor="title" className="label">
              <span className="label-text text-xl">หัวข้อข่าว:</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input input-bordered w-full text-xl"
            />
          </div>

          <div className="form-control flex-1">
            <label htmlFor="League" className="label">
              <span className="label-text text-xl">ลีก:</span>
            </label>
            <select
              id="League"
              value={League}
              onChange={(e) => setLeague(e.target.value)}
              className="select select-bordered w-full text-xl"
            >
              <option value="" disabled>เลือกลีก</option>
              <option value="PremierLeague">English Premier League</option>
              <option value="LaLiga">Spanish La Liga</option>
              <option value="Bundesliga">German Bundesliga</option>
              <option value="SerieA">Italian Serie A</option>
              <option value="Ligue1">French Ligue 1</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-4 mb-4">
          <div className="form-control flex-1">
            <label htmlFor="image" className="label">
              <span className="label-text text-xl">Image URL:</span>
            </label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="input input-bordered w-full text-xl"
            />
          </div>

          <div className="form-control flex-1">
            <label htmlFor="author" className="label">
              <span className="label-text text-xl">ผู้เขียน:</span>
            </label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="input input-bordered w-full text-xl"
            />
          </div>
        </div>

        <div className="form-control mb-6">
          <label htmlFor="content" className="label">
            <span className="label-text text-xl">เนื้อหา:</span>
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea textarea-bordered w-full text-l"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          อัปเดตข่าวกีฬา
        </button>
      </form>

      {/* Modal for alert */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box">
              <div className="flex items-center space-x-2 mb-4">
                <GoAlertFill className="text-red-500 text-2xl" />
                <h2 className="text-xl font-semibold">แจ้งเตือน</h2>
              </div>
              <p className="mt-4">กรุณากรอกข้อมูลให้ครบทุกช่อง</p>
              <div className="modal-action">
                <button onClick={closeAlertModal} className="btn btn-error">ตกลง</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeAlertModal}></div>
        </div>
      )}

      {/* Modal for success */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box">
              <div className="flex items-center space-x-2 mb-4">
                <IoCheckmarkCircleSharp className="text-green-500 text-2xl" />
                <h2 className="text-xl font-semibold">สำเร็จ</h2>
              </div>
              <p className="mt-4">ข่าวกีฬาได้รับการอัปเดตเรียบร้อยแล้ว!</p>
              <div className="modal-action">
                <button onClick={closeSuccessModal} className="btn btn-success">ตกลง</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop" onClick={closeSuccessModal}></div>
        </div>
      )}
    </div>
  );
}
