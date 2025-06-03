import React, { useState } from 'react';

function ImageUpload() {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.type.startsWith('image/')) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadStatus('📤 อัปโหลดเรียบร้อยแล้ว');
    } else {
      setUploadStatus('❌ กรุณาอัปโหลดเฉพาะไฟล์ภาพ (jpg, png)');
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h3>📸 อัปโหลดภาพรายได้จาก LINE MAN หรือธนาคาร</h3>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      {uploadStatus && <p>{uploadStatus}</p>}
      {previewUrl && (
        <div>
          <p>🖼️ พรีวิวรูปที่อัปโหลด:</p>
          <img src={previewUrl} alt="Income Proof" style={{ maxWidth: '300px', borderRadius: '10px', border: '1px solid #ccc' }} />
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
