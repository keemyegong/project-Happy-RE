import React, { useState } from 'react';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadPath, setUploadPath] = useState('');
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePathChange = (e) => {
    setUploadPath(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage('파일을 선택하세요.');
      return;
    }
    if (!uploadPath) {
      setMessage('업로드 경로를 입력하세요.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('path', uploadPath);

    try {
      const response = await fetch('http://localhost:8081/s3/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.text();
        setMessage(data);
      } else {
        setMessage('파일 업로드 중 오류 발생: ' + response.statusText);
      }
    } catch (error) {
      setMessage('파일 업로드 중 오류 발생: ' + error.message);
    }
  };

  return (
    <div>
      <h2>파일 업로드</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="file" onChange={handleFileChange} />
        </div>
        <div>
          <input
            type="text"
            placeholder="업로드 경로를 입력하세요"
            value={uploadPath}
            onChange={handlePathChange}
          />
        </div>
        <button type="submit">업로드</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default FileUpload;
